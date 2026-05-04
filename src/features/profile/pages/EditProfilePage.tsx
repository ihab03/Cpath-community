import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMyProfile, useUpdateProfile } from '../hooks/useProfile';

export const EditProfilePage = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading, isError } = useMyProfile();
  
  // Notice we use the `onSuccess` callback here to redirect the user back to their profile
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  // Local state for the editable fields
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    isAcceptingDirectMessages: false,
  });

  // Populate the form once the profile data is fetched from the server
  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        isAcceptingDirectMessages: profile.isAcceptingDirectMessages || false,
      });
    }
  }, [profile]);

  // Handlers for text inputs and the toggle switch
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setFormData((prev) => ({ 
      ...prev, 
      isAcceptingDirectMessages: !prev.isAcceptingDirectMessages 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData, {
      onSuccess: () => {
        // Automatically send the user back to their profile page after saving
        navigate('/profile');
      }
    });
  };

  // --- RENDER LOADING STATE ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-[#D97706]/20 border-t-[#D97706] rounded-full animate-spin mb-4"></div>
        <p className="text-[#D97706] tracking-[0.2em] uppercase text-sm font-semibold animate-pulse">Loading Editor...</p>
      </div>
    );
  }

  // --- RENDER ERROR STATE ---
  if (isError) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white p-6">
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2 text-red-500">Unable to load profile</h2>
          <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition">Go Back</button>
        </div>
      </div>
    );
  }

  // --- RENDER MAIN UI ---
  return (
    <div className="min-h-screen bg-[#121212] text-[#E5E5E5] p-6 md:p-12 font-sans selection:bg-[#D97706]/30">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="mb-10">
          <Link to="/profile" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Profile
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Edit Profile</h1>
          <p className="text-gray-400 mt-2">Update your identity and communication preferences.</p>
        </div>

        {/* Edit Form Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D97706]/10 blur-[80px] rounded-full pointer-events-none" />

          <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-8">
            
            {/* Display Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="displayName" className="text-sm font-medium text-gray-300 ml-1">
                Display Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                required
                value={formData.displayName}
                onChange={handleChange}
                className="bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] outline-none transition-all"
                placeholder="How you appear in the community"
              />
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-2">
              <label htmlFor="bio" className="text-sm font-medium text-gray-300 ml-1 flex justify-between">
                <span>Professional Bio</span>
                <span className="text-gray-500 font-normal">{formData.bio?.length || 0} / 300</span>
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={5}
                maxLength={300}
                value={formData.bio}
                onChange={handleChange}
                className="bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] outline-none transition-all resize-none"
                placeholder="Share a bit about your background, goals, and interests..."
              />
            </div>

            {/* Direct Messages Toggle */}
            <div className="flex items-center justify-between p-5 bg-black/20 border border-white/5 rounded-2xl">
              <div>
                <h3 className="text-white font-medium">Accept Direct Messages</h3>
                <p className="text-sm text-gray-400 mt-1">Allow other community members to message you directly.</p>
              </div>
              
              {/* Custom UI Toggle Switch */}
              <button
              title='switch'
                type="button"
                onClick={handleToggle}
                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706] focus-visible:ring-opacity-75 ${
                  formData.isAcceptingDirectMessages ? 'bg-[#D97706]' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    formData.isAcceptingDirectMessages ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Actions Footer */}
            <div className="pt-6 mt-2 border-t border-white/10 flex items-center justify-end gap-4">
              <Link 
                to="/profile" 
                className="px-6 py-3.5 text-white hover:text-gray-300 font-medium transition-colors"
              >
                Cancel
              </Link>
              
              <button
                type="submit"
                disabled={isPending || !formData.displayName.trim()}
                className="px-8 py-3.5 bg-[#D97706] hover:bg-[#B45309] disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-lg shadow-[#D97706]/20 transition-all flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Profile'
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};