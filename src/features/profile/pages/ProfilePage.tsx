import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMyProfile, useUserProfile } from '../hooks/useProfile';

export const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const isOwnProfile = !id; 

  const myProfileQuery = useMyProfile(isOwnProfile);
  const userProfileQuery = useUserProfile(id);

  const isLoading = isOwnProfile ? myProfileQuery.isLoading : userProfileQuery.isLoading;
  const isError = isOwnProfile ? myProfileQuery.isError : userProfileQuery.isError;
  const profile = isOwnProfile ? myProfileQuery.data : userProfileQuery.data;

  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center text-white">
        <div className="relative w-16 h-16 flex items-center justify-center mb-6">
          <div className="absolute inset-0 border-4 border-[#D97706]/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-[#D97706] tracking-[0.2em] uppercase text-sm font-semibold animate-pulse">
          Loading Profile...
        </p>
      </div>
    );
  }

  // --- RENDER ERROR STATE ---
  if (isError || !profile) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white p-6">
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2 text-red-500">Profile Not Found</h2>
          <p className="text-gray-400">There was an issue loading this profile data. The user may not exist.</p>
        </div>
      </div>
    );
  }

  // --- RENDER MAIN UI ---
  return (
    <div className="min-h-screen bg-[#121212] text-[#E5E5E5] p-6 md:p-12 font-sans selection:bg-[#D97706]/30">
      <div className=" mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              {isOwnProfile ? 'My Profile' : `${profile.displayName}'s Profile`}
            </h1>
            <p className="text-gray-400 mt-2">
              {isOwnProfile ? 'Your community identity and career metrics.' : 'Community member profile.'}
            </p>
          </div>
          
          {isOwnProfile && (
          <Link 
    to="/profile/edit" 
    className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-sm font-medium transition-colors w-fit shadow-sm"
  >
    Edit Profile
  </Link>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D97706]/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-10">
            
            {/* Avatar & Main Info Row */}
            <div className="flex items-center gap-6 pb-8 border-b border-white/10">
              {profile.avatarUrl ? (
                <img 
                  src={profile.avatarUrl} 
                  alt={profile.displayName} 
                  className="w-24 h-24 rounded-full object-cover border-2 border-white/10 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#D97706] to-[#F59E0B] flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-[#D97706]/20">
                  {profile.displayName.charAt(0).toUpperCase()}
                </div>
              )}
              
              <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">
                  {profile.displayName}
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className="px-3 py-1 bg-[#D97706]/10 border border-[#D97706]/20 text-[#D97706] text-xs font-bold tracking-wider uppercase rounded-lg">
                    {profile.type}
                  </span>
                  {profile.isAcceptingDirectMessages && (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-green-400 bg-green-400/10 px-3 py-1 rounded-lg border border-green-400/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Open to DMs
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Bio Section (Takes up 2 columns) */}
              <div className="md:col-span-2 flex flex-col gap-3">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  About Me
                </span>
                <div className="bg-black/20 border border-white/5 rounded-2xl p-6 text-gray-300 leading-relaxed h-full">
                  {profile.bio ? (
                    profile.bio
                  ) : (
                    <span className="text-gray-600 italic">This user hasn't written a bio yet.</span>
                  )}
                </div>
              </div>

              {/* Stats & Metadata Column */}
              <div className="flex flex-col gap-4">
                
                {/* Reputation Score Card */}
                <div className="bg-black/20 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Reputation</span>
                    <span className="text-2xl font-bold text-white">{profile.reputationScore}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#D97706]/10 flex items-center justify-center text-[#D97706]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                </div>

                {/* Career Status Placeholder */}
                <div className="bg-black/20 border border-white/5 rounded-2xl p-5">
                   <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-3">Career Path</span>
                   {profile.targetCareerId ? (
                     <div className="text-sm text-gray-300">
                        <span className="text-[#D97706] font-medium">Path Locked</span>
                        <p className="text-xs text-gray-500 mt-1 truncate" title={profile.targetCareerId}>
                          ID: {profile.targetCareerId.split('-')[0]}...
                        </p>
                     </div>
                   ) : (
                     <span className="text-sm text-gray-600 italic">Exploring Options</span>
                   )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};