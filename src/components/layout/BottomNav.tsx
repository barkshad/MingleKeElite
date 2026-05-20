import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, User, Gift } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: Search, label: 'Discovery', path: '/discover' },
  { icon: Heart, label: 'Matches', path: '/matches' },
  { icon: Gift, label: 'Network', path: '/referral' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] px-6 pb-10 pt-4 bg-gradient-to-t from-[#05000a] via-[#05000a]/95 to-transparent">
      <div className="mx-auto flex max-w-xl items-center justify-between px-8 py-4 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[32px] shadow-2xl">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.label}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1.5 transition-all duration-300 relative group",
                isActive ? "text-primary" : "text-white/30 hover:text-white/60"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute -top-4 w-1 h-1 bg-primary rounded-full shadow-neon"
                />
              )}
              <item.icon size={22} className={cn("transition-transform", isActive && "scale-110")} />
              <span className="text-[8px] font-black uppercase tracking-[0.2em]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

