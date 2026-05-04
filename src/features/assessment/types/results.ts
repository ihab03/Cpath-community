// src/features/assessment/types/assessment.types.ts

export interface AlternativeCareer {
  careerId: number;
  title: string;
  sector: string;
}

export interface CareerMatchDetails {
  careerId: number;
  title: string;
  sector: string;
  description: string;
  educationLevel: string;
  coreSkills: string[];
  alternativeMatches: AlternativeCareer[];
}

export interface AssessmentResponse {
  assessmentId: string;
  completedAt: string; 
  matchDetails: CareerMatchDetails;
}