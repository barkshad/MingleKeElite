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
  const [isVerified, setIsVerified] = useState(false);
  const [transactionCode, setTransactionCode] = useState('');
  const [errorText, setErrorText] = useState('');

  if (profile?.isActivated && !isVerified) {
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

  const validateTransactionCodeFormat = (code: string) => {
    // Exactly 10 characters: 1 letter + 9 alphanumeric
    const regex = /^[A-Z][A-Z0-9]{9}$/;
    return regex.test(code);
  };

  const handleVerifyPayment = async () => {
    if (!user) return;
    setErrorText('');
    
    if (!transactionCode) {
      setErrorText('Please enter your M-Pesa transaction code.');
      return;
    }

    if (!validateTransactionCodeFormat(transactionCode.toUpperCase())) {
      setErrorText('Invalid format. Code must be 10 characters starting with a letter.');
      return;
    }

    setIsVerifying(true);
    // Simulate verification delay and redirect
    setTimeout(async () => {
        try {
            await updateDoc(doc(db, 'users', user.uid), {
               isActivated: true
            });
            setIsVerified(true);
            setIsVerifying(false);
        } catch (error) {
            console.error("Verification failed", error);
            setErrorText('Verification failed. Please try again.');
            setIsVerifying(false);
        }
    }, 2000);
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
          {isVerified ? (
            <div className="space-y-6 text-center">
              <div className="mx-auto w-16 h-16 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white">Payment Verified!</h2>
              <p className="text-text-secondary text-sm">
                Your account is now fully activated. Download the app to start matching.
              </p>
              <a 
                href="https://play.google.com/store/search?q=pendova+dating+app&c=apps" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary w-full py-4 text-base bg-white text-black hover:bg-gray-200 flex items-center justify-center gap-2"
              >
                Download App
                <ArrowRight size={18} />
              </a>
              <div className="pt-4">
                <p className="text-xs text-text-muted mt-4">
                  Already downloaded? <a href="/discover" className="text-primary hover:underline">Open Web App</a>
                </p>
              </div>
            </div>
          ) : !hasOpenedPayment ? (
            <button 
              onClick={handlePaymentRedirect}
              disabled={isRedirecting}
              className="btn-primary w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRedirecting ? 'Redirecting...' : 'Join The Elite (KES 100)'}
              {!isRedirecting && <ArrowRight size={18} className="ml-2" />}
            </button>
          ) : (
            <div className="space-y-4">
              <input 
                type="text"
                placeholder="Enter M-Pesa Code (e.g. PK9H8J7G6F)"
                value={transactionCode}
                onChange={(e) => {
                  setTransactionCode(e.target.value.toUpperCase());
                  setErrorText('');
                }}
                className="w-full bg-surface border border-border px-4 py-3 rounded-lg text-white focus:outline-none focus:border-primary transition-colors text-center font-bold tracking-wider uppercase"
                maxLength={10}
              />
              {errorText && (
                <p className="text-red-400 text-xs font-medium text-center">{errorText}</p>
              )}
              <button 
                onClick={handleVerifyPayment}
                disabled={isVerifying || !transactionCode}
                className="btn-primary w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed bg-white text-black hover:bg-gray-200"
              >
                {isVerifying ? 'Verifying Code...' : 'Verify Transaction'}
                {!isVerifying && <CheckCircle size={18} className="ml-2" />}
              </button>
            </div>
          )}
          {!isVerified && <p className="text-xs text-text-muted mt-4">Secure payment via LipaNa</p>}
        </div>
      </motion.div>
    </div>
  );
}
