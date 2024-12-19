import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { ApiKeyInput } from './components/ApiKeyInput';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { useChatMessages } from './hooks/useChatMessages';
import { ChatState } from './types/chat';

function App() {
  const [apiKey, setApiKey] = useState('');
  const { messages, isLoading, currentStreamingContent, sendMessage } = useChatMessages(apiKey);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm min-h-[700px] flex flex-col">
          <div className="border-b p-4">
            <div className="flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-blue-500 mr-3" />
              <h1 className="text-2xl font-semibold text-gray-900">英文法チューター</h1>
            </div>
          </div>

          <div className="p-4 border-b">
            <ApiKeyInput
              apiKey={apiKey}
              onApiKeyChange={setApiKey}
            />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.filter(m => m.role !== 'system').map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {currentStreamingContent && (
              <ChatMessage
                message={{
                  role: 'assistant',
                  content: currentStreamingContent
                }}
              />
            )}
          </div>

          <div className="border-t p-4">
            <ChatInput
              onSendMessage={sendMessage}
              disabled={!apiKey || isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;