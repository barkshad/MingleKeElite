import { useState, useEffect } from 'react';
import { SwipeCard } from '../components/discover/SwipeCard';
import { AnimatePresence, motion } from 'framer-motion';
import { db } from '../lib/firebase';
import { collection, query, limit, getDocs, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { UserProfile } from '../types';
import { Sparkles, Crown, Search, Zap, MapPin } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';

export function DiscoverPage() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Partial<UserProfile>[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const q = query(collection(db, 'users'), limit(20));
        const snapshot = await getDocs(q);
        const data = snapshot.docs
          .map(doc => doc.data() as UserProfile)
          .filter(p => p.uid !== user?.uid);

        if (data.length === 0) {
          setProfiles([
            { uid: '1', displayName: 'Stacy', age: 23, county: 'Nairobi', bio: 'Architecture student and art lover. Looking for genuine vibes.', photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80', photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80'], isVerified: true },
            { uid: '2', displayName: 'Kevin', age: 26, county: 'Mombasa', bio: 'Tech enthusiast. Beach life is the best life.', photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80'], isVerified: false },
            { uid: '3', displayName: 'Wambui', age: 24, county: 'Nairobi', bio: 'Coffee lover and traveler.', photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80', photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80'], isVerified: true }
          ]);
        } else {
          setProfiles(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [user]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    const swipedUser = profiles[currentIndex];
    
    if (direction === 'right' && user && swipedUser.uid) {
      await addDoc(collection(db, 'likes'), {
        fromId: user.uid,
        toId: swipedUser.uid,
        createdAt: serverTimestamp()
      });
      
      const mutualLikeQuery = query(
        collection(db, 'likes'),
        where('fromId', '==', swipedUser.uid),
        where('toId', '==', user.uid)
      );
      const mutualSnapshot = await getDocs(mutualLikeQuery);
      
      if (!mutualSnapshot.empty) {
        await addDoc(collection(db, 'matches'), {
          users: [user.uid, swipedUser.uid],
          createdAt: serverTimestamp()
        });
      }
    }

    setCurrentIndex(prev => prev + 1);
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col bg-[#05000a]">
      {/* Cinematic Header */}
      <header className="relative z-50 flex items-center justify-between px-8 py-6 h-24 bg-white/[0.02] backdrop-blur-3xl border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-xl shadow-neon flex items-center justify-center">
            <Crown size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-black italic tracking-tighter uppercase leading-none">
              MINGLEKE <span className="text-primary italic">ELITE</span>
            </h1>
            <p className="text-[10px] font-bold text-white/40 tracking-[0.3em] uppercase mt-1">Discovery Engine v4.0</p>
          </div>
        </div>

        <nav className="hidden md:flex gap-10 text-xs font-black uppercase tracking-[0.2em] text-white/40">
           <a href="#" className="text-white border-b-2 border-primary pb-1">Discovery</a>
           <a href="#" className="hover:text-white transition-colors">Matches</a>
           <a href="#" className="hover:text-white transition-colors">Treasury</a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="h-12 w-12 flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-white/60 hover:text-white">
            <Search size={20} />
          </button>
          <div className="h-12 w-12 flex items-center justify-center rounded-2xl border border-secondary/50 bg-secondary/10 shadow-purple">
            <Sparkles className="text-secondary" size={20} />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 grid grid-cols-12 gap-6 pb-32">
        {/* Main Swipe Area */}
        <div className="col-span-12 lg:col-span-8 relative aspect-[4/5] lg:aspect-auto min-h-[600px] lg:h-[calc(100vh-200px)]">
          {loading ? (
            <div className="flex h-full w-full items-center justify-center rounded-[32px] border border-white/10 bg-white/5">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="relative h-full w-full">
              <AnimatePresence>
                {profiles.slice(currentIndex, currentIndex + 1).map((profile) => (
                  <SwipeCard 
                    key={profile.uid}
                    profile={profile}
                    onSwipe={handleSwipe}
                  />
                ))}
              </AnimatePresence>
              
              {currentIndex >= profiles.length && !loading && (
                <div className="flex h-full w-full flex-col items-center justify-center text-center p-12 glass-morphism rounded-[32px] border-white/10 bg-white/5">
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10 shadow-glass">
                    <Zap size={48} className="text-primary" />
                  </div>
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Discovery Paused</h2>
                  <p className="text-white/40 text-lg font-medium max-w-md uppercase tracking-widest text-xs leading-relaxed">
                    You've seen all the elite energy in your region. Check back soon or upgrade your range.
                  </p>
                  <button 
                    onClick={() => setCurrentIndex(0)}
                    className="mt-12 px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-white transition-all shadow-neon"
                  >
                    Restart Discovery
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Bento Area */}
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-6">
          <GlassCard className="flex flex-col justify-between h-[320px] border-white/10 bg-gradient-to-br from-white/5 to-transparent">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2">Elite Activity</p>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Streaks & <br />Rewards</h3>
              </div>
              <div className="bg-primary/20 rounded-2xl p-4 border border-primary/20 text-center shadow-neon">
                 <p className="text-[10px] text-white/50 uppercase font-black tracking-widest">Level</p>
                 <p className="text-2xl font-black italic text-white">08</p>
              </div>
            </div>
            
            <div className="mt-8">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                <span>Earning Multiplier</span>
                <span className="text-secondary">2.5x Active</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    className="h-full bg-gradient-to-r from-primary to-secondary shadow-neon" 
                />
              </div>
            </div>

            <button className="mt-8 w-full py-4 bg-white text-black text-[10px] font-black uppercase rounded-xl tracking-[0.2em] hover:bg-primary hover:text-white transition-all">
              Claim Daily Bonus
            </button>
          </GlassCard>

          <GlassCard className="flex-1 border-white/10 bg-white/[0.02]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Recent Matches</h3>
              <span className="text-[10px] text-secondary uppercase font-black cursor-pointer hover:text-primary transition-colors">View All</span>
            </div>
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((match) => (
                <div key={match} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-secondary/30 transition-all cursor-pointer group">
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-tr from-white/10 to-white/5 border border-white/10 overflow-hidden">
                    <div className="absolute inset-0 bg-slate-800 opacity-60" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20" size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black uppercase tracking-tighter">Elite Member {match}</p>
                    <p className="text-[10px] text-white/40 font-bold tracking-widest mt-0.5 uppercase">Matched 2m ago</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-primary shadow-neon" />
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
