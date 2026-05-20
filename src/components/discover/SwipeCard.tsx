import React from 'react';
import { motion, useMotionValue, useTransform, PanInfo, useSpring, AnimatePresence } from 'framer-motion';
import { Heart, X, MapPin } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { UserProfile } from '../../types';
import { TiltCard } from '../ui/TiltCard';

interface SwipeCardProps {
  profile: Partial<UserProfile>;
  onSwipe: (direction: 'left' | 'right') => void;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ profile, onSwipe }) => {
  const [photoIndex, setPhotoIndex] = React.useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  
  const heartOpacity = useTransform(x, [50, 150], [0, 1]);
  const xOpacity = useTransform(x, [-150, -50], [1, 0]);

  const photos = profile.photos && profile.photos.length > 0 
    ? profile.photos 
    : [profile.photoURL || `https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80`];

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipe('right');
    } else if (info.offset.x < -100) {
      onSwipe('left');
    }
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute inset-x-0 inset-y-8 md:inset-y-12 max-w-sm md:max-w-md mx-auto cursor-grab active:cursor-grabbing w-full"
    >
      <div className="h-full w-full rounded-3xl overflow-hidden bg-surface border border-border shadow-2xl relative group">
        <div className="relative h-full w-full overflow-hidden bg-[#000]">
          <AnimatePresence mode="wait">
            <motion.img 
              key={photoIndex}
              src={photos[photoIndex]} 
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              alt={profile.displayName}
              className="h-full w-full object-cover"
            />
          </AnimatePresence>

          {/* Tap Zones for Carousel */}
          <div className="absolute inset-0 z-20 flex">
             <div className="w-[40%] h-full cursor-pointer" onClick={prevPhoto} />
             <div className="w-[60%] h-full cursor-pointer" onClick={nextPhoto} />
          </div>
          
          {/* Carousel Indicators */}
          <div className="absolute top-4 inset-x-4 z-30 flex gap-1.5">
             {photos.map((_, i) => (
               <div 
                key={i} 
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${i === photoIndex ? 'bg-white' : 'bg-white/30'}`} 
               />
             ))}
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10 pointer-events-none" />

          {/* Swipe Indicators */}
          <motion.div 
            style={{ opacity: heartOpacity }}
            className="absolute left-6 top-16 z-30 rounded-xl border-2 border-primary bg-primary/10 px-6 py-2 text-3xl font-bold uppercase tracking-wider text-primary rotate-[-10deg] backdrop-blur-sm"
          >
            LIKE
          </motion.div>
          
          <motion.div 
            style={{ opacity: xOpacity }}
            className="absolute right-6 top-16 z-30 rounded-xl border-2 border-white/40 bg-white/10 px-6 py-2 text-3xl font-bold uppercase tracking-wider text-white rotate-[10deg] backdrop-blur-sm"
          >
            NOPE
          </motion.div>

          {/* Overlay UI */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col gap-4 pb-8">
            <div className="flex items-end justify-between">
              <div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 mb-1"
                >
                  <h2 className="text-3xl font-bold tracking-tight text-white">{profile.displayName}, {profile.age || 24}</h2>
                </motion.div>
                
                <div className="flex items-center gap-2 text-white/70 mt-1">
                  <MapPin size={16} />
                  <span className="text-sm font-medium">{profile.county || 'Nairobi'}</span>
                  <span className="w-1 h-1 bg-white/30 rounded-full mx-1" />
                  <span className="text-xs font-semibold text-green-400">Online</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {(profile.interests || ['Music', 'Art', 'Tech']).map((interest: string, i: number) => (
                <span 
                  key={interest}
                  className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg text-xs font-medium text-white/90 border border-white/5"
                >
                  {interest}
                </span>
              ))}
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-6">
              <button 
                onClick={() => onSwipe('left')}
                className="w-14 h-14 rounded-full bg-surface border border-border flex items-center justify-center transition-all hover:bg-white/5 text-white/50 hover:text-white active:scale-95 z-30"
              >
                <X size={24} strokeWidth={2.5} />
              </button>
              <button 
                onClick={() => onSwipe('right')}
                className="w-16 h-16 rounded-full bg-primary flex items-center justify-center transition-all text-white hover:bg-primary-hover active:scale-95 z-30 shadow-lg"
              >
                <Heart size={28} fill="currentColor" strokeWidth={0} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
