export interface Community {
  id: string;
  name: string;
  description: string;
  matchedCareers: string[];
  isPrimaryMatch: boolean;
  memberCount: number;
}