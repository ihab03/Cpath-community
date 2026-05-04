// src/features/communities/components/PostCard.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Post } from '../types/community';
import { useVotePost, useRemovePostVote } from '../hooks/useCommunity';

// Helper to determine if a URL is a video
const isVideoUrl = (url: string) => {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  return lowerUrl.includes('.mp4') || lowerUrl.includes('.webm') || lowerUrl.includes('.mov');
};

interface PostCardProps {
  post: Post; // Make sure your Post type includes `mediaUrls?: string[]`
  currentUserId?: string; 
  isJoined?: boolean;
  initialVoteState?: 'up' | 'down' | null; 
  isDetailView?: boolean;
  onCardClick?: () => void;
}

const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const seconds = Math.round((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)}h`;
  return `${Math.round(seconds / 86400)}d`;
};

export const PostCard = ({ 
  post, 
  currentUserId, 
  isJoined = false, 
  initialVoteState = null,
  isDetailView = false, 
  onCardClick
}: PostCardProps) => {
  const voteMutation = useVotePost();
  const removeMutation = useRemovePostVote(); 
  const navigate = useNavigate();
  
  const [localVoteCount, setLocalVoteCount] = useState(post.upvoteCount - post.downvoteCount);
  const [userVoteState, setUserVoteState] = useState<'up' | 'down' | null>(initialVoteState);

  useEffect(() => {
    if (initialVoteState !== undefined) {
      setUserVoteState(initialVoteState);
    }
  }, [initialVoteState]);

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!isJoined || !currentUserId) return; 

    if (userVoteState === 'up') {
      setLocalVoteCount(prev => prev - 1);
      setUserVoteState(null);
      removeMutation.mutate({ postId: post.id, userId: currentUserId });
      return;
    }
    
    setLocalVoteCount(prev => userVoteState === 'down' ? prev + 2 : prev + 1);
    setUserVoteState('up');
    voteMutation.mutate({ postId: post.id, userId: currentUserId, isUpvote: true });
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!isJoined || !currentUserId) return; 

    if (userVoteState === 'down') {
      setLocalVoteCount(prev => prev + 1);
      setUserVoteState(null);
      removeMutation.mutate({ postId: post.id, userId: currentUserId });
      return;
    }
    
    setLocalVoteCount(prev => userVoteState === 'up' ? prev - 2 : prev - 1);
    setUserVoteState('down');
    voteMutation.mutate({ postId: post.id, userId: currentUserId, isUpvote: false });
  };

  const handleCardClick = () => {
    if (!isDetailView && onCardClick) {
      onCardClick();
    }
  };

  // --- NEW: Render Media Grid Helper ---
  const renderMediaGrid = () => {
    const urls = post.mediaUrls || [];
    if (urls.length === 0) return null;

    return (
      <div className={`grid gap-2 mb-4 ${urls.length === 1 ? 'grid-cols-1' : urls.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
        {urls.map((url, index) => {
          const isVideo = isVideoUrl(url);
          // If there's only 1 image, let it be taller. Otherwise, restrict height.
          const heightClass = urls.length === 1 
            ? (isDetailView ? 'max-h-[500px]' : 'max-h-[350px]') 
            : 'h-48';

          return (
            <div key={index} className={`relative rounded-xl overflow-hidden border border-white/10 bg-black/40 ${heightClass}`}>
              {isVideo ? (
                <video 
                  src={url} 
                  controls={isDetailView} // Only show controls if in detail view, else let it be a silent preview or require click
                  autoPlay={!isDetailView}
                  muted
                  loop
                  className="w-full h-full object-cover" 
                />
              ) : (
                <img 
                  src={url} 
                  alt={`Attachment ${index + 1}`} 
                  className={`w-full h-full ${urls.length === 1 && isDetailView ? 'object-contain' : 'object-cover'}`} 
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`bg-[#1A1A1A] rounded-[1.5rem] p-5 border border-white/5 transition-all duration-500 ${!isDetailView ? 'cursor-pointer hover:border-white/10 hover:bg-[#1E1E1E]' : ''}`}
    >
      
      {/* Header (Author & Pinned) */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {post.authorAvatarUrl ? (
             <img src={post.authorAvatarUrl} alt={post.authorName} className="w-10 h-10 rounded-full object-cover border border-white/10" />
          ) : (
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D97706] to-[#F59E0B] flex items-center justify-center text-white font-bold">
               {post.authorName.charAt(0).toUpperCase()}
             </div>
          )}
          <div>
            <h4 className="text-white font-medium leading-tight">{post.authorName}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-500">{timeAgo(post.createdAt)}</span>
              <span className="text-xs text-gray-600">•</span>
              <span className="text-[10px] uppercase tracking-wider text-[#D97706] font-bold bg-[#D97706]/10 px-1.5 py-0.5 rounded">{post.careerTag}</span>
            </div>
          </div>
        </div>
        {post.isPinned && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#D97706] bg-[#D97706]/10 px-2.5 py-1 rounded-md">
            Pinned
          </div>
        )}
      </div>

      {/* Body & Link */}
      {isDetailView ? (
        <div className="block">
          <h3 className="text-xl font-bold text-white mb-3">{post.title}</h3>
          {post.body && <p className="text-gray-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{post.body}</p>}
          
          {/* --- RENDER MEDIA HERE --- */}
          {renderMediaGrid()}
        </div>
      ) : (
        <div className="block group">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#D97706] transition-colors">{post.title}</h3>
          {post.body && <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-4">{post.body}</p>}
          
          {/* --- RENDER MEDIA HERE --- */}
          {renderMediaGrid()}
        </div>
      )}

      {/* Footer: Interactions */}
      <div className="flex items-center gap-6 pt-4 border-t border-white/5 mt-2">
        
        {/* Votes */}
        <div className="flex items-center bg-white/5 rounded-full border border-white/5">
          <button 
            onClick={handleUpvote}
            disabled={voteMutation.isPending || removeMutation.isPending}
            className={`p-2 rounded-l-full transition-colors ${
              !isJoined 
                ? 'cursor-not-allowed opacity-30 text-gray-600' 
                : userVoteState === 'up' ? 'text-[#D97706] bg-white/5' : 'text-gray-400 hover:bg-white/10'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
          </button>
          
          <span className={`text-sm font-bold px-2 min-w-[24px] text-center ${
            userVoteState === 'up' ? 'text-[#D97706]' : userVoteState === 'down' ? 'text-blue-500' : 'text-white'
          }`} style={{ fontVariantNumeric: 'tabular-nums' }}>
            {localVoteCount}
          </span>
          
          <button 
            onClick={handleDownvote}
            disabled={voteMutation.isPending || removeMutation.isPending}
            className={`p-2 rounded-r-full transition-colors ${
              !isJoined 
                ? 'cursor-not-allowed opacity-30 text-gray-600' 
                : userVoteState === 'down' ? 'text-blue-500 bg-white/5' : 'text-gray-400 hover:bg-white/10'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>

        {/* Comments Link */}
        <div className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group cursor-pointer">
          <div className="p-2 rounded-full group-hover:bg-white/5 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <span className="text-sm font-medium">{post.commentCount}</span>
        </div>
      </div>
    </div>
  );
};