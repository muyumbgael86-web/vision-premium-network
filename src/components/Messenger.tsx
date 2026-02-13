import React, { useState } from 'react';
import { MessageCircle, Send, User } from 'lucide-react';

interface MessengerProps {
  user: any;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
}

const Messenger: React.FC<MessengerProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      content: inputText,
      timestamp: Date.now()
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const mockChats = [
    { id: '1', name: 'Marie Dupont', avatar: 'https://picsum.photos/seed/marie/200/200', lastMessage: 'Salut ça va?' },
    { id: '2', name: 'Jean Martin', avatar: 'https://picsum.photos/seed/jean/200/200', lastMessage: 'À demain!' },
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex">
      <div className="w-1/3 border-r border-white/10 overflow-y-auto">
        <h1 className="text-2xl font-bold p-4">Messages</h1>
        {mockChats.map((chat) => (
          <div key={chat.id} onClick={() => setSelectedChat(chat.id)} className={`p-4 cursor-pointer hover:bg-white/5 transition-colors ${selectedChat === chat.id ? 'bg-indigo-500/10' : ''}`}>
            <div className="flex items-center gap-3">
              <img src={chat.avatar} className="w-12 h-12 rounded-full" alt="" />
              <div className="flex-1">
                <p className="font-medium">{chat.name}</p>
                <p className="text-sm text-zinc-500 truncate">{chat.lastMessage}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <img src={mockChats.find(c => c.id === selectedChat)?.avatar} className="w-10 h-10 rounded-full" alt="" />
              <span className="font-medium">{mockChats.find(c => c.id === selectedChat)?.name}</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.filter(m => m.senderId === user.id || m.senderId === selectedChat).map((msg) => (
                <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'} mb-2`}>
                  <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.senderId === user.id ? 'bg-indigo-600 text-white' : 'bg-white/10'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="p-4 border-t border-white/10 flex gap-2">
              <input value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Message..." className="flex-1 bg-white/5 rounded-full px-4 py-2 outline-none border border-white/10" />
              <button type="submit" className="p-2 bg-indigo-600 rounded-full"><Send className="w-5 h-5" /></button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-500">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Sélectionnez une conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messenger;
