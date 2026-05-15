'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Loader2, User, Copy, CheckCheck, Wand2, FolderPlus } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  projectData?: GeneratedProject;
}

interface GeneratedProject {
  title: string;
  description: string;
  budget: number;
  timeline: string;
  skills: string[];
  milestones: { title: string; description: string; amount: number; duration: string }[];
}

const SUGGESTIONS = [
  'I need a mobile app for food delivery with real-time tracking',
  'Build an e-commerce store with AI product recommendations',
  'Create a SaaS dashboard for marketing analytics',
  'Develop a blockchain-based NFT marketplace',
];

export default function AIChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Hello! I'm your AI Project Manager powered by Groq. 🚀\n\nTell me about your project idea and I'll help you:\n- **Define the scope** clearly\n- **Break it into milestones**\n- **Estimate budget & timeline**\n- **Recommend the right skills**\n- **Find top freelancers**\n\nWhat do you want to build today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generatedProject, setGeneratedProject] = useState<GeneratedProject | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const response = await api.post('/ai/chat', {
        message: messageText,
        history,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date(),
        projectData: response.data.projectData,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (response.data.projectData) {
        setGeneratedProject(response.data.projectData);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please check your connection and try again.',
          timestamp: new Date(),
        },
      ]);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const createProject = async () => {
    if (!generatedProject) return;
    setIsCreatingProject(true);
    try {
      const response = await api.post('/projects', generatedProject);
      toast.success('Project created successfully!');
      router.push(`/dashboard/client/projects/${response.data.project._id}`);
    } catch {
      toast.error('Failed to create project');
    } finally {
      setIsCreatingProject(false);
    }
  };

  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-cyan-300 text-sm font-mono">$1</code>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 gap-4">
      {/* Header */}
      <div className="glass-card rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-cyan-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-white">AI Project Planner</h1>
            <div className="flex items-center gap-1.5 text-xs text-green-400">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Powered by Groq
            </div>
          </div>
        </div>
        {generatedProject && (
          <button
            onClick={createProject}
            disabled={isCreatingProject}
            className="btn-primary flex items-center gap-2"
          >
            {isCreatingProject ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderPlus className="w-4 h-4" />}
            Create Project
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {/* Suggestions (show when only initial message) */}
        {messages.length === 1 && (
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Try one of these ideas:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-left text-sm p-3 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 hover:border-cyan-500/30 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
              message.role === 'assistant'
                ? 'bg-gradient-to-br from-cyan-600 to-cyan-600'
                : 'bg-gradient-to-br from-gray-600 to-gray-700'
            }`}>
              {message.role === 'assistant' ? (
                <Bot className="w-4 h-4 text-white" />
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>

            {/* Bubble */}
            <div className={`max-w-[80%] group ${message.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                message.role === 'assistant'
                  ? 'glass-card text-gray-100'
                  : 'bg-gradient-to-r from-cyan-600 to-sky-700 text-white'
              }`}>
                <div dangerouslySetInnerHTML={{ __html: formatContent(message.content) }} />
              </div>

              {/* Generated Project Card */}
              {message.projectData && (
                <div className="glass-card rounded-xl p-4 w-full mt-2 border border-cyan-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Wand2 className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-semibold text-cyan-300">Generated Project Plan</span>
                  </div>
                  <h3 className="font-bold text-white mb-1">{message.projectData.title}</h3>
                  <p className="text-xs text-gray-400 mb-3">{message.projectData.description}</p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-white/5 rounded-lg p-2">
                      <div className="text-xs text-gray-400">Budget</div>
                      <div className="text-sm font-semibold text-green-400">₹{message.projectData.budget?.toLocaleString()}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2">
                      <div className="text-xs text-gray-400">Timeline</div>
                      <div className="text-sm font-semibold text-blue-400">{message.projectData.timeline}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {message.projectData.skills?.map((skill) => (
                      <span key={skill} className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <button
                  onClick={() => copyMessage(message.id, message.content)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copiedId === message.id ? (
                    <CheckCheck className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-400 hover:text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="glass-card rounded-2xl px-4 py-3">
              <div className="flex gap-1 items-center h-5">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="glass-card rounded-xl p-3 flex items-end gap-3">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your project idea... (Enter to send, Shift+Enter for new line)"
          rows={1}
          style={{ resize: 'none', maxHeight: '120px' }}
          className="flex-1 bg-transparent text-gray-100 placeholder-gray-500 text-sm outline-none leading-relaxed"
          onInput={(e) => {
            const t = e.target as HTMLTextAreaElement;
            t.style.height = 'auto';
            t.style.height = Math.min(t.scrollHeight, 120) + 'px';
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || isLoading}
          className="w-9 h-9 flex-shrink-0 rounded-lg bg-gradient-to-r from-cyan-600 to-sky-700 hover:from-cyan-500 hover:to-sky-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all"
        >
          {isLoading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
        </button>
      </div>
    </div>
  );
}

