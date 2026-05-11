'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { io, Socket } from 'socket.io-client';
import { Send, Loader2, Search, MessageSquare, Check, CheckCheck } from 'lucide-react';

interface Conversation {
  userId: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastTime?: string;
  unread?: number;
}

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read?: boolean;
}

let socket: Socket | null = null;

export default function MessagesPage() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Init socket
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
      withCredentials: true,
    });

    socket.on('connect', () => console.log('Socket connected'));
    socket.on('newMessage', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    const fetchConversations = async () => {
      try {
        const res = await api.get('/chat/conversations');
        setConversations(res.data.conversations || []);
      } catch {
        setConversations([]);
      } finally {
        setLoadingConvs(false);
      }
    };
    fetchConversations();

    return () => {
      socket?.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openConversation = async (conv: Conversation) => {
    setActiveConv(conv);
    setLoadingMsgs(true);
    try {
      const res = await api.get(`/chat/${conv.userId}`);
      setMessages(res.data.messages || []);
    } catch {
      setMessages([]);
    } finally {
      setLoadingMsgs(false);
    }
  };

  const sendMessage = () => {
    if (!input.trim() || !activeConv || !socket) return;
    const msg = {
      receiverId: activeConv.userId,
      content: input.trim(),
    };
    socket.emit('sendMessage', msg);
    setMessages((prev) => [
      ...prev,
      {
        _id: Date.now().toString(),
        senderId: user?._id || '',
        receiverId: activeConv.userId,
        content: input.trim(),
        createdAt: new Date().toISOString(),
      },
    ]);
    setInput('');
  };

  const filteredConvs = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-0px)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h1 className="text-lg font-semibold text-white mb-3">Messages</h1>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="input-field pl-9 w-full text-sm"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingConvs ? (
            <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-violet-400" /></div>
          ) : filteredConvs.length === 0 ? (
            <div className="text-center py-10">
              <MessageSquare className="w-10 h-10 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No conversations yet</p>
            </div>
          ) : (
            filteredConvs.map((conv) => (
              <button
                key={conv.userId}
                onClick={() => openConversation(conv)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 ${
                  activeConv?.userId === conv.userId ? 'bg-violet-600/20' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {conv.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white truncate">{conv.name}</span>
                    {conv.lastTime && <span className="text-xs text-gray-500">{conv.lastTime}</span>}
                  </div>
                  {conv.lastMessage && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">{conv.lastMessage}</p>
                  )}
                </div>
                {conv.unread && conv.unread > 0 && (
                  <span className="bg-violet-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                    {conv.unread}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center text-white font-bold">
                {activeConv.name[0]}
              </div>
              <div>
                <div className="font-medium text-white">{activeConv.name}</div>
                <div className="flex items-center gap-1.5 text-xs text-green-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Online
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingMsgs ? (
                <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-violet-400" /></div>
              ) : messages.length === 0 ? (
                <div className="text-center py-10">
                  <MessageSquare className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No messages yet. Say hello!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId === user?._id;
                  return (
                    <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                        isMe
                          ? 'bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-br-sm'
                          : 'glass-card text-gray-100 rounded-bl-sm'
                      }`}>
                        <p>{msg.content}</p>
                        <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : ''}`}>
                          <span className="text-xs opacity-60">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMe && (
                            msg.read
                              ? <CheckCheck className="w-3 h-3 opacity-60" />
                              : <Check className="w-3 h-3 opacity-60" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-3 items-end">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
                  }}
                  placeholder="Type a message..."
                  rows={1}
                  style={{ resize: 'none', maxHeight: '100px' }}
                  className="flex-1 bg-white/5 border border-white/10 text-gray-100 placeholder-gray-500 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-violet-500/50 transition-colors"
                  onInput={(e) => {
                    const t = e.target as HTMLTextAreaElement;
                    t.style.height = 'auto';
                    t.style.height = Math.min(t.scrollHeight, 100) + 'px';
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 disabled:opacity-40 flex items-center justify-center transition-all"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Your Messages</h3>
              <p className="text-gray-400">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
