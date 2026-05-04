// src/features/communities/components/CommentSection.tsx
import React, { useState } from 'react';
import type { Comment } from '../types/community';
import { useCreateComment, useVoteComment, useRemoveCommentVote } from '../hooks/useCommunity';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  currentUserId?: string;
  currentUserAvatarUrl?: string;
  isJoined: boolean;
}

const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const seconds = Math.round((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)}h`;
  return `${Math.round(seconds / 86400)}d`;
};

// --- RECURSIVE COMMENT COMPONENT ---
const CommentItem = ({ 
  comment, 
  postId, 
  currentUserId, 
  isJoined,
  depth = 0,
  initialVoteState = null 
}: { 
  comment: Comment; 
  postId: string; 
  currentUserId?: string; 
  isJoined: boolean;
  depth?: number;
  initialVoteState?: 'up' | 'down' | null;
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  
  const createCommentMutation = useCreateComment(postId);
  
  // VOTE LOGIC
  const voteMutation = useVoteComment();
  const removeMutation = useRemoveCommentVote();
  
  const [localVoteCount, setLocalVoteCount] = useState(comment.upvoteCount - comment.downvoteCount);
  const [userVoteState, setUserVoteState] = useState<'up' | 'down' | null>(initialVoteState);

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!isJoined || !currentUserId) return; 

    // TOGGLE OFF
    if (userVoteState === 'up') {
      setLocalVoteCount(prev => prev - 1);
      setUserVoteState(null);
      removeMutation.mutate({ commentId: comment.id, userId: currentUserId });
      return;
    }
    
    // OPTIMISTIC SWING MATH
    setLocalVoteCount(prev => userVoteState === 'down' ? prev + 2 : prev + 1);
    setUserVoteState('up');
    voteMutation.mutate({ commentId: comment.id, userId: currentUserId, isUpvote: true });
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!isJoined || !currentUserId) return; 

    // TOGGLE OFF
    if (userVoteState === 'down') {
      setLocalVoteCount(prev => prev + 1);
      setUserVoteState(null);
      removeMutation.mutate({ commentId: comment.id, userId: currentUserId });
      return;
    }
    
    // OPTIMISTIC SWING MATH
    setLocalVoteCount(prev => userVoteState === 'up' ? prev - 2 : prev - 1);
    setUserVoteState('down');
    voteMutation.mutate({ commentId: comment.id, userId: currentUserId, isUpvote: false });
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyBody.trim() || !currentUserId || !isJoined) return;

    createCommentMutation.mutate({
      postId,
      userId: currentUserId,
      body: replyBody.trim(),
      parentCommentId: comment.id // This makes it a reply!
    }, {
      onSuccess: () => {
        setReplyBody('');
        setIsReplying(false);
      }
    });
  };

  return (
    <div className={`flex gap-3 ${depth > 0 ? 'mt-4' : 'mt-6'}`}>
      
      {/* Avatar */}
      <div className="flex flex-col items-center gap-2">
        {comment.authorAvatarUrl ? (
          <img src={comment.authorAvatarUrl} alt={comment.authorName} className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 text-xs font-bold shrink-0">
            {comment.authorName.charAt(0).toUpperCase()}
          </div>
        )}
        {/* Thread line connecting to replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="w-[2px] h-full bg-white/5 rounded-full flex-grow mt-1"></div>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow pb-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white font-medium text-sm">{comment.authorName}</span>
          {comment.isInstructorEndorsed && (
             <span className="text-[10px] uppercase tracking-wider text-[#D97706] font-bold bg-[#D97706]/10 px-1.5 py-0.5 rounded flex items-center gap-1">
               <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               Instructor
             </span>
          )}
          <span className="text-xs text-gray-600">•</span>
          <span className="text-xs text-gray-500">{timeAgo(comment.createdAt)}</span>
        </div>
        
        <p className="text-gray-300 text-sm leading-relaxed mb-2">{comment.body}</p>

        {/* Action Row (Reply & Votes) */}
        <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
          
          {/* UPDATED: Vote Buttons */}
          <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-full border border-white/5">
            <button 
              onClick={handleUpvote}
              disabled={!isJoined || voteMutation.isPending || removeMutation.isPending}
              className={`transition-colors ${userVoteState === 'up' ? 'text-[#D97706]' : 'hover:text-[#D97706] disabled:opacity-50'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
            </button>
            
            <span className={`min-w-[16px] text-center ${userVoteState === 'up' ? 'text-[#D97706]' : userVoteState === 'down' ? 'text-blue-500' : 'text-gray-400'}`}>
              {localVoteCount}
            </span>
            
            <button 
              onClick={handleDownvote}
              disabled={!isJoined || voteMutation.isPending || removeMutation.isPending}
              className={`transition-colors ${userVoteState === 'down' ? 'text-blue-500' : 'hover:text-blue-500 disabled:opacity-50'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
          
          <button 
            onClick={() => setIsReplying(!isReplying)} 
            disabled={!isJoined}
            className="hover:text-white transition-colors flex items-center gap-1 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
            Reply
          </button>
        </div>

        {/* Reply Input Box */}
        {isReplying && (
          <form onSubmit={handleReplySubmit} className="mt-3 flex gap-3 pr-4">
             <input
              type="text"
              autoFocus
              placeholder="Write a reply..."
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              disabled={createCommentMutation.isPending}
              className="flex-grow bg-black/20 text-gray-300 placeholder-gray-600 rounded-lg px-3 py-2 text-sm border border-white/5 focus:outline-none focus:border-[#D97706]/50 transition-colors"
            />
            <button
              type="submit"
              disabled={!replyBody.trim() || createCommentMutation.isPending}
              className="px-4 py-2 bg-white/10 hover:bg-[#D97706] text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              Post
            </button>
          </form>
        )}

        {/* RECURSIVE CALL: Render Replies! */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="pl-2">
            {comment.replies.map(reply => (
              <CommentItem 
                key={reply.id} 
                comment={reply} 
                postId={postId}
                currentUserId={currentUserId}
                isJoined={isJoined}
                depth={depth + 1} // Increase depth to limit deep nesting if needed later
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN SECTION COMPONENT ---
export const CommentSection = ({ postId, comments, currentUserId, currentUserAvatarUrl, isJoined }: CommentSectionProps) => {
  const [mainCommentBody, setMainCommentBody] = useState('');
  const createCommentMutation = useCreateComment(postId);

  const handleMainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainCommentBody.trim() || !currentUserId || !isJoined) return;

    createCommentMutation.mutate({
      postId,
      userId: currentUserId,
      body: mainCommentBody.trim(),
      parentCommentId: null // Top level comment
    }, {
      onSuccess: () => setMainCommentBody('') 
    });
  };

  return (
    <div className="mt-8 bg-[#1A1A1A] rounded-[1.5rem] p-6 border border-white/5">
      <h3 className="text-xl font-bold text-white mb-6">Comments</h3>

      {/* Write Top-Level Comment Box */}
      <div className="mb-8 relative">
        {!isJoined && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#1A1A1A]/80 backdrop-blur-[1px] rounded-xl">
            <p className="text-[#D97706] font-semibold text-sm">Join the community to leave a comment.</p>
          </div>
        )}
        
        <form onSubmit={handleMainSubmit} className="flex gap-4">
          {currentUserAvatarUrl ? (
            <img src={currentUserAvatarUrl} alt="You" className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D97706] to-[#F59E0B] flex items-center justify-center text-white font-bold shrink-0">
              U
            </div>
          )}
          <div className="flex-grow flex flex-col gap-3">
            <textarea
              placeholder="What are your thoughts?"
              value={mainCommentBody}
              onChange={(e) => setMainCommentBody(e.target.value)}
              disabled={createCommentMutation.isPending || !isJoined}
              rows={2}
              className="w-full bg-black/20 text-gray-300 placeholder-gray-600 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-[#D97706]/50 border border-transparent focus:border-[#D97706]/30 resize-none transition-all text-sm"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!mainCommentBody.trim() || createCommentMutation.isPending || !isJoined}
                className="px-5 py-2 bg-[#D97706] hover:bg-[#B45309] text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {createCommentMutation.isPending ? 'Posting...' : 'Comment'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Render Comments */}
      <div className="divide-y divide-white/5">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              postId={postId}
              currentUserId={currentUserId}
              isJoined={isJoined}
            />
          ))
        )}
      </div>
    </div>
  );
};