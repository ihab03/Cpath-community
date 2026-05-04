import React, { useState, useRef, useEffect } from 'react';
import { useUploadMediaBatch, useCreatePost } from '../hooks/useCommunity';

interface CreatePostBoxProps {
  communityId: string;
  currentUserId: string;
  currentUserAvatarUrl?: string;
  isJoined: boolean;
  onJoinClick: () => void;
}

export const CreatePostBox = ({ 
  communityId, 
  currentUserId, 
  currentUserAvatarUrl,
  isJoined,
  onJoinClick
}: CreatePostBoxProps) => {
  const uploadMutation = useUploadMediaBatch();
  const createPostMutation = useCreatePost();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [careerTag, setCareerTag] = useState(''); // <-- NEW STATE
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    return () => previewUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [previewUrls]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newFiles = [...selectedFiles, ...files].slice(0, 4);
      setSelectedFiles(newFiles);
      setPreviewUrls(newFiles.map(file => URL.createObjectURL(file)));
    }
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== indexToRemove));
    setPreviewUrls(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // NEW: Validation for the Career Tag
    if (!title.trim() || !content.trim() || !careerTag) {
      setErrorMsg('Title, content, and a career tag are all required.');
      return;
    }

    setIsPublishing(true);
    setErrorMsg(null);

    try {
      let finalMediaUrls: string[] = [];

      if (selectedFiles.length > 0) {
        finalMediaUrls = await uploadMutation.mutateAsync(selectedFiles);
      }

      await createPostMutation.mutateAsync({
        communityId,
        userId: currentUserId,
        title: title.trim(),
        content: content.trim(),
        mediaUrls: finalMediaUrls,
        careerTag: careerTag, // <-- SENDING TO BACKEND
      });

      // Reset form
      setTitle('');
      setContent('');
      setCareerTag('');
      setSelectedFiles([]);
      setPreviewUrls([]);
      
    } catch (error) {
      console.error('Failed to publish post:', error);
      setErrorMsg('Failed to publish. Please check your connection and try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="bg-[#1A1A1A] rounded-[1.5rem] p-6 border border-white/5 mb-6 shadow-xl relative overflow-hidden">
      
      {isPublishing && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 overflow-hidden rounded-t-[1.5rem] z-30">
          <div className="w-full h-full bg-[#D97706] animate-pulse"></div>
        </div>
      )}

      {!isJoined && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#1A1A1A]/80 backdrop-blur-sm rounded-[1.5rem]">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3 shadow-lg">
             <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
             </svg>
          </div>
          <h3 className="text-white font-bold text-xl mb-2 tracking-tight">Members Only</h3>
          <p className="text-gray-400 text-sm mb-6 text-center max-w-[250px]">
            Join the community to start discussions, share media, and vote on posts.
          </p>
          <button 
            onClick={onJoinClick}
            className="px-6 py-2.5 bg-[#D97706] hover:bg-[#B45309] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#D97706]/20"
          >
            Join Community
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className={`relative z-10 transition-opacity duration-300 ${!isJoined ? 'opacity-30 pointer-events-none select-none blur-[2px]' : ''}`}>
        
        <div className="flex gap-4 mb-4">
          {currentUserAvatarUrl ? (
            <img src={currentUserAvatarUrl} alt="You" className="w-12 h-12 rounded-full object-cover border-2 border-white/10 shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#D97706] to-[#F59E0B] flex items-center justify-center text-white font-bold shrink-0 shadow-inner">
              U
            </div>
          )}
          
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Title of your post..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPublishing || !isJoined}
              className="w-full bg-transparent text-white text-xl font-bold placeholder-gray-500 focus:outline-none focus:border-b border-[#D97706]/50 pb-2 transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        <textarea
          placeholder="What's on your mind? Share your progress, ask a question, or post a demo..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isPublishing || !isJoined}
          rows={3}
          className="w-full bg-black/20 text-gray-300 placeholder-gray-600 rounded-xl p-4 focus:outline-none focus:ring-1 focus:ring-[#D97706]/50 border border-transparent focus:border-[#D97706]/30 resize-none transition-all disabled:opacity-50"
        />

        {previewUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group rounded-xl overflow-hidden border border-white/10 h-32 bg-black/40">
                {selectedFiles[index].type.startsWith('video/') ? (
                  <video src={url} className="w-full h-full object-cover" />
                ) : (
                  <img src={url} alt="Preview" className="w-full h-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  disabled={!isJoined}
                  className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
            {errorMsg}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          
          <div className="flex items-center gap-4">
            <input
              type="file"
              multiple
              accept="image/*,video/mp4,video/webm"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              disabled={isPublishing || selectedFiles.length >= 4 || !isJoined}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isPublishing || selectedFiles.length >= 4 || !isJoined}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 rounded-lg hover:bg-white/5"
            >
              <svg className="w-5 h-5 text-[#D97706]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Media</span>
            </button>

            {/* NEW: Career Tag Dropdown */}
            <select
              value={careerTag}
              onChange={(e) => setCareerTag(e.target.value)}
              disabled={isPublishing || !isJoined}
              className="bg-black/20 text-gray-400 rounded-lg px-3 py-2 text-sm border border-white/5 focus:outline-none focus:border-[#D97706]/50 focus:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="" disabled>Select Career Tag...</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Data Science">Data Science</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Business/Management">Business/Management</option>
              <option value="General">General</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isPublishing || !title.trim() || !content.trim() || !careerTag || !isJoined}
            className="px-6 py-2 bg-[#D97706] hover:bg-[#B45309] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#D97706]/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2"
          >
            {isPublishing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Publishing...
              </>
            ) : (
              'Post'
            )}
          </button>
        </div>

      </form>
    </div>
  );
};