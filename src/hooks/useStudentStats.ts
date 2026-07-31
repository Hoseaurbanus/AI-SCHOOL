import { useQuery } from '@tanstack/react-query';
import { aiService } from '../services/aiService';

export function useStudentStats() {
  return useQuery({
    queryKey: ['studentStats'],
    queryFn: () => aiService.getStudentStats(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAIInsights() {
  return useQuery({
    queryKey: ['aiInsights'],
    queryFn: () => aiService.getInsights(),
    staleTime: 10 * 60 * 1000,
  });
}
