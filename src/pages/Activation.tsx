import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Sparkles, Crown, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export function ActivationPage() {
  const { profile } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  if (profile?.isActivated) {
    return <Navigate to="/discover" />;
  }

  const handlePaymentRedirect = () => {
    setIsRedirecting(true);
    // Redirect to external payment provider
    window.location.href = "https://lipana.dev/pay/mingleke";
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex flex-col justify-center items-center px-6">
      {/* Background Atmosphere */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center relative z-10 max-w-2xl"
      >
        <div className="mx-auto w-24 h-24 bg-gradient-to-tr from-primary to-secondary rounded-[32px] shadow-neon flex items-center justify-center mb-10 rotate-3 animate-float">
          <Crown size={48} className="text-white" />
        </div>
        
        <h1 className="font-display text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-6">
          ACTIVATE <br />
          <span className="text-gradient">ELITE ACCESS</span>
        </h1>
        
        <p className="text-white/40 text-lg md:text-xl font-medium max-w-md mx-auto uppercase tracking-widest text-[10px] leading-relaxed mb-12">
          Chatvibe is a verified community of high-energy individuals. One-time activation unlocks the full VIP experience.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-12">
           {[
             { icon: <ShieldCheck className="text-primary" />, label: "Verified Profile" },
             { icon: <Zap className="text-secondary" />, label: "Priority Reach" },
             { icon: <Sparkles className="text-primary" />, label: "Elite Badge" },
             { icon: <Star className="text-secondary" />, label: "Daily Streaks" }
           ].map((item, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 + i * 0.1 }}
               className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all group"
             >
                <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">{item.label}</span>
             </motion.div>
           ))}
        </div>

        <div className="space-y-6">
          <button 
            onClick={handlePaymentRedirect}
            disabled={isRedirecting}
            className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-primary hover:text-white transition-all shadow-neon flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{isRedirecting ? 'REDIRECTING...' : 'JOIN THE ELITE (KES 100)'}</span>
            <ArrowRight size={18} className="ml-3 group-hover:translate-x-2 transition-transform" />
          </button>
          <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Secure payment via LipaNa</p>
        </div>
      </motion.div>
    </div>
  );
}
