import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  doc,
  getDoc
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Message, UserProfile } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Send, Sparkles, Smile, Image as ImageIcon, MoreVertical, Mic, Lock } from 'lucide-react';

export function ChatPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<Partial<UserProfile> | null>(null);
  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchId || !user) return;

    const fetchMatch = async () => {
      try {
        const matchDoc = await getDoc(doc(db, 'matches', matchId));
        if (matchDoc.exists()) {
          const otherId = matchDoc.data().users.find((id: string) => id !== user.uid);
          if (otherId) {
            setOtherUser({
              uid: otherId,
              displayName: 'Elite Partner',
              photoURL: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80',
              onlineStatus: 'online'
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchMatch();

    const q = query(
      collection(db, `matches/${matchId}/messages`),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Message[];
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [matchId, user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !matchId || !user) return;

    const messageText = text;
    setText('');

    await addDoc(collection(db, `matches/${matchId}/messages`), {
      senderId: user.uid,
      text: messageText,
      type: 'text',
      createdAt: serverTimestamp(),
      read: false
    });
  };

  return (
    <div className="relative flex h-screen flex-col bg-background overflow-hidden selection:bg-primary/30">
      
      {/* Header */}
      <header className="relative z-50 flex items-center justify-between px-4 py-3 bg-surface/90 backdrop-blur-md border-b border-border h-16">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors text-white/50 hover:text-white"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-hover">
                <img 
                    src={otherUser?.photoURL || `https://ui-avatars.com/api/?name=${otherUser?.displayName || 'User'}&background=random`} 
                    className="w-full h-full object-cover"
                    alt={otherUser?.displayName}
                />
              </div>
              {otherUser?.onlineStatus === 'online' && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
              )}
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white">
                {otherUser?.displayName || 'Elite Member'}
              </h2>
              <p className="text-[11px] font-medium text-text-muted">Active now</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
           <button className="p-2 rounded-full hover:bg-white/5 transition-colors text-white/50 hover:text-white">
             <MoreVertical size={20} />
           </button>
        </div>
      </header>

      {/* Messages Area */}
      <main className="relative flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-hide">
        <div className="flex flex-col items-center justify-center py-6">
           <div className="p-3 rounded-full bg-surface-hover mb-3 text-text-muted">
             <Lock size={16} />
           </div>
           <p className="text-xs text-text-muted">End-to-end encrypted</p>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((message, index) => {
            const isMe = message.senderId === user?.uid;
            return (
              <div
                key={message.id || index}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`peer relative max-w-[75%]`}>
                  <div className={`
                    px-4 py-2 text-[15px] leading-relaxed
                    ${isMe 
                      ? 'bg-primary text-white rounded-2xl rounded-br-sm' 
                      : 'bg-surface-hover text-white rounded-2xl rounded-bl-sm border border-border'
                    }
                  `}>
                    {message.text}
                  </div>
                  <div className={`mt-1 text-[10px] text-text-muted ${isMe ? 'text-right' : 'text-left'}`}>
                      {message.createdAt ? (message.createdAt as any).toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
                  </div>
                </div>
              </div>
            );
          })}
        </AnimatePresence>
        <div ref={scrollRef} />
      </main>

      {/* Input Area */}
      <footer className="relative z-50 p-4 bg-background border-t border-border">
        <div className="relative flex items-end gap-2 bg-surface rounded-full border border-border px-3 py-1">
          <button className="p-2 rounded-full hover:bg-surface-hover transition-colors text-text-muted hover:text-white flex-shrink-0">
            <Smile size={20} />
          </button>
          <form onSubmit={handleSend} className="flex-1 min-h-[44px] flex items-center">
            <input 
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Message..."
              className="w-full bg-transparent border-none text-[15px] focus:ring-0 placeholder:text-text-muted px-2 py-2 outline-none"
            />
          </form>
          {text.trim() ? (
            <button 
              onClick={handleSend}
              className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary-hover transition-colors mb-1.5"
            >
              <Send size={14} className="ml-0.5" />
            </button>
          ) : (
             <button className="p-2 rounded-full hover:bg-surface-hover transition-colors text-text-muted hover:text-white flex-shrink-0 mb-1">
                <Mic size={20} />
              </button>
          )}
        </div>
      </footer>
    </div>
  );
}
