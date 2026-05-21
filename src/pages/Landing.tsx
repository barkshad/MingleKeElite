import { Sparkles, ArrowRight, ShieldCheck, Zap, Heart, MessageCircle, Crown, Users, CheckCircle, Image, Star, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LandingPage() {
  const { user, profile } = useAuth();
  
  const getCtaLink = () => {
    if (!user) return "/auth";
    if (!profile?.isActivated) return "/activation";
    if (!profile?.onboardingCompleted) return "/onboarding";
    return "/discover";
  };

  const getCtaText = () => {
    if (!user) return "Activate & Join Now";
    if (!profile?.isActivated) return "Complete Activation";
    if (!profile?.onboardingCompleted) return "Complete Profile";
    return "Open App";
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative min-h-screen bg-background text-text-primary selection:bg-primary/30">
      
      {/* Navbar Minimal Simulation */}
      <nav className="fixed top-0 inset-x-0 h-16 flex items-center px-6 md:px-10 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
           <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
           </div>
           MingleKe
        </div>
      </nav>

      {/* 🌑 HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
          >
            Meet Real People. <br/>
            Earn Rewards. <br/>
            <span className="text-primary">Build Your Circle.</span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto space-y-4 mb-10"
          >
            <p className="text-lg md:text-xl text-text-secondary font-medium leading-relaxed">
              MingleKe is Kenya's premium social discovery app where real people connect, chat, match — and earn rewards by inviting others.
            </p>
            <p className="text-base text-text-muted">
              No fake profiles. No bots. Just real conversations, real connections, and real rewards.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to={getCtaLink()} className="w-full sm:w-auto">
              <button className="btn-primary w-full sm:w-auto px-8 py-4 text-base">
                {getCtaText()}
                <ArrowRight size={18} className="ml-2" />
              </button>
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <button className="btn-secondary w-full sm:w-auto px-8 py-4 text-base text-white hover:text-white border-white/10 hover:border-white/20 transition-colors">
                See How It Works
              </button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ⚡ TRUST STRIP */}
      <section className="border-y border-border bg-surface-hover/50 py-8 px-6">
        <div className="max-w-6xl mx-auto relative overflow-hidden flex justify-center">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-sm font-medium text-text-secondary">
            <div className="flex items-center gap-2"><Lock size={16} className="text-primary" /> Verified activations only</div>
            <div className="flex items-center gap-2"><Image size={16} className="text-primary" /> 2-photo real identity requirement</div>
            <div className="flex items-center gap-2"><MessageCircle size={16} className="text-primary" /> Real-time chat</div>
            <div className="flex items-center gap-2"><Heart size={16} className="text-primary" /> Match-based connections</div>
            <div className="flex items-center gap-2"><Zap size={16} className="text-primary" /> Refer & earn rewards</div>
            <div className="flex items-center gap-2"><span className="text-primary">🇰🇪</span> Built for Kenya</div>
          </div>
        </div>
      </section>

      {/* 💰 REFER & EARN (MAIN FEATURE) */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 mb-6">
              <GiftIcon className="text-primary" size={14} />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Main Feature</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Invite Friends.<br/>Earn Rewards.<br/>Grow Faster.</h2>
            <p className="text-lg text-text-secondary mb-8">
              Every MingleKe user gets a unique referral link. When someone joins through your invite and activates their account, <strong className="text-white">you earn rewards automatically.</strong>
            </p>

            <h3 className="text-xl font-bold mb-4">What You Can Earn</h3>
            <ul className="space-y-3 mb-8">
              {[
                "Profile boosts & Visibility upgrades",
                "Premium badges & Leaderboard ranks",
                "Exclusive features & Special perks",
                "Future cash/reward opportunities"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-primary shrink-0 mt-0.5" />
                  <span className="text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>

            <h3 className="text-xl font-bold mb-4">Why People Love It</h3>
            <div className="surface-card p-6">
              <p className="text-text-secondary">
                The more people you invite: the more visibility you gain, the faster your profile grows, the higher you rank, and the more rewards you unlock. 
                <br/><br/>
                <span className="text-white font-medium">MingleKe rewards active users and real communities.</span>
              </p>
            </div>
          </div>
          
          <div className="relative">
            <div className="surface-card p-8 relative rounded-2xl shadow-sm border border-border bg-surface">
               <div className="flex flex-col items-center text-center space-y-6">
                 <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center border border-border">
                   <Crown size={32} className="text-primary" />
                 </div>
                 <div>
                   <h4 className="text-xl font-bold text-white mb-2">Your Referral Status</h4>
                   <p className="text-sm text-text-muted">Invite friends to unlock perks</p>
                 </div>
                 <div className="w-full bg-background border border-border rounded-xl p-3 flex justify-between items-center">
                    <span className="text-sm font-medium text-text-secondary truncate">https://mingleke.com/join/you</span>
                    <button className="bg-surface-hover text-white px-3 py-1.5 rounded text-xs font-semibold ml-4 border border-border hover:bg-white/10 transition-colors">COPY</button>
                 </div>
                 <div className="w-full grid grid-cols-2 gap-4 pt-4 border-t border-border mt-4">
                    <div>
                      <p className="text-xs text-text-muted mb-1 uppercase tracking-wider font-semibold">Invited</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted mb-1 uppercase tracking-wider font-semibold">Rewards</p>
                      <p className="text-2xl font-bold text-primary">Active</p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔥 HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 bg-surface-hover/30 border-y border-border">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">How It Works</h2>
          <p className="text-lg text-text-secondary">Get started in four simple steps.</p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Activate Your Account", desc: "Unlock MingleKe with a simple one-time KES 100 activation." },
            { step: "02", title: "Build Your Profile", desc: "Upload photos, add your bio, interests, and location." },
            { step: "03", title: "Discover Real People", desc: "Browse active profiles, match, and connect instantly." },
            { step: "04", title: "Share Your Link", desc: "Invite friends and start earning rewards automatically." }
          ].map((item, i) => (
             <div key={i} className="surface-card p-8 flex flex-col items-center text-center">
               <span className="text-5xl font-bold text-primary/20 mb-6">{item.step}</span>
               <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
               <p className="text-sm text-text-secondary">{item.desc}</p>
             </div>
          ))}
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto space-y-24">
          
          {/* Real People */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 surface-card overflow-hidden aspect-square flex items-center justify-center p-12">
               <div className="grid grid-cols-2 gap-4 w-full opacity-60">
                 <div className="bg-background rounded-xl aspect-[3/4] border border-border" />
                 <div className="bg-background rounded-xl aspect-[3/4] border border-border mt-8" />
               </div>
               <div className="absolute bg-surface border border-border p-6 rounded-2xl shadow-xl flex items-center gap-4">
                 <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                   <CheckCircle className="text-green-500" size={24} />
                 </div>
                 <div>
                   <p className="font-bold">Identity Verified</p>
                   <p className="text-sm text-text-muted">2 real photos required</p>
                 </div>
               </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Real People Only System</h2>
              <p className="text-lg text-text-secondary mb-6">
                <strong>Every user must upload 2 real photos.</strong> This keeps the platform authentic, active, visually engaging, and safer from fake accounts.
              </p>
              <p className="text-base text-text-muted mb-6">
                Your photos become part of the discovery feed instantly. No photos = no access.
              </p>
            </div>
          </div>

          {/* Real-time chat */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Real-Time Chat Experience</h2>
              <p className="text-lg text-text-secondary mb-6">
                Once matched: chat instantly, react to messages, stay active, and build real conversations.
              </p>
              <p className="text-base text-text-muted mb-6">
                MingleKe is built for smooth communication, premium interactions, and modern social energy.
              </p>
            </div>
             <div className="surface-card overflow-hidden aspect-square flex flex-col justify-end p-8">
               <div className="space-y-4 opacity-80 pointer-events-none w-full max-w-sm mx-auto">
                 <div className="flex gap-3">
                   <div className="w-8 h-8 rounded-full bg-border shrink-0" />
                   <div className="bg-background border border-border rounded-2xl rounded-tl-sm p-4 text-sm text-text-secondary">Hey! I saw we both love hiking.</div>
                 </div>
                 <div className="flex gap-3 flex-row-reverse">
                   <div className="bg-primary text-white rounded-2xl rounded-tr-sm p-4 text-sm">Yes! Just went last weekend. Ngong hills is amazing.</div>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* 💎 WHY MINGLEKE / LEADERBOARD */}
      <section className="py-24 px-6 bg-surface-hover/30 border-y border-border">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="surface-card p-10">
             <h2 className="text-3xl font-bold tracking-tight mb-6">Why MingleKe Feels Different</h2>
             <p className="text-lg font-medium text-white mb-4">Not just another dating app</p>
             <p className="text-text-secondary mb-6">
               Most platforms are full of fake accounts, inactive profiles, endless scrolling, and conversations that go nowhere.
             </p>
             <ul className="space-y-3 mt-8">
               <li className="flex items-center gap-3 text-text-secondary"><Star size={20} className="text-primary" /> Feels real</li>
               <li className="flex items-center gap-3 text-text-secondary"><Star size={20} className="text-primary" /> Feels rewarding</li>
               <li className="flex items-center gap-3 text-text-secondary"><Star size={20} className="text-primary" /> Feels social</li>
               <li className="flex items-center gap-3 text-text-secondary"><Star size={20} className="text-primary" /> Feels active</li>
               <li className="flex items-center gap-3 text-text-secondary"><Star size={20} className="text-primary" /> Feels immersive</li>
             </ul>
          </div>

          <div className="surface-card p-10">
             <h2 className="text-3xl font-bold tracking-tight mb-6">Leaderboard & Rewards</h2>
             <p className="text-lg font-medium text-white mb-4">Top Inviters Get More Visibility</p>
             <p className="text-text-secondary mb-6">
               Weekly top inviters unlock boosted profiles, premium badges, leaderboard placement, community recognition, and exclusive rewards. The leaderboard updates in real time.
             </p>
             <div className="mt-8 bg-background border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-primary">#1</span>
                    <div className="w-10 h-10 bg-surface-hover rounded-full" />
                    <span className="font-bold text-white">NairobiKing</span>
                  </div>
                  <span className="text-sm text-text-muted">240 invites</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-text-secondary">#2</span>
                    <div className="w-10 h-10 bg-surface-hover rounded-full" />
                    <span className="font-bold text-white">QueenSab</span>
                  </div>
                  <span className="text-sm text-text-muted">184 invites</span>
                </div>
             </div>
          </div>

        </div>
      </section>

      {/* 🔐 ACTIVATION & ❤️ COMMUNITY */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 border border-border rounded-3xl overflow-hidden divide-y divide-border">
          
          <div className="p-10 md:p-16 flex flex-col md:flex-row gap-10 items-center justify-between bg-surface/50">
            <div className="flex-1">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Why the KES 100 Activation Exists</h2>
              <p className="text-lg text-text-secondary">
                To reduce spam and fake accounts, all users complete a one-time activation before accessing the platform.
              </p>
            </div>
            <div className="flex-1 w-full p-8 bg-background rounded-2xl border border-border shadow-2xl">
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-text-secondary font-medium"><Lock size={18} className="text-primary" /> Unlocks discovery feed</li>
                <li className="flex items-center gap-3 text-text-secondary font-medium"><Lock size={18} className="text-primary" /> Unlocks messaging</li>
                <li className="flex items-center gap-3 text-text-secondary font-medium"><Lock size={18} className="text-primary" /> Unlocks matching</li>
                <li className="flex items-center gap-3 text-text-secondary font-medium"><Lock size={18} className="text-primary" /> Unlocks referral rewards</li>
                <li className="flex items-center gap-3 text-text-secondary font-medium"><Lock size={18} className="text-primary" /> Unlocks premium features</li>
              </ul>
              <div className="mt-8 pt-4 border-t border-border text-sm text-text-muted text-center">
                👉 Activation happens securely via LipaNa.
              </div>
            </div>
          </div>

          <div className="p-10 md:p-16 bg-surface/50 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Built For Real Kenyan Connections</h2>
            <p className="max-w-2xl mx-auto text-lg text-text-secondary">
              Whether you're in campus, in Nairobi, meeting new people, growing your social circle, or exploring real conversations — MingleKe gives you a platform that feels modern, active, rewarding, and authentic.
            </p>
          </div>

        </div>
      </section>

      {/* 🚀 FINAL CTA SECTION */}
      <section className="py-32 px-6 text-center relative overflow-hidden bg-primary/5">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-8">
            Ready To Join Kenya’s Fastest Growing Social Discovery Platform?
          </h2>
          <p className="text-xl text-text-secondary mb-12">
            Meet people. Match instantly. Earn rewards. Build real connections.
          </p>
          <Link to={getCtaLink()}>
            <button className="btn-primary px-10 py-5 text-lg font-bold">
              👉 {getCtaText()}
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
}

// Inline gift icon component since lucide-react Gift isn't imported
function GiftIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}


