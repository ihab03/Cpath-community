export interface CommunityDto {
  id: string;
  name: string;
  description: string;
  matchedCareers: string[];
  isPrimaryMatch: boolean;
}


// Maps to CommentDto
export interface Comment {
  id: string;
  postId: string;
  parentCommentId: string | null;
  userId: string;
  body: string;
  authorName: string;
  authorAvatarUrl: string | null;
  upvoteCount: number;
  downvoteCount: number;
  isInstructorEndorsed: boolean;
  createdAt: string;
  replies: Comment[];
}

// Maps to PostDto
export interface Post {
  id: string;
  communityId: string;
  authorId: string;
  title: string;
  body: string | null;
  mediaUrls?: string[];
  careerTag: string;
  authorName: string;
  authorAvatarUrl: string | null;
  upvoteCount: number;
  downvoteCount: number;
  commentCount: number;
  createdAt: string;
  isPinned: boolean;
}

// Maps to PostDetailsDto
export interface PostDetails {
  post: Post;
  comments: Comment[];
}

// Maps to PostVoteStateDto
export interface PostVoteState {
  postId: string;
  isUpvote: boolean;
}

// Maps to CommentVoteStateDto
export interface CommentVoteState {
  commentId: string;
  isUpvote: boolean;
}

// We will also need this for the Valet Key media upload response
export interface UploadTicket {
  uploadUrl: string;
  finalUrl: string;
}


export interface Comment {
  id: string;
  postId: string;
  parentCommentId: string | null; 
  userId: string; 
  body: string;
  authorName: string;
  authorAvatarUrl: string | null; 
  upvoteCount: number;
  downvoteCount: number;
  isInstructorEndorsed: boolean;
  createdAt: string;
  replies: Comment[]; 
}

export interface PostDetails {
  post: Post;
  comments: Comment[];
}