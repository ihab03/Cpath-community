// packages/ui/src/components/Progress/ProgressBar.tsx
import React from 'react';

export const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12">
      <div className="relative flex items-center justify-between w-full">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-700 -translate-y-1/2 z-0" />
        
        {/* Active Line */}
        <div 
          className="absolute top-1/2 left-0 h-[1px] bg-[#D97706] -translate-y-1/2 z-10 transition-all duration-700 ease-in-out"
          style={{ width: `${progress}%` }}
        />

        {/* Start Node */}
        <div className="relative z-20 flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-[#D97706] border-[3px] border-[#222222] flex items-center justify-center shadow-lg">
            <span className="text-white text-[10px] font-bold">✓</span>
          </div>
          {/* Bold Label */}
          <span className="absolute top-10 text-[11px] font-bold text-white uppercase tracking-wider">
            Start
          </span>
        </div>

        {/* Middle Node (Same size as others) */}
        <div className="relative z-20 flex flex-col items-center">
          <div className={`w-6 h-6 rounded-full border-[3px] border-[#222222] shadow-2xl transition-all duration-500 ${
            progress >= 50 ? 'bg-[#D97706]' : 'bg-[#333333]'
          }`} />
          {/* Bold Label */}
          <span className="absolute top-10 text-[11px] font-bold text-white uppercase tracking-wider text-center w-32">
            Personality Archetype
          </span>
        </div>

        {/* End Node */}
        <div className="relative z-20 flex flex-col items-center">
          <div className={`w-6 h-6 rounded-full border-[3px] border-[#222222] transition-all duration-500 ${
            progress >= 100 ? 'bg-[#D97706]' : 'bg-[#333333]'
          }`} />
          {/* Bold Label */}
          <span className={`absolute top-10 text-[11px] font-bold uppercase tracking-wider transition-colors duration-500 ${
            progress >= 100 ? 'text-white' : 'text-gray-500'
          }`}>
            Your Results
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;