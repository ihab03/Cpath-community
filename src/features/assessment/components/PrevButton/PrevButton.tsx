import React from 'react';

interface PrevButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const PrevButton: React.FC<PrevButtonProps> = ({ onClick, disabled }) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className="flex items-center gap-3 px-8 py-3 rounded-xl border-2 border-[#D97706] text-[#D97706] bg-transparent hover:bg-[#D97706]/10 disabled:opacity-20 transition-all font-bold"
    >
      <span className="border border-[#D97706] rounded-full w-4 h-4 flex items-center justify-center text-[10px]">←</span>
      Previous
    </button>
  );
};