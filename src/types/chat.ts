export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatState {
  messages: Message[];
  apiKey: string;
  isLoading: boolean;
  currentStreamingContent: string;
}