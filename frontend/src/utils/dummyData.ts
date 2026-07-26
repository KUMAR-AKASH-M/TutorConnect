import { Tutor, Session, User } from '../types';

export const dummyTutors: Tutor[] = [
  {
    id: 't1',
    userId: 'u2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    role: 'tutor',
    bio: 'Experienced Math and Physics tutor with a passion for helping students succeed.',
    subjects: ['Mathematics', 'Physics'],
    hourlyRate: 45,
    rating: 4.8,
    reviewsCount: 124,
    experience: 5,
    qualifications: ['BSc Mathematics', 'MSc Physics'],
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: 't2',
    userId: 'u3',
    name: 'Rahul Patel',
    email: 'rahul@example.com',
    role: 'tutor',
    bio: 'Software engineer teaching Computer Science and Programming fundamentals.',
    subjects: ['Computer Science', 'Python', 'JavaScript'],
    hourlyRate: 60,
    rating: 4.9,
    reviewsCount: 89,
    experience: 7,
    qualifications: ['BSc Computer Science', 'AWS Certified'],
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: 't3',
    userId: 'u4',
    name: 'Ananya Desai',
    email: 'ananya@example.com',
    role: 'tutor',
    bio: 'Native language speaker with a degree in linguistics and literature.',
    subjects: ['English', 'Literature'],
    hourlyRate: 35,
    rating: 4.7,
    reviewsCount: 201,
    experience: 4,
    qualifications: ['BA English', 'TEFL Certified'],
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
  },
  {
    id: 't4',
    userId: 'u5',
    name: 'Vikram Singh',
    email: 'vikram@example.com',
    role: 'tutor',
    bio: 'Passionate chemistry tutor helping students ace their exams and practicals.',
    subjects: ['Chemistry', 'Biology'],
    hourlyRate: 50,
    rating: 4.6,
    reviewsCount: 156,
    experience: 6,
    qualifications: ['BSc Chemistry', 'MSc Biochemistry'],
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
  },
  {
    id: 't5',
    userId: 'u6',
    name: 'Neha Gupta',
    email: 'neha@example.com',
    role: 'tutor',
    bio: 'Specialist in high school and college level mathematics and statistics.',
    subjects: ['Mathematics', 'Statistics'],
    hourlyRate: 55,
    rating: 5.0,
    reviewsCount: 312,
    experience: 8,
    qualifications: ['PhD Mathematics'],
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg'
  }
];

export const dummySessions: Session[] = [
  {
    id: 's1',
    tutorId: 't1',
    studentId: 'u1',
    tutorName: 'Priya Sharma',
    studentName: 'Alex Doe',
    subject: 'Mathematics',
    date: '2026-07-25',
    startTime: '10:00',
    endTime: '11:00',
    status: 'Confirmed'
  },
  {
    id: 's2',
    tutorId: 't2',
    studentId: 'u1',
    tutorName: 'Rahul Patel',
    studentName: 'Alex Doe',
    subject: 'Python',
    date: '2026-07-20',
    startTime: '15:00',
    endTime: '16:00',
    status: 'Completed'
  }
];

export const currentUser: User = {
  id: 'u1',
  name: 'Alex Doe',
  email: 'alex@example.com',
  role: 'student',
  avatar: 'https://i.pravatar.cc/150?u=alex'
};
