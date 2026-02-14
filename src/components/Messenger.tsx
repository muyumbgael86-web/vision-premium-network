import React, { useState } from 'react';
import { MessageCircle, Search, Send, Image, Paperclip, MoreVertical, Phone, Video, ArrowLeft, Check, CheckCheck } from 'lucide-react';

interface MessengerProps {
  user: any;
}

// Simulated contacts for demo
const CONTACTS = [
  { id: '1', name: 'Marie-Claire', avatar: 'https://picsum.photos/seed/marie/200', lastMessage: 'Merci pour ton aide! 🙏', time: '2m', unread: 2, online: true },
  { id: '2', name: 'Jean-Pierre', avatar: 'https://picsum.photos/seed/jean/200', lastMessage: 'On se voit demain?', time: '15m', unread: 0, online: true },
  { id: '3', name: 'Aminata', avatar: 'https://picsum.photos/seed/aminata/200', lastMessage: 'Super idea! 👍', time: '1h', unread: 1, online: false },
  { id: '4', name: 'Robert', avatar: 'https://picsum.photos/seed/robert/200', lastMessage: 'Le match commence à 20h', time: '2h', unread: 0, online: true },
  { id: '5', name: 'Fatou', avatar: 'https://picsum.photos/seed/fatou/200', lastMessage: 'À tout à l\'heure!', time: '3h', unread: 0, online: false },
  { id: '6', name: 'Michel', avatar: 'https://picsum.photos/seed/michel/200', lastMessage: 'Bien reçu, merci!', time: '5h', unread: 0, online: true },
  { id: '7', name: 'Sophie', avatar: 'https://picsum.photos/seed/sophie/200', lastMessage: 'Tu vas au événement?', time: 'Hier', unread: 0, online: false },
  { id: '8', name: 'Paul', avatar: 'https://picsum.photos/seed/paul/200', lastMessage: 'OK pas de souci', time: 'Hier', unread: 0, online: true },
];

const DEMO_MESSAGES: { [key: string]: { id: string; text: string; sender: 'me' | 'them'; time: string; read: boolean }[] } = {
  '1': [
    { id: '1', text: 'Salut! Comment vas-tu?', sender: 'them', time: '10:30', read: true },
    { id: '2', text: 'Je vais bien merci! Et toi?', sender: 'me', time: '10:32', read: true },
    { id: '3', text: 'Je prépare l\'événement de ce weekend', sender: 'them', time: '10:33', read: true },
    { id: '4', text: 'Tu peux m\'aider avec la decoration?', sender: 'them', time: '10:33', read: true },
    { id: '5', text: 'Bien sûr, avec plaisir! 🎉', sender: 'me', time: '10:35', read: true },
    { id: '6', text: 'Merci pour ton aide! 🙏', sender: 'them', time: '10:36', read: true },
  ],
  '2': [
    { id: '1', text: 'Coucou, tu es dispo demain?', sender: 'them', time: 'Hier', read: true },
    { id: '2', text: 'Oui, pourquoi?', sender: 'me', time: 'Hier', read: true },
    { id: '3', text: 'On se voit demain?', sender: 'them', time: '15m', read: false },
  ],
};

const Messenger: React.FC<MessengerProps> = ({ user }) => {
  const [selectedContact, setSelectedContact] = useState<typeof CONTACTS[0] | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<{ id: string; text: string; sender: 'me' | 'them'; time: string; read: boolean }[]>([]);

  const filteredContacts = CONTACTS.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedContact) return;
    
    const newMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'me' as const,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    
    setMessages([...messages, newMessage]);
    setMessageText('');
    
    // Simulate reply
    setTimeout(() => {
      const reply = {
        id: (Date.now() + 1).toString(),
        text: 'Merci pour ton message! Je te réponds ASAP 👋',
        sender: 'them' as const,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        read: false
      };
      setMessages(prev => [...prev, reply]);
    }, 2000);
  };

  const openChat = (contact: typeof CONTACTS[0]) => {
    setSelectedContact(contact);
    setMessages(DEMO_MESSAGES[contact.id] || [
      { id: '1', text: 'Salut! Comment vas-tu?', sender: 'them', time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }), read: true }
    ]);
  };

  return (
    <div className="h-[calc(100vh-100px)] md:h-[calc(100vh-80px)] flex">
      {/* Contacts List */}
      <div className={`w-full md:w-80 flex flex-col ${selectedContact ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full bg-gray-100 rounded-full pl-10 pr-4 py-2 text-sm outline-none"
            />
          </div>
        </div>

        {/* Contacts */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => openChat(contact)}
              className={`w-full p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${contact.unread > 0 ? 'bg-indigo-50' : ''}`}
            >
              <div className="relative">
                <img src={contact.avatar} alt={contact.name} className="w-14 h-14 rounded-full object-cover" />
                {contact.online && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`font-semibold ${contact.unread > 0 ? 'text-gray-900' : 'text-gray-700'}`}>{contact.name}</p>
                  <span className="text-xs text-gray-400">{contact.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className={`text-sm truncate ${contact.unread > 0 ? 'font-medium text-gray-800' : 'text-gray-500'}`}>
                    {contact.lastMessage}
                  </p>
                  {contact.unread > 0 && (
                    <span className="bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedContact && (
        <div className={`flex-1 flex flex-col ${!selectedContact ? 'hidden md:flex' : 'flex'}`}>
          {/* Chat Header */}
          <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedContact(null)} className="md:hidden p-1">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <img src={selectedContact.avatar} alt="" className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold text-gray-900">{selectedContact.name}</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  {selectedContact.online ? 'En ligne' : 'Hors ligne'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Phone className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Video className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${msg.sender === 'me' ? 'order-2' : ''}`}>
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      msg.sender === 'me'
                        ? 'bg-indigo-600 text-white rounded-br-md'
                        : 'bg-white text-gray-900 shadow-sm rounded-bl-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className={`flex items-center gap-1 mt-1 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[10px] text-gray-400">{msg.time}</span>
                    {msg.sender === 'me' && (
                      msg.read ? (
                        <CheckCheck className="w-3 h-3 text-indigo-400" />
                      ) : (
                        <Check className="w-3 h-3 text-gray-400" />
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Image className="w-5 h-5 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Paperclip className="w-5 h-5 text-gray-500" />
              </button>
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Envoyer un message..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="p-2 bg-indigo-600 text-white rounded-full disabled:opacity-50 hover:bg-indigo-700"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedContact && (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center text-gray-400">
          <MessageCircle className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg">Sélectionnez une conversation</p>
          <p className="text-sm">pour commencer à discuter</p>
        </div>
      )}
    </div>
  );
};

export default Messenger;
