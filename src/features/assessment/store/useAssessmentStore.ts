import { create } from 'zustand';

interface AssessmentState {
  answers: Record<string, number>;
  setAnswer: (questionId: string, value: number) => void;
  resetAnswers: () => void;
  // A handy helper to see if they finished!
  isComplete: () => boolean; 
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  answers: {},
  
  setAnswer: (questionId, value) => 
    set((state) => ({ 
      answers: { ...state.answers, [questionId]: value } 
    })),
    
  resetAnswers: () => set({ answers: {} }),
  
  isComplete: () => Object.keys(get().answers).length >= 51,
}));