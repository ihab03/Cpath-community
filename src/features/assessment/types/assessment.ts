
export interface Question {
  id: string;         
  text: string;       
  category: string;    
  isRiasec: boolean;  
}

export interface SubmitAssessmentRequest {
  answers: number[]; 
}