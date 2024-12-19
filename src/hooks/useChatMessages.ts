import { useState } from 'react';
import OpenAI from 'openai';
import { Message, ChatState } from '../types/chat';

export function useChatMessages(apiKey: string) {
  const [state, setState] = useState<ChatState>({
    messages: [
      {
        role: 'system',
        content: '日本語で応答してください。あなたは親切なアシスタントです。'
      }
    ],
    apiKey: '',
    isLoading: false,
    currentStreamingContent: ''
  });

  const sendMessage = async (content: string) => {
    if (!apiKey) return;

    const newMessage: Message = { role: 'user', content };
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      isLoading: true,
      currentStreamingContent: ''
    }));

    try {
      const client = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });

      const stream = await client.chat.completions.create({
        model: "ft:gpt-4o-mini-2024-07-18:personal:eg007:AQmwiXKK",
        messages: [...state.messages, newMessage],
        temperature: 0.7,
        stream: true
      });

      let fullContent = '';
      
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullContent += content;
        
        setState(prev => ({
          ...prev,
          currentStreamingContent: fullContent
        }));
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: fullContent
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
        currentStreamingContent: ''
      }));
    } catch (error) {
      console.error('Error:', error);
      setState(prev => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            role: 'assistant',
            content: 'エラーが発生しました。APIキーを確認してください。'
          }
        ],
        isLoading: false,
        currentStreamingContent: ''
      }));
    }
  };

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    currentStreamingContent: state.currentStreamingContent,
    sendMessage
  };
}