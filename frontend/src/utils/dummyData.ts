import { Tutor, Session, User } from '../types';

export const dummyTutors: Tutor[] = [
  {
    id: 't1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'tutor',
    bio: 'Experienced Math and Physics tutor with a passion for helping students succeed.',
    subjects: ['Mathematics', 'Physics'],
    hourlyRate: 45,
    rating: 4.8,
    reviewsCount: 124,
    experience: 5,
    qualifications: ['BSc Mathematics', 'MSc Physics'],
    avatar: 'https://i.pravatar.cc/150?u=sarah'
  },
  {
    id: 't2',
    name: 'Michael Chen',
    email: 'michael@example.com',
    role: 'tutor',
    bio: 'Software engineer teaching Computer Science and Programming fundamentals.',
    subjects: ['Computer Science', 'Python', 'JavaScript'],
    hourlyRate: 60,
    rating: 4.9,
    reviewsCount: 89,
    experience: 7,
    qualifications: ['BSc Computer Science', 'AWS Certified'],
    avatar: 'https://i.pravatar.cc/150?u=michael'
  },
  {
    id: 't3',
    name: 'Emma Williams',
    email: 'emma@example.com',
    role: 'tutor',
    bio: 'Native Spanish speaker with a degree in linguistics.',
    subjects: ['Spanish', 'English Literature'],
    hourlyRate: 35,
    rating: 4.7,
    reviewsCount: 201,
    experience: 4,
    qualifications: ['BA Linguistics', 'TEFL Certified'],
    avatar: 'https://i.pravatar.cc/150?u=emma'
  }
];

export const dummySessions: Session[] = [
  {
    id: 's1',
    tutorId: 't1',
    studentId: 'u1',
    tutorName: 'Sarah Johnson',
    studentName: 'Alex Doe',
    subject: 'Mathematics',
    date: '2026-07-25',
    startTime: '10:00',
    endTime: '11:00',
    status: 'upcoming',
    price: 45
  },
  {
    id: 's2',
    tutorId: 't2',
    studentId: 'u1',
    tutorName: 'Michael Chen',
    studentName: 'Alex Doe',
    subject: 'Python',
    date: '2026-07-20',
    startTime: '15:00',
    endTime: '16:00',
    status: 'completed',
    price: 60
  }
];

export const currentUser: User = {
  id: 'u1',
  name: 'Alex Doe',
  email: 'alex@example.com',
  role: 'student',
  avatar: 'https://i.pravatar.cc/150?u=alex'
};
