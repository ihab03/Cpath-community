import React from 'react';

interface NextButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label: string;
}

export const NextButton: React.FC<NextButtonProps> = ({ onClick, disabled, label }) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      // We force bg-[#DC5F00] as the base state so it's always orange
      className={`
        flex-1 flex items-center justify-between px-10 py-3 rounded-xl 
        transition-all text-lg font-bold shadow-lg
        ${disabled 
          ? 'bg-[#B0520B] text-white/50 cursor-not-allowed' // Darker, "muted" orange for disabled
          : 'bg-[#DC5F00] text-white hover:bg-[#FE7004] active:scale-[0.98]' // Vibrant orange for active
        }
      `}
    >
      <span>{label}</span>
      <span className={`
        border rounded-full w-5 h-5 flex items-center justify-center text-[10px] leading-none
        ${disabled ? 'border-white/30' : 'border-white/60'}
      `}>
        →
      </span>
    </button>
  );
};