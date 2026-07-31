import { api } from '../lib/api';
import type { ChatMessage, AIInsight, StudentStats, ApiResponse } from '../types';

export const aiService = {
  sendMessage: async (data: {
    content: string;
    courseId?: string;
    lessonId?: string;
  }): Promise<ApiResponse<ChatMessage>> => {
    const { data: response } = await api.post('/ai/chat', data);
    return response;
  },

  getChatHistory: async (courseId?: string): Promise<ApiResponse<ChatMessage[]>> => {
    const { data } = await api.get('/ai/chat/history', { params: { courseId } });
    return data;
  },

  getInsights: async (): Promise<ApiResponse<AIInsight[]>> => {
    const { data } = await api.get('/ai/insights');
    return data;
  },

  getStudentStats: async (): Promise<ApiResponse<StudentStats>> => {
    const { data } = await api.get('/ai/stats');
    return data;
  },

  getCodeReview: async (code: string, language: string): Promise<ApiResponse<string>> => {
    const { data } = await api.post('/ai/code-review', { code, language });
    return data;
  },
};
