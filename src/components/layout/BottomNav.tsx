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
    <nav className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-6 pt-4 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none">
      <div className="mx-auto flex max-w-sm items-center justify-between px-6 py-3.5 bg-surface/90 backdrop-blur-md border border-border rounded-full shadow-2xl pointer-events-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.label}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors relative group w-12",
                isActive ? "text-primary" : "text-text-muted hover:text-text-primary"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute -top-3.5 w-8 h-1 bg-primary rounded-b-full"
                />
              )}
              <item.icon size={20} className={cn("transition-transform", isActive ? "scale-105" : "")} />
              <span className="text-[10px] font-medium transition-colors">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

