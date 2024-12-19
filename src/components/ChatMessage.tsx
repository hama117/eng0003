import React from 'react';
import { User, Bot } from 'lucide-react';
import { Message } from '../types/chat';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  const formatMessage = (content: string) => {
    const lines = content.split('\n');
    
    return lines.map((line, index) => {
      const isListItem = /^(\d+\.|[-•*])/.test(line.trim());
      
      return (
        <React.Fragment key={index}>
          {index > 0 && <br />}
          <span className={isListItem ? 'block pl-4' : ''}>
            {line}
          </span>
        </React.Fragment>
      );
    });
  };

  return (
    <div className={`flex items-start space-x-4 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isUser ? 'bg-blue-500' : 'bg-gray-500'
      }`}>
        {isUser ? <User className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-white" />}
      </div>
      <div className={`flex-1 max-w-4xl ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block rounded-lg px-6 py-3 whitespace-pre-line ${
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'
        }`}>
          {formatMessage(message.content)}
        </div>
      </div>
    </div>
  );
}