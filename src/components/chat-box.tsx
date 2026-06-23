'use client';

import { useState } from 'react';
import { X, MessageCircle, Send } from 'lucide-react';

export function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: 'user' | 'assistant' }>>([
    {
      id: '1',
      text: 'Hello! I\'m here to help you find meaningful connections. How can I assist you today?',
      sender: 'assistant',
    },
    {
      id: '2',
      text: 'Can you show me profiles from Mumbai?',
      sender: 'user',
    },
    {
      id: '3',
      text: 'Of course! I can help you filter profiles by city, profession, interests, and more. Would you like to see specific criteria?',
      sender: 'assistant',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: `${Date.now()}`,
      text: inputText,
      sender: 'user' as const,
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputText('');

    // Simulate assistant response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-response`,
          text: 'That\'s a great question! Let me help you explore those options.',
          sender: 'assistant',
        },
      ]);
    }, 800);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Panel Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chat Panel Slide-in */}
      <div
        className={`fixed right-0 top-0 z-50 h-screen w-full max-w-md transform bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-100 bg-gradient-to-r from-brand-50 to-brand-100 p-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl">⭐</div>
            <div>
              <h3 className="font-semibold text-brand-900">Starlit Assistant</h3>
              <div className="flex items-center gap-2 text-xs text-brand-600">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                Online
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1 text-brand-600 transition hover:bg-brand-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex h-[calc(100%-140px)] flex-col gap-4 overflow-y-auto p-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-2xl px-4 py-3 max-w-xs text-sm ${
                  message.sender === 'user'
                    ? 'bg-brand-600 text-white'
                    : 'bg-brand-50 text-brand-900'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-brand-100 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 rounded-2xl border border-brand-200 bg-white px-4 py-2.5 text-sm text-brand-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
            <button
              onClick={handleSend}
              className="rounded-2xl bg-brand-600 p-2.5 text-white transition hover:bg-brand-700"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
