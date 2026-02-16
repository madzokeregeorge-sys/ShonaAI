import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage } from '../types';
import { initChat, streamMessageToGemini } from '../services/geminiService';
import { saveChatSession } from '../services/firestore';
import { SLANG_DATABASE } from '../data/slangDictionary';
import { Send, Book, Sparkles, X, Search, Database, Code, MessageSquare, Check, ThumbsUp, ThumbsDown, LogOut, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  user: UserProfile;
  uid: string | null;
  onSignOut: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ user, uid, onSignOut }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDictionary, setShowDictionary] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [dictSearch, setDictSearch] = useState('');
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      initChat(user.level, user.goal);
    } catch (err) {
      console.error('Failed to initialize chat:', err);
      setErrorToast('Failed to connect to AI. Please refresh.');
    }

    const greeting: ChatMessage = {
      id: 'init',
      role: 'model',
      text: `Mhoro ${user.name}! (Hello ${user.name}!) Welcome to **ShonaAI**. I'm Mufaro, your tutor.\n\nI can help you with grammar, common phrases, or the latest street slang from our database. Ndeipi?`,
      timestamp: new Date()
    };
    setMessages([greeting]);
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-dismiss error toast
  useEffect(() => {
    if (errorToast) {
      const timer = setTimeout(() => setErrorToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorToast]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (input.toLowerCase().trim() === 'feedback') {
      setShowFeedback(true);
      setInput('');
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const aiMsgId = (Date.now() + 1).toString();
    const initialAiMsg: ChatMessage = {
      id: aiMsgId,
      role: 'model',
      text: '',
      timestamp: new Date(),
      retrievedContext: []
    };
    setMessages(prev => [...prev, initialAiMsg]);

    try {
      let fullResponse = "";
      const { context } = await streamMessageToGemini(userMsg.text, (chunkText) => {
        fullResponse += chunkText;
        setMessages(prev => prev.map(msg =>
          msg.id === aiMsgId ? { ...msg, text: fullResponse } : msg
        ));
      });

      setMessages(prev => prev.map(msg =>
        msg.id === aiMsgId ? { ...msg, retrievedContext: context } : msg
      ));
    } catch (err: any) {
      const errorMessage = err?.message || '';

      // Smart error handling — different messages for different errors
      let displayError: string;
      if (errorMessage.includes('Rate limit') || errorMessage.includes('Ndapota, mira')) {
        displayError = errorMessage; // Rate limit message is already user-friendly
      } else if (errorMessage.includes('API key') || errorMessage.includes('401') || errorMessage.includes('403')) {
        displayError = 'Pane dambudziko neAPI key. (There\'s an API key issue.) Please contact support.';
      } else if (errorMessage.includes('timed out') || errorMessage.includes('timeout')) {
        displayError = 'Yakanga yakanonoka. (It took too long.) Please try again.';
      } else if (errorMessage.includes('Session expired')) {
        displayError = errorMessage;
      } else {
        displayError = 'Mambo, ndarasikirwa netiweki. (I lost my connection.) Try again?';
      }

      setMessages(prev => prev.map(msg =>
        msg.id === aiMsgId ? { ...msg, text: displayError } : msg
      ));
      setErrorToast(displayError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChat = async () => {
    if (!uid || messages.length < 2) return;
    const result = await saveChatSession(uid, messages);
    if (result) {
      setErrorToast(null);
      setFeedbackSent(true);
      setTimeout(() => setFeedbackSent(false), 2000);
    }
  };

  const handleQuickFeedback = (_id: string, _type: 'up' | 'down') => {
    setFeedbackSent(true);
    setTimeout(() => setFeedbackSent(false), 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filteredSlang = SLANG_DATABASE.filter(item =>
    item.term.toLowerCase().includes(dictSearch.toLowerCase()) ||
    item.definition.toLowerCase().includes(dictSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto shadow-2xl relative overflow-hidden">
      <div className="zim-strip"></div>

      {/* Header */}
      <div className="bg-white p-4 border-b border-stone-100 flex justify-between items-center z-10 sticky top-0 pt-safe-top">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 bg-zim-black rounded-full flex items-center justify-center text-white font-bold border-2 border-stone-100 shadow-sm">
              S
            </div>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-zim-green border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="font-bold text-zim-black text-lg leading-tight">Mufaro AI</h3>
            <div className="flex items-center text-xs text-zim-green font-semibold">
              <Sparkles className="w-3 h-3 mr-1 fill-current" />
              ShonaAI Engine
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setShowFeedback(true)} className="p-2 text-stone-400 hover:text-zim-red hover:bg-red-50 rounded-full transition-colors">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button onClick={() => setShowDebug(!showDebug)} className={`p-2 rounded-full transition-colors ${showDebug ? 'bg-zim-yellow text-zim-black' : 'text-stone-400 hover:bg-stone-50'}`}>
            <Code className="w-5 h-5" />
          </button>
          <button onClick={onSignOut} className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Sign Out">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Error Toast */}
      {errorToast && (
        <div className="mx-4 mt-2 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl animate-in slide-in-from-top duration-200">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">{errorToast}</span>
          <button onClick={() => setErrorToast(null)} className="text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide bg-stone-50 pb-10">
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col gap-2">
            <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`relative max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                  ? 'bg-zim-green text-white rounded-br-none shadow-zim-green/20'
                  : 'bg-white text-stone-800 border border-stone-100 rounded-bl-none'
                }`}
              >
                {msg.role === 'model' ? (
                  <div className="markdown-body">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                    {msg.id !== 'init' && !isLoading && (
                      <div className="mt-3 pt-3 border-t border-stone-50 flex justify-between items-center">
                        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Rate ShonaAI?</span>
                        <div className="flex gap-2">
                          <button onClick={() => handleQuickFeedback(msg.id, 'up')} className="p-1.5 hover:bg-green-50 rounded text-stone-400 hover:text-zim-green transition-colors"><ThumbsUp className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleQuickFeedback(msg.id, 'down')} className="p-1.5 hover:bg-red-50 rounded text-stone-400 hover:text-zim-red transition-colors"><ThumbsDown className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            </div>

            {/* RAG Debug Inspector */}
            {showDebug && msg.retrievedContext && msg.retrievedContext.length > 0 && (
              <div className="max-w-[85%] self-start ml-2 bg-stone-900 rounded-xl p-3 border border-zim-yellow/30 shadow-xl">
                <div className="flex items-center justify-between mb-2 border-b border-stone-700 pb-2">
                  <div className="flex items-center gap-2 text-zim-yellow text-[10px] font-bold uppercase tracking-wider">
                    <Database className="w-3 h-3" />
                    Knowledge Source (RAG)
                  </div>
                </div>
                <div className="space-y-2">
                  {msg.retrievedContext.map((ctx, i) => (
                    <div key={i} className="text-[10px] text-stone-300 font-mono leading-relaxed bg-white/5 p-2 rounded border border-white/5">
                      <span className="text-zim-yellow mr-2">[{i + 1}]</span>{ctx}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && messages[messages.length - 1].role === 'user' && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-stone-100 shadow-sm flex gap-2 items-center">
              <div className="w-1.5 h-1.5 bg-zim-green rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-zim-green rounded-full animate-bounce delay-100"></div>
              <div className="w-1.5 h-1.5 bg-zim-green rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-stone-100 z-10 pb-safe-bottom">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDictionary(true)}
            className="p-3 text-stone-400 hover:text-zim-green hover:bg-green-50 rounded-xl transition-all"
          >
            <Book className="w-6 h-6" />
          </button>
          <div className="flex-1 relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about slang or grammar..."
              className="w-full pl-4 pr-10 py-3.5 bg-stone-100 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-zim-green focus:ring-4 focus:ring-green-500/10 transition-all text-stone-900 placeholder-stone-400"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3.5 bg-zim-black text-white rounded-2xl shadow-lg hover:bg-stone-800 disabled:opacity-50 transition-all active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Slang Dictionary Modal */}
      {showDictionary && (
        <div className="absolute inset-0 z-50 flex flex-col bg-white pt-safe-top">
          <div className="p-4 border-b border-stone-100 bg-white flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-zim-black">Slang Library</h2>
              <p className="text-xs text-stone-400">Knowledge Base: ShonaSlang.com</p>
            </div>
            <button onClick={() => setShowDictionary(false)} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200">
              <X className="w-5 h-5 text-stone-600" />
            </button>
          </div>

          <div className="p-4 bg-stone-50 border-b border-stone-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search database..."
                value={dictSearch}
                onChange={(e) => setDictSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-zim-green text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-safe-bottom">
            {filteredSlang.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-stone-100 bg-white shadow-sm hover:border-zim-green transition-colors cursor-pointer" onClick={() => {
                setInput(`What does "${item.term}" mean?`);
                setShowDictionary(false);
              }}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-zim-black text-lg">{item.term}</h3>
                  <div className="flex gap-1">
                    {item.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-stone-100 text-[10px] font-bold text-stone-500 uppercase tracking-wider">{tag}</span>
                    ))}
                  </div>
                </div>
                <p className="text-stone-600 text-sm mb-2">{item.definition}</p>
                <p className="text-xs text-zim-green italic">"{item.example}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl">
            {!feedbackSent ? (
              <>
                <h3 className="text-xl font-bold text-zim-black mb-2">ShonaAI Feedback</h3>
                <p className="text-stone-500 text-sm mb-4">Report an error or suggest an improvement.</p>
                <textarea
                  className="w-full h-32 p-3 bg-stone-50 rounded-xl border border-stone-200 focus:border-zim-green focus:outline-none resize-none mb-4 text-sm"
                  placeholder="Describe the issue..."
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                />
                <div className="flex gap-3">
                  <button onClick={() => setShowFeedback(false)} className="flex-1 py-3 text-stone-500 font-bold hover:bg-stone-50 rounded-xl transition-colors">Cancel</button>
                  <button onClick={() => { setFeedbackSent(true); setTimeout(() => setShowFeedback(false), 2000); }} className="flex-1 py-3 bg-zim-black text-white font-bold rounded-xl hover:bg-stone-800 shadow-lg">Submit</button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600"><Check className="w-8 h-8" /></div>
                <h3 className="text-xl font-bold text-zim-black">Maita Basa!</h3>
                <p className="text-stone-500 text-sm">Feedback submitted to the ShonaAI team.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {feedbackSent && !showFeedback && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-zim-black text-white px-6 py-3 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 z-[100]">
          <Check className="w-4 h-4 text-zim-green" /> ShonaAI Feedback Received.
        </div>
      )}
    </div>
  );
};
