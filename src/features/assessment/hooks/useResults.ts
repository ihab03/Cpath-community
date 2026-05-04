import { useQuery } from '@tanstack/react-query';
import { getAssessmentResult } from '../api/resultsAPI';

export const useResults = (assessmentId?: string) => {
  return useQuery({
    queryKey: ['assessment', assessmentId],
    queryFn: () => getAssessmentResult(assessmentId!),
    enabled: !!assessmentId,
  });
};