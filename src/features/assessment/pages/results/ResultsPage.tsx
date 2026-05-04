import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useResults } from '../../hooks/useResults';
import { useAuthStore } from '../../../auth/stores/useAuthStore';
// 1. IMPORT BOTH HOOKS
import { useSuggestedCommunities, useAllCommunities } from '../../../communities/hooks/useCommunity'; 

export const ResultsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch Assessment Results
  const { data: result, isLoading, isError } = useResults(id);

  // Grab User Info for the AI Suggestions
  const { userId, fullName } = useAuthStore();
  
  // Fetch Suggested Communities based on the user
  const { data: suggestedCommunities, isLoading: isSuggestionsLoading } = useSuggestedCommunities(userId || undefined);
  
  // 2. FETCH ALL COMMUNITIES (as a fallback dictionary to get the names/descriptions)
  const { data: allCommunities } = useAllCommunities();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center text-white">
        <div className="relative w-16 h-16 flex items-center justify-center mb-6">
          <div className="absolute inset-0 border-4 border-[#D97706]/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-[#D97706] tracking-[0.2em] uppercase text-sm font-semibold animate-pulse">
          Generating Your Future...
        </p>
      </div>
    );
  }

  if (isError || !result) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center text-white p-6">
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center max-w-md">
          <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold mb-2">Results Not Found</h2>
          <p className="text-gray-400 mb-8">We couldn't locate this assessment profile. It may have expired or been removed.</p>
          <Link to="/assessment" className="px-6 py-3 bg-[#D97706] rounded-xl hover:bg-[#B45309] transition-colors font-medium">
            Take the Assessment
          </Link>
        </div>
      </div>
    );
  }

  const { matchDetails } = result;

  return (
    <div className="min-h-screen bg-[#121212] text-[#E5E5E5] p-4 md:p-10 font-sans selection:bg-[#D97706]/30">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HERO SECTION WITH GLOW */}
        <section className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-16 rounded-[2.5rem] shadow-2xl">
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-[#D97706]/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between items-start md:items-end">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D97706]/10 border border-[#D97706]/20 rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse" />
                <span className="text-[#D97706] font-bold tracking-[0.15em] uppercase text-xs">Primary Match</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight leading-tight">
                {matchDetails.title}
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light mb-8 max-w-2xl">
                {matchDetails.description}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link 
                  to="/explore" 
                  className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#D97706] to-[#F59E0B] rounded-full text-white font-semibold shadow-lg shadow-[#D97706]/20 hover:shadow-[#D97706]/40 hover:-translate-y-1 transition-all duration-300"
                >
                  Explore Communities
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                
                <div className="px-6 py-4 bg-black/20 border border-white/5 rounded-full text-gray-400 text-sm font-medium">
                  Sector: <span className="text-white">{matchDetails.sector}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 hover:bg-white/[0.04] transition-colors">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-[#D97706]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Core Competencies
              </h2>
              <div className="flex flex-wrap gap-3">
                {matchDetails.coreSkills.map((skill, i) => (
                  <span key={i} className="px-5 py-2.5 bg-black/40 border border-white/10 text-gray-200 rounded-xl text-sm hover:border-[#D97706]/50 hover:text-white transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 flex items-start gap-5">
              <div className="p-3 bg-[#D97706]/10 rounded-2xl shrink-0">
                <svg className="w-8 h-8 text-[#D97706]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Educational Pathway</h2>
                <p className="text-gray-400 leading-relaxed">
                  To pursue this career, you will typically need <span className="text-white font-medium">{matchDetails.educationLevel}</span>. 
                  Joining communities in this field is a great way to network with students and professionals already on this path.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-b from-white/[0.03] to-transparent p-8 rounded-[2rem] border border-white/5 h-fit">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Alternative Paths
            </h2>
            <div className="space-y-4">
              {matchDetails.alternativeMatches.map((alt) => (
                <div 
                  key={alt.careerId} 
                  className="group p-5 bg-black/20 border border-white/5 rounded-2xl hover:bg-black/40 hover:border-[#D97706]/30 transition-all cursor-default"
                >
                  <h4 className="text-white font-medium group-hover:text-[#D97706] transition-colors">{alt.title}</h4>
                  <p className="text-gray-500 text-xs mt-1.5 uppercase tracking-wider">{alt.sector}</p>
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* --- RECOMMENDED COMMUNITIES SECTION --- */}
        <div className="pt-12 mt-12 border-t border-white/[0.05]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse shadow-[0_0_8px_rgba(217,119,6,0.8)]"></span>
              <h2 className="text-2xl font-bold text-white tracking-tight">Your Recommended Communities</h2>
            </div>
            <Link to="/explore" className="text-sm font-medium text-gray-500 hover:text-white transition-colors">
              View all
            </Link>
          </div>

          {isSuggestionsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-50">
              {[1, 2, 3].map((n) => (
                <div key={n} className="w-full h-48 bg-white/5 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : suggestedCommunities && suggestedCommunities.length > 0 ? (
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedCommunities.map((c: any) => {
                // 3. BULLETPROOF MAPPING (Handles both string IDs and full objects)
                const communityId = typeof c === 'string' ? c : c.id;
                const communityObj = allCommunities?.find((ac: any) => ac.id === communityId) 
                                     || (typeof c !== 'string' ? c : null);

                // If we can't resolve the community data yet, don't crash
                if (!communityObj) return null;

                return <CommunityCard key={communityId} community={communityObj} />;
              })}
            </div>

          ) : (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-gray-400">We are gathering more data to find your perfect communities.</p>
              <button onClick={() => navigate('/explore')} className="mt-4 text-[#D97706] font-semibold hover:underline">
                Explore all communities manually
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// --- Reusable Premium Community Card Component ---
const CommunityCard = ({ community }: { community: any }) => (
  <Link 
    to={`/community/${community.id}`}
    className="group bg-[#141414] border border-white/[0.04] hover:border-[#D97706]/30 rounded-[1.5rem] p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(217,119,6,0.15)] flex flex-col h-full relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#D97706]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    
    <div className="w-12 h-12 rounded-[1rem] bg-gradient-to-br from-[#D97706]/20 to-[#D97706]/5 border border-[#D97706]/20 flex items-center justify-center text-[#D97706] font-bold text-xl mb-5 shadow-lg group-hover:scale-110 transition-transform duration-500">
      {/* 4. SAFE OPTIONAL CHAINING */}
      {community.name?.charAt(0) || 'C'}
    </div>
    
    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#D97706] transition-colors duration-300 leading-tight">
      {community.name || 'Community'}
    </h3>
    
    <p className="text-gray-400 text-sm leading-relaxed flex-grow line-clamp-3">
      {community.description || "Join this community to connect with mentors and peers in this field."}
    </p>
    
    <div className="mt-6 pt-4 border-t border-white/[0.04] text-sm font-bold text-[#D97706] flex items-center justify-between group-hover:pl-2 transition-all duration-300">
      Join Discussion
      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
    </div>
  </Link>
);