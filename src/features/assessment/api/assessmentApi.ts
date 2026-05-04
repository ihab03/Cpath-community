import { axiosInstance } from '../../../lib/axios';
import type {  SubmitAssessmentRequest } from '../types/assessment';


export const submitAssessment = async (data: SubmitAssessmentRequest): Promise<string> => {
  const response = await axiosInstance.post('/Assessments', data);
  return response.data; 
};