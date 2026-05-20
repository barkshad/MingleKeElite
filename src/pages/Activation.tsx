import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Sparkles, Crown, ArrowRight, Star, ExternalLink, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export function ActivationPage() {
  const { user, profile } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [hasOpenedPayment, setHasOpenedPayment] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  if (profile?.isActivated) {
    return <Navigate to="/discover" />;
  }

  const handlePaymentRedirect = () => {
    setIsRedirecting(true);
    // Open payment link in a new tab
    window.open("https://lipana.dev/pay/mingleke", "_blank");
    setTimeout(() => {
       setIsRedirecting(false);
       setHasOpenedPayment(true);
    }, 1500);
  };

  const handleVerifyPayment = async () => {
    if (!user) return;
    setIsVerifying(true);
    // Simulate verification delay
    setTimeout(async () => {
        try {
            await updateDoc(doc(db, 'users', user.uid), {
               isActivated: true
            });
            // The profile update will trigger a redirect to /discover
        } catch (error) {
            console.error("Verification failed", error);
            setIsVerifying(false);
        }
    }, 3000);
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
        className="text-center relative z-10 max-w-2xl w-full"
      >
        <div className="mx-auto w-24 h-24 bg-gradient-to-tr from-primary to-secondary rounded-[32px] shadow-neon flex items-center justify-center mb-10 rotate-3 animate-float">
          <Crown size={48} className="text-white" />
        </div>
        
        <h1 className="text-4xl text-center md:text-5xl font-bold tracking-tight mb-4">
          Activate <br />
          <span className="text-primary">Elite Access</span>
        </h1>
        
        <p className="text-text-secondary text-sm md:text-base font-medium max-w-sm mx-auto leading-relaxed mb-10">
          MingleKe is a verified community of high-energy individuals. One-time activation unlocks the full VIP experience.
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

        <div className="space-y-4 max-w-sm mx-auto">
          {!hasOpenedPayment ? (
              <button 
                onClick={handlePaymentRedirect}
                disabled={isRedirecting}
                className="btn-primary w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRedirecting ? 'Opening Link...' : 'Pay with LipaNa (KES 100)'}
                {!isRedirecting && <ExternalLink size={18} className="ml-2" />}
              </button>
          ) : (
              <button 
                onClick={handleVerifyPayment}
                disabled={isVerifying}
                className="w-full py-4 bg-white text-black font-semibold rounded-xl text-base flex items-center justify-center gap-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isVerifying ? 'Verifying Payment...' : 'I have completed payment'}
                {!isVerifying && <CheckCircle size={18} />}
              </button>
          )}
          <p className="text-xs text-text-muted mt-4">Secure payment via LipaNa</p>
        </div>
      </motion.div>
    </div>
  );
}
