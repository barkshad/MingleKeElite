import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const { user } = userCredential;

        // Initialize profile
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          displayName: name,
          email: user.email,
          createdAt: serverTimestamp(),
          isActivated: false,
          onboardingCompleted: false,
          photos: [],
          isVerified: false,
          coins: 10, // Starting bonus
          referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
          onlineStatus: 'online',
          lastSeen: serverTimestamp(),
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-6">
      
      <div className="z-10 w-full max-w-md surface-card bg-surface shadow-2xl">
        <div className="relative p-8 text-center border-b border-border">
          <h2 className="text-2xl font-bold tracking-tight">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="mt-2 text-sm text-text-secondary">
            {isLogin ? 'Enter your details to sign in' : 'Start your social journey'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-8">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative flex flex-col gap-4 overflow-hidden mb-4"
              >
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-white placeholder-white/40 transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                  />
                </div>
                
                <div className="flex items-start gap-3 mt-2">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    required 
                    className="mt-1 accent-primary" 
                  />
                  <label htmlFor="terms" className="text-[11px] text-text-muted leading-relaxed">
                    I agree to the <a href="#" className="underline hover:text-white">Terms</a> and <a href="#" className="underline hover:text-white">Privacy Policy</a>.
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-white placeholder-white/40 transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-white placeholder-white/40 transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
            />
          </div>

          {error && (
            <p className="text-center text-sm font-medium text-red-500 bg-red-500/10 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="pt-2">
            <button 
              type="submit" 
              className="btn-primary w-full" 
              disabled={loading}
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </div>

          <div className="text-center pt-4 border-t border-border mt-6">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-text-secondary hover:text-white transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
