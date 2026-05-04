import React from 'react';
import { useCommunities } from '../hooks/useCommunities';
import { CommunityCard } from '../components/CommunityCard';

export const ExplorePage = () => {
  const { data: communities, isLoading, isError } = useCommunities();

  // --- RENDER LOADING STATE ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center text-white">
        <div className="relative w-16 h-16 flex items-center justify-center mb-6">
          <div className="absolute inset-0 border-4 border-[#D97706]/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-[#D97706] tracking-[0.2em] uppercase text-sm font-semibold animate-pulse">
          Loading Communities...
        </p>
      </div>
    );
  }

  // --- RENDER ERROR STATE ---
  if (isError) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white p-6">
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2 text-red-500">Unable to load communities</h2>
          <p className="text-gray-400">There was an issue connecting to the server. Please try refreshing.</p>
        </div>
      </div>
    );
  }

  // Sort communities so the Primary Matches appear at the very top of the list
  const sortedCommunities = communities?.sort((a, b) => 
    (b.isPrimaryMatch ? 1 : 0) - (a.isPrimaryMatch ? 1 : 0)
  );

  // --- RENDER MAIN UI ---
  return (
    <div className="min-h-screen bg-[#121212] text-[#E5E5E5] p-6 md:p-12 font-sans selection:bg-[#D97706]/30">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Explore Communities
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Discover groups of like-minded individuals, network with professionals, and find the right path for your career based on your assessment results.
          </p>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCommunities?.map((community) => (
            <CommunityCard key={community.id} data={community} />
          ))}
        </div>

        {/* Empty State */}
        {sortedCommunities?.length === 0 && (
          <div className="text-center py-20 text-gray-500 bg-white/5 border border-white/10 rounded-3xl">
            <svg className="w-12 h-12 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            No communities available at this time.
          </div>
        )}

      </div>
    </div>
  );
};