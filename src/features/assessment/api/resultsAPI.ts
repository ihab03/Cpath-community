import { axiosInstance } from '../../../lib/axios';
import type { AlternativeCareer ,CareerMatchDetails,AssessmentResponse } from '../types/results';


export const getAssessmentResult = async (id: string): Promise<AssessmentResponse> => {
  const response = await axiosInstance.get<AssessmentResponse>(`/Assessments/${id}`);
  return response.data;
};