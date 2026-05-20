import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NeonButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
  className?: string;
  onClick?: (e: any) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function NeonButton({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  glow = true,
  className,
  ...props 
}: NeonButtonProps) {
  const variants = {
    primary: "bg-primary text-white hover:bg-opacity-90 shadow-[0_0_20px_#ff00e566] border border-white/10",
    secondary: "bg-secondary text-white hover:bg-opacity-90 shadow-[0_0_20px_#7c3aed66] border border-white/10",
    outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/10 shadow-none",
    ghost: "bg-transparent text-white hover:bg-white/10 shadow-none"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl font-black italic uppercase tracking-widest"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative flex items-center justify-center rounded-2xl transition-all duration-300 font-bold group",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      {glow && (variant === 'primary' || variant === 'secondary') && (
        <div className="absolute inset-0 z-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-white/20 blur-xl" />
      )}
    </motion.button>
  );
}
