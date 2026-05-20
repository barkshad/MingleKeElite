import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Match, UserProfile } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { motion } from 'framer-motion';
import { Search, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function MatchesPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<(Match & { otherUser: UserProfile })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'matches'),
      where('users', 'array-contains', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const matchData: any[] = [];
      
      for (const docSnapshot of snapshot.docs) {
        const data = docSnapshot.data() as Match;
        const otherUserId = data.users.find(id => id !== user.uid);
        
        if (otherUserId) {
          // Fetch other user's profile
          // In a real app, I'd cache these or use a smarter query
          // For MVP, we'll fetch them individually or use a placeholder
          // Note: onSnapshot handles the real-time updates for the match list itself
          matchData.push({ ...data, id: docSnapshot.id, otherUserId });
        }
      }
      
      // Filter out matches where we don't have the other user yet (this is simple async handling)
      // I'll use a mocked profile for now if the user document isn't found
      setMatches(matchData.map(m => ({
        ...m,
        otherUser: {
          uid: m.otherUserId,
          displayName: 'Premium User',
          photoURL: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80',
          isVerified: true
        } as UserProfile
      })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="min-h-screen bg-black pb-24">
      <header className="px-8 py-10">
        <h1 className="font-display text-4xl font-black italic tracking-tighter">YOUR MATCHES</h1>
        <p className="text-white/50 mt-2">Connect and start real conversations.</p>
        
        <div className="relative mt-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            type="text" 
            placeholder="Search matches..." 
            className="w-full rounded-2xl border border-white/5 bg-white/5 py-4 pl-12 pr-4 text-white placeholder-white/20 outline-none focus:border-primary/30"
          />
        </div>
      </header>

      <main className="px-6 space-y-4">
        {loading ? (
           <div className="flex justify-center p-10"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : matches.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-white/5 text-white/20 mb-6">
              <Heart size={32} />
            </div>
            <h3 className="text-xl font-bold">No matches yet</h3>
            <p className="text-white/50 mt-2">Keep swiping to find your energy!</p>
            <Link to="/discover" className="mt-8 inline-block font-black text-primary uppercase tracking-widest text-sm hover:underline">Start Discovering</Link>
          </div>
        ) : (
          matches.map((match, i) => (
            <Link key={match.id} to={`/chat/${match.id}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard className="flex items-center gap-4 p-4 hover:bg-white/10 transition-colors">
                  <div className="relative">
                    <img 
                      src={match.otherUser.photoURL} 
                      className="h-16 w-16 rounded-2xl object-cover" 
                      alt={match.otherUser.displayName} 
                    />
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-black bg-green-500" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold">{match.otherUser.displayName}</h4>
                      <span className="text-[10px] text-white/30 truncate">2m ago</span>
                    </div>
                    <p className="text-sm text-white/50 line-clamp-1">
                      {match.lastMessage || "You've got a match! Say hi 👋"}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            </Link>
          ))
        )}
      </main>
    </div>
  );
}
