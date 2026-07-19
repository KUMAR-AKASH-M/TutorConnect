export type Role = 'student' | 'tutor' | 'admin';

export interface User {
  id: string; // Map from backend _id
  name: string;
  email: string;
  role: Role;
  avatar?: string; // Map from backend profilePicture
  bio?: string;
}

export interface Tutor extends User {
  role: 'tutor';
  userId: string; // The User._id, while id is TutorProfile._id
  subjects: string[];
  hourlyRate: number;
  rating: number;
  reviewsCount: number;
  experience: number;
  qualifications: string[];
}

export interface Session {
  id: string;
  tutorId: string;
  studentId: string;
  tutorName: string;
  studentName: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  notes?: string;
}
