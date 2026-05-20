import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, CheckCircle2, ChevronRight, X, Image as ImageIcon, Sparkles, ShieldCheck } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/ui/GlassCard';
import { useNavigate } from 'react-router-dom';

export function OnboardingPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1); // 1: Photos, 2: Bio/County
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files).map(f => URL.createObjectURL(f));
      setUploading(true);
      setTimeout(() => {
         setPhotos(prev => [...prev, ...newPhotos].slice(0, 6));
         setUploading(false);
      }, 1500); // Simulate network upload
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    if (!user || photos.length < 2) return;
    
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        photos,
        onboardingCompleted: true,
        bio: profile?.bio || "Exploring the elite vibes of MingleKe.",
        county: profile?.county || "Nairobi",
        isActivated: true
      });
      navigate('/discover');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-white flex flex-col overflow-hidden">
      
      {/* Cinematic Header */}
      <header className="relative z-50 px-6 py-6 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            MingleKe <span className="text-primary">Onboarding</span>
          </h1>
        </div>
        <div className="flex items-center gap-1.5">
           <div className={`h-1.5 rounded-full transition-all duration-500 w-8 ${step === 1 ? 'bg-primary' : 'bg-surface-hover'}`} />
           <div className={`h-1.5 rounded-full transition-all duration-500 w-8 ${step === 2 ? 'bg-primary' : 'bg-surface-hover'}`} />
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-xl text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                Add profile photos
              </h2>
              <p className="text-text-secondary text-sm mb-10 max-w-md mx-auto">
                Upload at least 2 photos to continue.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                {photos.map((photo, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="aspect-[3/4] relative rounded-3xl overflow-hidden border border-white/10 group shadow-2xl"
                  >
                    <img src={photo} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Profile" />
                    <button 
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 px-3 py-1 bg-primary/90 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest">
                        Primary
                      </div>
                    )}
                  </motion.div>
                ))}

                {photos.length < 6 && (
                  <>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className={`
                        aspect-[3/4] rounded-3xl border-2 border-dashed border-white/10 bg-white/[0.03] flex flex-col items-center justify-center gap-4 transition-all hover:border-primary/50 hover:bg-white/[0.05] relative overflow-hidden
                        ${uploading ? 'cursor-wait' : 'cursor-pointer group'}
                      `}
                    >
                      {uploading ? (
                        <>
                          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">Syncing...</span>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-2xl bg-surface-hover flex items-center justify-center transition-transform group-hover:scale-110">
                            <Camera size={24} className="text-text-muted" />
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Add Photo</p>
                            <p className="text-[10px] font-medium text-text-muted mt-1">JPG, PNG</p>
                          </div>
                        </>
                      )}
                      {uploading && (
                         <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
                      )}
                    </button>
                  </>
                )}
              </div>

              <div className="space-y-6">
                <button 
                  onClick={() => photos.length >= 2 && setStep(2)}
                  disabled={photos.length < 2}
                  className={`
                    w-full py-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2
                    ${photos.length >= 2 
                      ? 'btn-primary' 
                      : 'bg-surface-hover text-text-muted cursor-not-allowed'}
                  `}
                >
                  <span>Continue</span>
                  <ChevronRight size={18} />
                </button>
                <div className="flex items-center justify-center gap-2 text-xs text-text-muted">
                   <ShieldCheck size={14} />
                   <span>Photos are verified</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-xl"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                   Complete Profile
                </h2>
                <p className="text-text-secondary text-sm max-w-md mx-auto">
                   Add a bio and your location.
                </p>
              </div>

              <div className="surface-card p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">Bio</label>
                  <textarea 
                    placeholder="Tell us about yourself..."
                    className="w-full bg-background border border-border rounded-xl p-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none min-h-[100px] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">Location</label>
                    <div className="relative">
                      <select className="w-full bg-background border border-border rounded-xl p-3.5 text-sm focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer">
                        <option>Nairobi</option>
                        <option>Mombasa</option>
                        <option>Kisumu</option>
                        <option>Nakuru</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                         <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">Looking for</label>
                    <div className="relative">
                       <select className="w-full bg-background border border-border rounded-xl p-3.5 text-sm focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer">
                        <option>Dating</option>
                        <option>Friendship</option>
                        <option>Networking</option>
                        <option>Not sure yet</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                         <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleComplete}
                  className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 mt-4"
                >
                  <Sparkles size={18} />
                  <span>Start Exploring</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Progress Footer */}
      <footer className="relative z-50 p-8 flex items-center justify-center gap-2">
         <div className="flex gap-1.5">
            {[1, 2].map((s) => (
              <div 
                key={s} 
                className={`h-1 rounded-full transition-all duration-500 ${step >= s ? 'w-8 bg-primary shadow-neon' : 'w-4 bg-white/10'}`} 
              />
            ))}
         </div>
      </footer>
    </div>
  );
}
