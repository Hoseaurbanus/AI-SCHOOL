import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aiService } from '../services/aiService';
import { useChatStore } from '../stores/chatStore';
import type { ChatMessage } from '../types';

export function useChat(courseId?: string) {
  const { messages, addMessage, isTyping, setTyping } = useChatStore();
  const queryClient = useQueryClient();

  const { data: historyData } = useQuery({
    queryKey: ['chatHistory', courseId],
    queryFn: () => aiService.getChatHistory(courseId),
    staleTime: 5 * 60 * 1000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (data: { content: string; courseId?: string; lessonId?: string }) =>
      aiService.sendMessage(data),
    onMutate: () => {
      setTyping(true);
    },
    onSuccess: (response) => {
      addMessage(response.data);
      setTyping(false);
      queryClient.invalidateQueries({ queryKey: ['chatHistory', courseId] });
    },
    onError: () => {
      setTyping(false);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'ai',
        content: "I'm having trouble right now. Please try again or contact support.",
        timestamp: new Date().toISOString(),
      };
      addMessage(errorMessage);
    },
  });

  const sendMessage = useCallback(
    (content: string, lessonId?: string) => {
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
        courseId,
        lessonId,
      };
      addMessage(userMessage);
      sendMessageMutation.mutate({ content, courseId, lessonId });
    },
    [addMessage, sendMessageMutation, courseId]
  );

  return {
    messages: historyData?.data ? [...historyData.data, ...messages] : messages,
    sendMessage,
    isTyping,
  };
}
