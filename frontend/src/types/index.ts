export type Role = 'student' | 'tutor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  bio?: string;
}

export interface Tutor extends User {
  role: 'tutor';
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
  status: 'upcoming' | 'completed' | 'cancelled';
  price: number;
}
