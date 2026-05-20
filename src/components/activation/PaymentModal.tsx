import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap, X, Lock, CheckCircle2, Wallet, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

interface PaymentModalProps {
  onClose: () => void;
}

export function PaymentModal({ onClose }: PaymentModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<'pay' | 'iframe' | 'success'>('pay');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleActivate = async () => {
    if (!user) return;
    setIsProcessing(true);
    // Simulate API delay
    setTimeout(async () => {
        try {
            await updateDoc(doc(db, 'users', user.uid), {
              isActivated: true,
              level: 1,
              activatedAt: new Date()
            });
            setStep('success');
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-md bg-background/80"
    >
      <AnimatePresence mode="wait">
        {step !== 'iframe' ? (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 1.02 }}
            className="w-full max-w-md"
          >
            <div className="relative p-8 md:p-10 rounded-3xl surface-card shadow-2xl overflow-hidden text-center">
              {step === 'pay' ? (
                <>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center mb-8 text-primary">
                      <Zap size={32} fill="currentColor" />
                  </div>

                  <h1 className="text-3xl font-bold tracking-tight mb-4">
                    Activate Account
                  </h1>

                  <p className="text-text-secondary text-sm mb-8">
                    Complete activation to access the community. One-time fee, lifetime access.
                  </p>

                  <div className="flex flex-col items-center justify-center gap-1 bg-background border border-border rounded-xl py-4 px-6 mb-8">
                    <span className="text-3xl font-bold">KES 100</span>
                    <span className="text-text-muted text-xs uppercase tracking-wider">Activation Fee</span>
                  </div>

                  <button 
                    onClick={() => setStep('iframe')}
                    className="btn-primary w-full py-4 text-base"
                  >
                    Proceed to Payment
                    <ArrowRight size={18} />
                  </button>

                  <div className="mt-6 flex items-center justify-center gap-2 text-xs text-text-muted">
                     <Lock size={12} />
                     <span>Secure checkout via LipaNa</span>
                  </div>
                </>
              ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                >
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6 text-green-400">
                        <CheckCircle2 size={36} />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">Payment Successful</h2>
                    <p className="text-text-secondary text-sm mb-8">
                         Your account is now fully active.
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="btn-primary w-full py-4 text-base"
                    >
                        Enter App
                    </button>
                </motion.div>
              )}
              
              <button 
                onClick={onClose}
                className="absolute right-4 top-4 h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-all text-text-muted hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="iframe"
            initial={{ scale: 0.98, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.98, y: 20, opacity: 0 }}
            className="relative w-full h-[600px] max-w-lg bg-surface rounded-3xl overflow-hidden border border-border shadow-2xl flex flex-col"
          >
            {/* Browser Header */}
            <div className="h-12 bg-background border-b border-border px-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex gap-1.5 opacity-50">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="px-3 py-1 bg-surface rounded-md flex flex-1 items-center justify-center border border-border min-w-[200px]">
                        <Lock size={10} className="text-white/30 mr-2" />
                        <span className="text-[10px] text-white/50 tracking-wide">lipana.dev/pay/mingleke</span>
                    </div>
                </div>
                <button 
                  onClick={() => setStep('pay')}
                  className="p-1 hover:bg-white/10 rounded-md text-text-muted hover:text-white"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-black p-8 text-center">
                   <div className="mb-6">
                      <Wallet size={40} className="text-[#0B0B0F]" />
                   </div>
                   <h2 className="text-xl font-bold mb-2">Complete Activation</h2>
                   <p className="text-gray-500 text-sm mb-8">
                     Authorize the KES 100 payment on your phone to continue.
                   </p>
                   
                   <div className="w-full space-y-4">
                      <button 
                        onClick={handleActivate}
                        className="w-full py-3.5 bg-black text-white font-medium rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                        disabled={isProcessing}
                      >
                         {isProcessing ? 'Processing...' : 'Simulate Payment Target'}
                      </button>
                   </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
