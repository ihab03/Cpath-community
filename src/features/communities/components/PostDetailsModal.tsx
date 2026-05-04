import React, { useEffect } from 'react';
import { usePostDetails } from '../hooks/useCommunity';
import { PostCard } from './PostCard';
import { CommentSection } from './CommentSection';

interface PostDetailsModalProps {
  postId: string;
  onClose: () => void;
  currentUserId?: string;
  isJoined: boolean;
}

export const PostDetailsModal = ({ postId, onClose, currentUserId, isJoined }: PostDetailsModalProps) => {
  // Fetch the full details (Post + Comments)
  const { data: postDetails, isLoading } = usePostDetails(postId);

  // Close the modal if the user presses the Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    // Modal Overlay (Dark, blurred background)
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
      onClick={onClose} // Clicking the background closes it
    >
      {/* Modal Container */}
      <div 
        className="bg-[#0A0A0A] w-full max-w-3xl max-h-[90vh] rounded-3xl border border-white/10 shadow-2xl overflow-y-auto flex flex-col relative"
        onClick={(e) => e.stopPropagation()} // Stop clicks inside from closing the modal
      >
        
        {/* Sticky Close Button */}
        <div className="sticky top-0 z-20 flex justify-end p-4 bg-gradient-to-b from-[#0A0A0A] to-transparent pointer-events-none">
          <button 
            onClick={onClose}
            className="p-2 bg-black/50 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors pointer-events-auto backdrop-blur-md border border-white/5"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="px-6 pb-8 -mt-8">
          {isLoading || !postDetails ? (
            <div className="flex justify-center items-center py-20">
               <div className="w-8 h-8 border-4 border-[#D97706]/30 border-t-[#D97706] rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Reuse the PostCard in Detail View mode! */}
              <PostCard 
                post={postDetails.post} 
                currentUserId={currentUserId}
                isJoined={isJoined}
                isDetailView={true} 
              />

              <CommentSection 
                postId={postDetails.post.id}
                comments={postDetails.comments}
                currentUserId={currentUserId}
                isJoined={isJoined}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};