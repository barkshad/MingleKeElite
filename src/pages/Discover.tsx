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
    <div className="relative min-h-screen overflow-hidden flex flex-col bg-background">
      {/* Cinematic Header */}
      <header className="relative z-50 flex items-center justify-between px-6 md:px-8 py-4 h-20 bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Crown size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white mb-0.5">
              MingleKe <span className="text-primary text-sm font-medium">Elite</span>
            </h1>
            <p className="text-[10px] text-text-muted">Discovery Engine</p>
          </div>
        </div>

        <nav className="hidden md:flex gap-8 text-sm font-medium text-text-muted">
           <a href="#" className="text-white border-b-2 border-primary pb-1">Discovery</a>
           <a href="#" className="hover:text-white transition-colors">Matches</a>
           <a href="#" className="hover:text-white transition-colors">Treasury</a>
        </nav>

        <div className="flex items-center gap-3">
          <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-surface-hover hover:bg-white/10 transition-colors text-text-muted hover:text-white">
            <Search size={18} />
          </button>
          <div className="h-10 w-10 flex items-center justify-center rounded-xl border border-secondary/30 bg-secondary/10">
            <Sparkles className="text-secondary" size={18} />
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
                  <h2 className="text-2xl font-bold tracking-tight mb-2">Discovery Paused</h2>
                  <p className="text-text-secondary text-sm font-medium max-w-sm">
                    You've seen all the elite energy in your region. Check back soon or upgrade your range.
                  </p>
                  <button 
                    onClick={() => setCurrentIndex(0)}
                    className="btn-primary mt-8 px-8 py-3.5 text-sm"
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
          <div className="surface-card p-6 flex flex-col justify-between h-[320px]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-primary text-xs font-semibold tracking-wider uppercase mb-1">Elite Activity</p>
                <h3 className="text-2xl font-bold tracking-tight">Streaks & <br />Rewards</h3>
              </div>
              <div className="bg-primary/10 rounded-xl p-3 border border-primary/20 text-center">
                 <p className="text-[10px] text-text-muted uppercase font-semibold tracking-wider">Level</p>
                 <p className="text-xl font-bold text-primary">08</p>
              </div>
            </div>
            
            <div className="mt-8">
              <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                <span>Earning Multiplier</span>
                <span className="text-secondary">2.5x Active</span>
              </div>
              <div className="h-2 w-full bg-surface-hover rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    className="h-full bg-gradient-to-r from-primary to-secondary" 
                />
              </div>
            </div>

            <button className="mt-8 btn-primary w-full py-3.5 text-sm">
              Claim Daily Bonus
            </button>
          </div>

          <div className="surface-card p-6 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Recent Matches</h3>
              <span className="text-xs text-secondary font-medium cursor-pointer hover:text-primary transition-colors">View All</span>
            </div>
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((match) => (
                <div key={match} className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border hover:border-white/20 transition-all cursor-pointer group">
                  <div className="relative w-12 h-12 rounded-lg bg-surface-hover border border-border overflow-hidden">
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Elite Member {match}</p>
                    <p className="text-[11px] text-text-muted font-medium mt-0.5">Matched 2m ago</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
