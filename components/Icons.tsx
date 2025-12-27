
import React from 'react';

export const StartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="grad-gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#fef3c7', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#d97706', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="45" fill="none" stroke="url(#grad-gold)" strokeWidth="1" strokeDasharray="4 4" className="animate-rotate-slow" />
    <polygon points="40,30 75,50 40,70" fill="url(#grad-gold)" />
  </svg>
);

export const StopIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="grad-rust" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#7f1d1d', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect x="25" y="25" width="50" height="50" rx="4" fill="url(#grad-rust)" />
    <path d="M20 10 L30 10 L30 90 L20 90 Z" fill="#7f1d1d" opacity="0.5" />
    <path d="M70 10 L80 10 L80 90 L70 90 Z" fill="#7f1d1d" opacity="0.5" />
  </svg>
);
