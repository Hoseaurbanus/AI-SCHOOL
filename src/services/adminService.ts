import { api } from '../lib/api';
import type { AdminStats, Transaction, Certificate, KnowledgeBase, Course, User } from '../types';

export const adminService = {
  getStats: async () => {
    const { data } = await api.get('/admin/stats');
    return data.data;
  },

  getCourses: async () => {
    const { data } = await api.get('/admin/courses');
    return data.data;
  },

  createCourse: async (course: Partial<Course>) => {
    const { data } = await api.post('/admin/courses', course);
    return data.data;
  },

  updateCourse: async (id: string, course: Partial<Course>) => {
    const { data } = await api.put(`/admin/courses/${id}`, course);
    return data.data;
  },

  deleteCourse: async (id: string) => {
    await api.delete(`/admin/courses/${id}`);
  },

  getUsers: async () => {
    const { data } = await api.get('/admin/users');
    return data.data;
  },

  createUser: async (user: Partial<User>) => {
    const { data } = await api.post('/admin/users', user);
    return data.data;
  },

  updateUser: async (id: string, user: Partial<User>) => {
    const { data } = await api.put(`/admin/users/${id}`, user);
    return data.data;
  },

  deleteUser: async (id: string) => {
    await api.delete(`/admin/users/${id}`);
  },

  getTransactions: async () => {
    const { data } = await api.get('/admin/transactions');
    return data.data;
  },

  getCertificates: async () => {
    const { data } = await api.get('/admin/certificates');
    return data.data;
  },

  verifyCertificate: async (id: string) => {
    const { data } = await api.get(`/admin/certificates/${id}/verify`);
    return data.data;
  },

  getKnowledgeBases: async () => {
    const { data } = await api.get('/admin/knowledge-bases');
    return data.data;
  },

  createKnowledgeBase: async (kb: Partial<KnowledgeBase>) => {
    const { data } = await api.post('/admin/knowledge-bases', kb);
    return data.data;
  },

  deleteKnowledgeBase: async (id: string) => {
    await api.delete(`/admin/knowledge-bases/${id}`);
  },
};
