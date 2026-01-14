
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Mic, Volume2, Search, Info } from 'lucide-react';
import { GeminiService } from '../services/geminiService';

interface AIOverlayProps {
  mode: 'chat' | 'voice' | null;
  onClose: () => void;
}

const AIOverlay: React.FC<AIOverlayProps> = ({ mode, onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string, sources?: any[] }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      if (userMsg.toLowerCase().includes('search') || userMsg.toLowerCase().includes('latest')) {
        const result = await GeminiService.searchSkills(userMsg);
        setMessages(prev => [...prev, { role: 'bot', text: result.text, sources: result.sources }]);
      } else {
        const response = await GeminiService.chat(userMsg);
        setMessages(prev => [...prev, { role: 'bot', text: response || 'I am thinking...' }]);
      }
    } catch (error) {
        setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting to my brain right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!mode) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
        <div className="flex items-center gap-3">
          {mode === 'voice' ? <Mic className="w-5 h-5 text-indigo-400" /> : <MessageSquare className="w-5 h-5 text-blue-400" />}
          <h2 className="font-bold">{mode === 'chat' ? 'AI Mentor' : 'Live Session'}</h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-slate-500 text-sm">Ask me anything about your tracks, projects, or industry trends!</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
              m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'
            }`}>
              {m.text}
              {m.sources && m.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-200">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                    <Search className="w-3 h-3" /> Sources
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {m.sources.map((s, si) => (
                      <a key={si} href={s.web?.uri} target="_blank" rel="noreferrer" className="text-[10px] bg-white text-blue-600 px-2 py-0.5 rounded border border-blue-100 truncate max-w-[150px]">
                        {s.web?.title || 'Link'}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-3 rounded-2xl flex gap-1">
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100">
        {mode === 'chat' ? (
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
            <button 
              onClick={handleSend}
              className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4">
             <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center animate-pulse">
                <Mic className="w-10 h-10 text-indigo-600" />
             </div>
             <p className="text-sm font-medium text-slate-600">Listening to you...</p>
             <button onClick={onClose} className="px-6 py-2 bg-red-100 text-red-600 rounded-full text-sm font-bold hover:bg-red-200">
                End Session
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper for complex icons
const MessageSquare = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);

const Sparkles = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
);

export default AIOverlay;
