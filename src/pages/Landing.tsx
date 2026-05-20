import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden selection:bg-primary/30 bg-background flex flex-col pt-24 pb-12">
      
      {/* Navbar Minimal Simulation */}
      <nav className="fixed top-0 inset-x-0 h-16 flex items-center px-6 md:px-10 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
           <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
           </div>
           MingleKe
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-5xl mx-auto w-full text-center my-20">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-white/70 mb-8"
        >
          <Sparkles size={14} className="text-primary" />
          <span>Next-generation social discovery</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight"
        >
          Meet Hot Singles. <span className="text-primary">Chat & Earn.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl text-lg text-text-secondary font-medium leading-relaxed mb-10"
        >
          Discover connections, make meaningful matches, and get rewarded for your interactions. The ultimate social multiplier. 
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto"
        >
          <Link to="/auth" className="w-full sm:w-auto text-center block">
            <button className="btn-primary w-full sm:w-auto px-8 py-4 text-base">
              Join MingleKe
              <ArrowRight size={18} />
            </button>
          </Link>
          <button className="btn-secondary w-full sm:w-auto px-8 py-4 text-base text-white/70 border-white/10 hover:text-white">
            Explore Features
          </button>
        </motion.div>
        
      </div>

      {/* Simplified features / discovery view mock */}
      <div className="max-w-6xl mx-auto px-6 w-full pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Card Mock */}
          {[
            { img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80", name: "Sasha, 24", title: "Creative Elite" },
            { img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80", name: "Derrick, 27", title: "Tech Pioneer" },
            { img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80", name: "Anita, 23", title: "Art Curator" }
          ].map((profile, i) => (
             <div key={i} className="surface-card p-4 hover:border-white/20 transition-colors">
               <div className="aspect-[4/5] rounded-xl overflow-hidden mb-4 relative bg-black">
                 <img src={profile.img} className="w-full h-full object-cover opacity-90" />
               </div>
               <div className="px-2 pb-2">
                 <p className="text-xl font-bold">{profile.name}</p>
                 <p className="text-sm text-primary font-medium mt-1">{profile.title}</p>
               </div>
             </div>
          ))}
        </motion.div>
      </div>

    </div>
  );
}

