import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Share2, Users, Trophy, Zap, Gift, Copy, Crown, ArrowRight, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function ReferralPage() {
  const { profile } = useAuth();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (profile?.referralCode) {
      navigator.clipboard.writeText(profile.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative min-h-screen bg-background pb-32">
      <header className="relative z-10 flex flex-col items-center px-4 pt-16 text-center">
        <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
          <Gift size={32} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Invite Friends
        </h1>
        <p className="max-w-xs text-text-secondary text-sm">
          Expand the network and earn rewards for every successful invite.
        </p>
      </header>

      <main className="relative z-10 mt-10 px-4 max-w-lg mx-auto space-y-6">
        {/* Referral Card Bento */}
        <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 surface-card p-6 flex flex-col items-center text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-4">Your Invite Code</p>
                <div className="w-full flex items-center justify-between rounded-xl bg-background border border-border p-2 pl-6">
                    <span className="text-xl font-bold tracking-widest text-text-primary uppercase">{profile?.referralCode || 'ELITE2026'}</span>
                    <button 
                        onClick={handleCopyCode}
                        className={`
                            flex items-center gap-2 rounded-lg px-4 py-2.5 transition-colors text-xs font-semibold uppercase tracking-wider
                            ${copied ? 'bg-green-500 text-white' : 'bg-primary hover:bg-primary-hover text-white'}
                        `}
                    >
                        {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                </div>
                <button className="mt-4 w-full py-3.5 bg-surface-hover text-text-primary font-semibold rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm border border-border">
                    <Share2 size={16} />
                    <span>Share Link</span>
                </button>
            </div>

            {/* Stats */}
            <div className="surface-card p-5 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-secondary/10 rounded-lg text-secondary">
                        <Users size={18} />
                    </div>
                </div>
                <div>
                    <p className="text-3xl font-bold">12</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mt-1">Invites</p>
                </div>
            </div>

            <div className="surface-card p-5 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                        <Zap size={18} />
                    </div>
                </div>
                <div>
                    <p className="text-3xl font-bold">450</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mt-1">Coins Earned</p>
                </div>
            </div>
        </div>

        {/* Gamified Milestones */}
        <div className="pt-6">
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Milestones</h3>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface rounded-full border border-border text-[10px] font-semibold uppercase tracking-wider text-secondary">
                   <Crown size={10} />
                   <span>Tier 4</span>
                </div>
            </div>
            
            <div className="space-y-3">
                {[
                    { label: '5 Successful Invites', reward: 'Elite Badge', progress: 100, completed: true, color: 'bg-primary' },
                    { label: '10 Successful Invites', reward: 'Visibility Boost', progress: 80, completed: false, color: 'bg-secondary' },
                    { label: '50 Successful Invites', reward: 'Founder Lounge Access', progress: 24, completed: false, color: 'bg-primary' }
                ].map((milestone, i) => (
                    <div key={i} className="surface-card p-5">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="text-sm font-semibold">{milestone.label}</h4>
                                    <p className="text-xs text-text-muted mt-1">Reward: {milestone.reward}</p>
                                </div>
                                <div className={`px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider ${milestone.completed ? 'bg-green-500/10 text-green-500' : 'bg-surface-hover text-text-muted'}`}>
                                    {milestone.completed ? 'Claimed' : `${milestone.progress}%`}
                                </div>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-surface-hover overflow-hidden mt-1">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${milestone.progress}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className={`h-full rounded-full ${milestone.color}`}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </main>
    </div>
  );
}
