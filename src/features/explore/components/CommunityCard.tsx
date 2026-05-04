import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Community } from '../types/explore';

interface CardProps {
  data: Community;
}

export const CommunityCard = ({ data }: CardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 hover:border-white/10 hover:bg-[#1C1C1C] transition-all duration-300 flex flex-col h-full group hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#D97706]/5 relative overflow-hidden"
      >
        {/* Subtle hover gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#D97706]/0 to-[#D97706]/0 group-hover:from-[#D97706]/[0.02] transition-colors duration-500 pointer-events-none" />

        {/* Header: Badge & Menu */}
        <div className="relative flex justify-between items-start mb-4 z-10">
          {data.isPrimaryMatch ? (
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20 uppercase tracking-widest">
              Best Match
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/5 text-gray-400 border border-white/5 uppercase tracking-widest">
              Community
            </span>
          )}
        </div>

        {/* Title & Desc */}
        <h3 className="relative text-white font-bold text-xl mb-2 line-clamp-1 group-hover:text-[#D97706] transition-colors z-10" title={data.name}>
          {data.name}
        </h3>
        
        <p className="relative text-gray-400 text-sm mb-6 line-clamp-3 flex-grow leading-relaxed z-10">
          {data.description}
        </p>

        {/* Footer: Avatars & Button */}
        <div className="relative flex items-center justify-between pt-4 border-t border-white/5 z-10">
          
          {/* Avatars */}
          <div className="flex -space-x-2">
             <span className="text-xs text-gray-500 font-medium">
               {data.memberCount?.toLocaleString() || 0} members
             </span>
          </div>

          {/* Action Button (Direct Link) */}
          <Link 
            to={`/community/${data.id}`}
            onClick={(e) => e.stopPropagation()} // Prevents the click from opening the modal!
            className="px-5 py-2 rounded-xl bg-white/5 border border-white/5 text-white text-sm font-medium hover:bg-[#D97706] hover:border-[#D97706] hover:shadow-lg hover:shadow-[#D97706]/20 transition-all"
          >
            View
          </Link>
          
        </div>
      </div>

      {/* 
        POP-UP MODAL 
        Renders conditionally over the entire screen when the card is clicked.
      */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)} // Clicking the dark overlay closes the modal
        >
          {/* Modal Content Container */}
          <div 
            className="bg-[#121212] border border-white/10 rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} // Prevents clicks inside the modal from closing it
          >
            
            {/* Modal Header / Banner */}
            <div className="h-32 bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#D97706] via-transparent to-transparent"></div>
              
              {/* Close Button */}
              <button 
                title='close'
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white/70 hover:text-white hover:bg-black/40 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 -mt-12 relative z-10">
              
              {/* Avatar & Badges */}
              <div className="flex justify-between items-end mb-6">
                <div className="w-20 h-20 rounded-2xl bg-[#1E1E1E] border-4 border-[#121212] flex items-center justify-center shadow-xl">
                   <svg className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                   </svg>
                </div>
                {data.isPrimaryMatch && (
                  <span className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20 uppercase tracking-widest">
                    Best Match
                  </span>
                )}
              </div>

              {/* Text Info */}
              <h2 className="text-3xl font-bold text-white mb-2">{data.name}</h2>
              <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                {data.memberCount?.toLocaleString() || 0} Active Members
              </div>
              
              <p className="text-gray-300 leading-relaxed mb-8">
                {data.description}
              </p>

              {/* Career Paths (Restored for the detail view) */}
              {data.matchedCareers && data.matchedCareers.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Associated Careers</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.matchedCareers.map((career, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-white/5 border border-white/10 text-gray-300 text-xs rounded-lg">
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex gap-4 pt-6 border-t border-white/10">
                <Link 
                  to={`/community/${data.id}`}
                  className="flex-1 py-3.5 bg-[#D97706] hover:bg-[#B45309] text-white text-center rounded-xl font-semibold shadow-lg shadow-[#D97706]/20 transition-all"
                >
                  Enter Community
                </Link>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3.5 bg-transparent border border-white/20 text-white rounded-xl font-medium hover:bg-white/5 transition-colors"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};