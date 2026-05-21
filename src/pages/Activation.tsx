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
    // Simulate verification delay and redirect
    setTimeout(async () => {
        try {
            await updateDoc(doc(db, 'users', user.uid), {
               isActivated: true
            });
            // Redirect to App Store download
            window.location.href = "https://play.google.com/store/search?q=pendova+dating+app&c=apps";
        } catch (error) {
            console.error("Verification failed", error);
            setIsVerifying(false);
        }
    }, 3000);
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex flex-col justify-center items-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center relative z-10 max-w-2xl w-full"
      >
        <div className="mx-auto w-20 h-20 bg-surface border border-border rounded-2xl flex items-center justify-center mb-8">
          <Crown size={40} className="text-primary" />
        </div>
        
        <h1 className="text-4xl text-center md:text-5xl font-bold tracking-tight mb-4">
          Activate <br />
          Elite Access
        </h1>
        
        <p className="text-text-secondary text-sm md:text-base font-medium max-w-sm mx-auto leading-relaxed mb-10">
          MingleKe is a verified community of high-energy individuals. One-time activation unlocks the full VIP experience.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-12">
           {[
             { icon: <ShieldCheck className="text-primary" />, label: "Verified Profile" },
             { icon: <Zap className="text-primary" />, label: "Priority Reach" },
             { icon: <Sparkles className="text-primary" />, label: "Elite Badge" },
             { icon: <Star className="text-primary" />, label: "Daily Streaks" }
           ].map((item, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 + i * 0.1 }}
               className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-surface border border-border"
             >
                <div className="w-10 h-10 flex items-center justify-center bg-surface-hover rounded-xl">
                  {item.icon}
                </div>
                <span className="text-xs font-semibold text-text-secondary">{item.label}</span>
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
              {isRedirecting ? 'Redirecting...' : 'Join The Elite (KES 100)'}
              {!isRedirecting && <ArrowRight size={18} className="ml-2" />}
            </button>
          ) : (
            <button 
              onClick={handleVerifyPayment}
              disabled={isVerifying}
              className="btn-primary w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed bg-white text-black hover:bg-gray-200"
            >
              {isVerifying ? 'Verifying...' : 'I have completed payment'}
              {!isVerifying && <CheckCircle size={18} className="ml-2" />}
            </button>
          )}
          <p className="text-xs text-text-muted mt-4">Secure payment via LipaNa</p>
        </div>
      </motion.div>
    </div>
  );
}
