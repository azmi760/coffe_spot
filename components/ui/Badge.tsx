import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'coffee' | 'terracotta' | 'emerald' | 'amber' | 'gray';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'coffee',
  size = 'md',
  className,
  icon,
}) => {
  const variants = {
    coffee: 'bg-coffee-100 text-coffee-900 border border-coffee-200',
    terracotta: 'bg-terracotta-500/10 text-terracotta-600 border border-terracotta-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-700 border border-amber-500/20',
    gray: 'bg-stone-100 text-stone-700 border border-stone-200',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 rounded-full font-medium gap-1.5',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center tracking-wide font-medium transition-colors',
          variants[variant],
          sizes[size],
          className
        )
      )}
    >
      {icon}
      {children}
    </span>
  );
};
