import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAllCommunities } from '../../communities/hooks/useCommunity';

export const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // Fetch all communities (uses React Query cache, so it's instantly loaded if already fetched!)
  const { data: allCommunities, isLoading } = useAllCommunities();

  // Filter logic: Checks if the search query is in the community name or description
  const filteredCommunities = allCommunities?.filter(community => 
    community.name.toLowerCase().includes(query.toLowerCase()) || 
    (community.description && community.description.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#050505] text-[#E5E5E5] p-6 md:p-10">
      <div className=" mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <Link to="/explore" className="text-gray-500 hover:text-[#D97706] text-sm font-medium flex items-center gap-2 mb-4 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Explore
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Search Results
          </h1>
          <p className="text-gray-400 text-lg">
            Showing results for <span className="text-[#D97706] font-semibold">"{query}"</span>
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#D97706]/30 border-t-[#D97706] rounded-full animate-spin"></div>
          </div>
        ) : filteredCommunities && filteredCommunities.length > 0 ? (
          
          /* Results Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommunities.map(community => (
              <Link 
                key={community.id} 
                to={`/community/${community.id}`}
                className="group bg-[#0A0A0A] border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(217,119,6,0.1)] flex flex-col h-full relative overflow-hidden"
              >
                {/* Subtle Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#D97706]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
              
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#D97706] transition-colors">{community.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed flex-grow line-clamp-3">
                  {community.description || "No description provided for this community."}
                </p>
                
                <div className="mt-6 text-sm font-semibold text-[#D97706] flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                  View Community <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </Link>
            ))}
          </div>

        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-sm">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No communities found</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              We couldn't find any communities matching "{query}". Try searching for something else or explore all communities.
            </p>
            <Link to="/explore" className="px-6 py-2.5 bg-[#D97706] hover:bg-[#B45309] text-white font-semibold rounded-xl transition-all">
              View All Communities
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};