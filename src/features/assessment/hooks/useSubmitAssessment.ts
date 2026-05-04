import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { submitAssessment } from '../api/assessmentApi';
import { AxiosError } from 'axios';

export const useSubmitAssessment = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: submitAssessment,
    onSuccess: (data: any) => {
      // Extract the ID from the response: { assessmentId: "..." }
      const id = data.assessmentId;
      
      // Navigate to the results page using the ID
      if (id) {
        navigate(`/assessment/results/${id}`);
      }
    },
    onError: (error: AxiosError<any>) => {
      console.error("Submission failed:", error.response?.data || error.message);
    }
  });
};
