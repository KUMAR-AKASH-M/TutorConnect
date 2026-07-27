const crypto = require('crypto');
const User = require('../users/User');
const TutorProfile = require('../tutors/TutorProfile');
const StudentProfile = require('../users/StudentProfile');
const { generateToken, sendTokenResponse, setTokenCookie } = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

const getClientUrl = () => process.env.CLIENT_URL || 'http://localhost:3000';

const getGoogleRedirectUri = () =>
  process.env.GOOGLE_REDIRECT_URI || `${getClientUrl().replace(/\/$/, '')}/api/auth/google/callback`;

const getGoogleStateCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 10 * 60 * 1000,
});

const encodeState = (state) => Buffer.from(JSON.stringify(state)).toString('base64url');

const decodeState = (state) => {
  try {
    return JSON.parse(Buffer.from(state, 'base64url').toString('utf8'));
  } catch (error) {
    return null;
  }
};

const redirectWithGoogleError = (res, message) => {
  const url = new URL('/auth/google/success', getClientUrl());
  url.searchParams.set('error', message);
  return res.redirect(url.toString());
};

const ensureProfileForUser = async (user, hourlyRate = 35) => {
  if (user.role === 'Tutor') {
    const existingProfile = await TutorProfile.findOne({ user: user._id });
    if (!existingProfile) {
      await TutorProfile.create({ user: user._id, hourlyRate });
    }
    return;
  }

  if (user.role === 'Student') {
    const existingProfile = await StudentProfile.findOne({ user: user._id });
    if (!existingProfile) {
      await StudentProfile.create({ user: user._id });
    }
  }
};

// @desc    Register a new user (Student or Tutor)
// @route   POST /auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, hourlyRate } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered.' });
    }

    const allowedRoles = ['Student', 'Tutor'];
    const finalRole = allowedRoles.includes(role) ? role : 'Student';

    const user = await User.create({ name, email, password, role: finalRole });

    // Auto-create the matching profile document
    if (finalRole === 'Tutor') {
      await TutorProfile.create({
        user: user._id,
        hourlyRate: hourlyRate || 0,
      });
    } else {
      await StudentProfile.create({ user: user._id });
    }

    // Optional: email verification token
    const verifyToken = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Fire-and-forget verification email (won't break registration if SMTP isn't configured)
    try {
      const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;
      await sendEmail({
        to: user.email,
        subject: 'Verify your TutorConnect account',
        html: `<p>Hi ${user.name}, please verify your email by clicking <a href="${verifyUrl}">this link</a>.</p>`,
      });
    } catch (emailErr) {
      console.warn('Verification email not sent:', emailErr.message);
    }

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed.', error: error.message });
  }
};

// @desc    Login user
// @route   POST /auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account has been deactivated.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed.', error: error.message });
  }
};

// @desc    Start Google OAuth login/signup
// @route   GET /auth/google
// @access  Public
exports.googleAuth = async (req, res) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return redirectWithGoogleError(res, 'Google sign-in is not configured.');
    }

    const requestedRole = String(req.query.role || '').toLowerCase();
    const role = requestedRole === 'tutor' ? 'Tutor' : 'Student';
    const state = {
      nonce: crypto.randomBytes(16).toString('hex'),
      role,
    };
    const encodedState = encodeState(state);

    res.cookie('google_oauth_state', encodedState, getGoogleStateCookieOptions());

    const authUrl = new URL(GOOGLE_AUTH_URL);
    authUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', getGoogleRedirectUri());
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid email profile');
    authUrl.searchParams.set('state', encodedState);
    authUrl.searchParams.set('prompt', 'select_account');

    res.redirect(authUrl.toString());
  } catch (error) {
    redirectWithGoogleError(res, 'Could not start Google sign-in.');
  }
};

// @desc    Complete Google OAuth login/signup
// @route   GET /auth/google/callback
// @access  Public
exports.googleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    const cookieState = req.cookies.google_oauth_state;

    res.clearCookie('google_oauth_state');

    if (!code || !state || !cookieState || state !== cookieState) {
      return redirectWithGoogleError(res, 'Google sign-in could not be verified.');
    }

    const decodedState = decodeState(state);
    const role = decodedState?.role === 'Tutor' ? 'Tutor' : 'Student';

    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: getGoogleRedirectUri(),
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      return redirectWithGoogleError(res, 'Google sign-in failed.');
    }

    const tokenData = await tokenResponse.json();
    const profileResponse = await fetch(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!profileResponse.ok) {
      return redirectWithGoogleError(res, 'Could not read your Google profile.');
    }

    const googleProfile = await profileResponse.json();
    if (!googleProfile.email) {
      return redirectWithGoogleError(res, 'Your Google account does not include an email address.');
    }

    let user = await User.findOne({ email: googleProfile.email.toLowerCase() });

    if (user) {
      user.googleId = user.googleId || googleProfile.sub;
      user.authProvider = user.authProvider === 'local' ? 'local' : 'google';
      user.isEmailVerified = true;
      user.profilePicture = user.profilePicture || googleProfile.picture || '';
      await user.save({ validateBeforeSave: false });
    } else {
      user = await User.create({
        name: googleProfile.name || googleProfile.email.split('@')[0],
        email: googleProfile.email,
        role,
        googleId: googleProfile.sub,
        authProvider: 'google',
        isEmailVerified: true,
        profilePicture: googleProfile.picture || '',
      });
    }

    await ensureProfileForUser(user);

    const token = generateToken(user._id, user.role);
    setTokenCookie(res, token);

    const url = new URL('/auth/google/success', getClientUrl());
    url.searchParams.set('role', user.role.toLowerCase());
    res.redirect(url.toString());
  } catch (error) {
    redirectWithGoogleError(res, 'Google sign-in failed.');
  }
};

// @desc    Logout user - clears auth cookie
// @route   POST /auth/logout
// @access  Private
exports.logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

// @desc    Verify email using token
// @route   GET /auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification link.' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, message: 'Email verified successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Email verification failed.', error: error.message });
  }
};

// @desc    Request password reset - sends reset link via email
// @route   POST /auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Respond the same way whether or not user exists (avoid leaking which emails are registered)
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If that email is registered, a reset link has been sent.',
      });
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'TutorConnect - Password Reset',
        html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to set a new password. This link expires in 1 hour.</p>`,
      });
    } catch (emailErr) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: 'Could not send reset email.' });
    }

    res.status(200).json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Request failed.', error: error.message });
  }
};

// @desc    Reset password using token
// @route   PUT /auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset link.' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Password reset failed.', error: error.message });
  }
};
