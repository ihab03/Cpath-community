export interface UserProfile {
  userId: string;
  displayName: string;
  bio: string;
  skills: string[];
  avatarUrl: string;
  type: string;
  primarySectorId: number;
  targetCareerId: string;
  latestAssessmentId: string;
  reputationScore: number;
  isAcceptingDirectMessages: boolean;
}

export interface CareerSummary {
  careerId: string;
  title: string;
  sector: string;
}