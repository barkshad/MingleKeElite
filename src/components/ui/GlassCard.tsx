import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
  key?: string | number;
}

export function GlassCard({ children, className, animate = true, key }: GlassCardProps) {
  const Component = animate ? (motion.div as any) : 'div';
  
  return (
    <Component
      key={key}
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      className={cn(
        "glass-morphism rounded-[32px] p-6 shadow-glass",
        className
      )}
    >
      {children}
    </Component>
  );
}
