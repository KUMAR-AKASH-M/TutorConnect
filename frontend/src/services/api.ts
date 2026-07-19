import axios from 'axios';
import { dummyTutors, dummySessions, currentUser } from '../utils/dummyData';
import { Role } from '../types';

const api = axios.create({
  baseURL: '/api',
});

// Mock interceptor to simulate API calls
api.interceptors.request.use(async (config) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return config;
});

// We can export mock functions directly since we don't have a real backend yet
export const getTutors = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return { data: dummyTutors };
};

export const getTutorById = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const tutor = dummyTutors.find(t => t.id === id);
  if (!tutor) throw new Error('Tutor not found');
  return { data: tutor };
};

export const getSessions = async () => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return { data: dummySessions };
};

export const getCurrentUser = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  // In a real app, this would get the user from a token
  // For dummy purposes, we simulate getting the currently logged-in user
  const role = (typeof window !== 'undefined' ? localStorage.getItem('tutorconnect_role') || 'student' : 'student') as Role;
  
  return { 
    data: { 
      ...currentUser, 
      role,
      name: role === 'tutor' ? 'Sarah Johnson' : role === 'admin' ? 'Admin User' : 'Alex Doe',
      id: role === 'tutor' ? 't1' : role === 'admin' ? 'a1' : 'u1'
    } 
  };
};

export const login = async (data: { email: string; password?: string }) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Mock login logic
  if (data.email.includes('admin')) {
    localStorage.setItem('tutorconnect_role', 'admin');
  } else if (data.email.includes('tutor')) {
    localStorage.setItem('tutorconnect_role', 'tutor');
  } else {
    localStorage.setItem('tutorconnect_role', 'student');
  }
  return { data: { token: 'mock-jwt-token' } };
};

export const logout = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  localStorage.removeItem('tutorconnect_role');
  return { data: { success: true } };
};

export default api;
