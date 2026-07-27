const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const getTokenCookieOptions = () => {
  const cookieExpireDays = parseInt(process.env.COOKIE_EXPIRES_DAYS, 10) || 7;
  return {
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };
};

const setTokenCookie = (res, token) => {
  res.cookie('token', token, getTokenCookieOptions());
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id, user.role);
  setTokenCookie(res, token);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      profilePicture: user.profilePicture,
    },
  });
};

module.exports = { generateToken, sendTokenResponse, setTokenCookie };
