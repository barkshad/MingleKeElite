import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Shield, 
  MapPin, 
  Calendar, 
  Edit3, 
  LogOut, 
  CheckCircle2, 
  Zap,
  LayoutDashboard
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function ProfilePage() {
  const { profile, signOut } = useAuth();

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header / Hero Area */}
      <div className="relative h-64 w-full overflow-hidden bg-surface">
        <img 
          src={profile.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80'} 
          className="h-full w-full object-cover opacity-50 blur-xl"
          alt="Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <div className="absolute right-6 top-6 flex gap-3">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
            <Settings size={18} />
          </button>
          <button 
             onClick={signOut}
             className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Profile Info Overlay */}
      <div className="relative -mt-20 flex flex-col items-center px-4 md:px-8">
        <motion.div
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="relative"
        >
          <div className="h-32 w-32 rounded-3xl border-4 border-background overflow-hidden relative shadow-2xl">
            <img 
              src={profile.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'} 
              className="h-full w-full object-cover" 
              alt="Profile" 
            />
          </div>
          {profile.isVerified && (
            <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500 border-4 border-background text-white shadow-lg">
              <CheckCircle2 size={16} fill="currentColor" />
            </div>
          )}
        </motion.div>

        <div className="mt-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight">{profile.displayName || 'The Elite'}, {profile.age || 24}</h2>
          <div className="mt-2 flex items-center justify-center gap-3 text-xs font-semibold text-text-secondary uppercase tracking-widest">
            <span className="flex items-center gap-1"><MapPin size={12} className="text-primary" /> {profile.county || 'Nairobi'}</span>
            <span className="flex items-center gap-1"><Zap size={12} className="text-green-500" /> {profile.isActivated ? 'ELITE ' : 'FREE USER'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex w-full max-w-sm gap-4">
          <button className="btn-primary flex-1">
            <Edit3 className="mr-2" size={16} /> Edit Profile
          </button>
          <Link to="/referral" className="flex-1">
            <button className="btn-secondary w-full">
              <Zap className="mr-2" size={16} /> Rewards
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid w-full max-w-sm grid-cols-2 gap-4">
          <div className="surface-card text-center p-4">
             <p className="text-xl font-bold text-white">{profile.coins || 0}</p>
             <p className="text-xs font-semibold text-text-muted mt-1 uppercase tracking-wider">Coins</p>
          </div>
           <div className="surface-card text-center p-4">
             <p className="text-xl font-bold text-primary">Elite</p>
             <p className="text-xs font-semibold text-text-muted mt-1 uppercase tracking-wider">Badge</p>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="mt-8 w-full max-w-sm space-y-3">
           <h3 className="font-semibold text-xs tracking-wider uppercase text-text-secondary ml-1">Photos</h3>
           <div className="grid grid-cols-2 gap-4">
              {profile.photos && profile.photos.length > 0 ? (
                profile.photos.map((photo, i) => (
                  <div key={i} className="aspect-[4/5] rounded-2xl overflow-hidden group relative">
                     <img src={photo} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                  </div>
                ))
              ) : (
                <div className="col-span-2 p-6 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                   <p className="text-xs text-text-muted">No additional photos</p>
                   <Link to="/onboarding" className="mt-3 text-primary text-sm font-medium hover:underline">
                      Add Photos
                   </Link>
                </div>
              )}
           </div>
        </div>

        {/* Bio Section */}
        <div className="surface-card mt-6 w-full max-w-sm p-6 space-y-3">
          <h3 className="font-semibold text-xs tracking-wider uppercase text-text-secondary">Bio</h3>
          <p className="text-sm leading-relaxed text-text-primary">
            {profile.bio || "Crafting digital experiences. Let's connect."}
          </p>
        </div>

        {/* Occupation & Education */}
        <div className="mt-4 w-full max-w-sm grid grid-cols-1 gap-4">
           <div className="surface-card flex items-center gap-3 p-4">
              <div className="p-2 bg-surface-hover rounded-lg text-primary">
                <Shield size={16} />
              </div>
              <span className="text-sm font-medium">{profile.occupation || 'Creative Architect'}</span>
           </div>
           <div className="surface-card flex items-center gap-3 p-4">
              <div className="p-2 bg-surface-hover rounded-lg text-secondary">
                <Calendar size={16} />
              </div>
              <span className="text-sm font-medium">Joined {new Date(profile.createdAt).toLocaleDateString() || 'Recently'}</span>
           </div>
        </div>

        {/* Admin Link if needed */}
        <div className="mt-8 flex flex-col items-center">
          <Link to="/admin" className="text-xs text-text-muted hover:text-white transition-colors flex items-center gap-2 font-medium">
            <LayoutDashboard size={14} /> Admin Access
          </Link>
        </div>
      </div>
    </div>
  );
}
