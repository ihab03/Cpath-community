import { ASSESSMENT_QUESTIONS } from '../pages/questionnaire/questions.data';

const FEATURE_ORDER = [
  'Artistic', 'Conventional', 'Enterprising', 'Investigative', 'Realistic', 'Social',
  'Achievement Orientation', 'Adaptability', 'Attention to Detail', 'Cautiousness',
  'Cooperation', 'Dependability', 'Empathy', 'Humility', 'Initiative',
  'Innovation', 'Integrity', 'Intellectual Curiosity', 'Leadership Orientation',
  'Optimism', 'Perseverance', 'Self-Confidence', 'Self-Control', 'Sincerity',
  'Social Orientation', 'Stress Tolerance', 'Tolerance for Ambiguity'
];

export const generateFinalVector = (answers: Record<string, number>): number[] => {
  return FEATURE_ORDER.map(feature => {
    const relatedQuestions = ASSESSMENT_QUESTIONS.filter(q => q.category === feature);
    // Default to 4 (Neutral) if a question was somehow skipped, though our UI prevents this
    const sum = relatedQuestions.reduce((acc, q) => acc + (answers[q.id] || 4), 0);
    const average = sum / relatedQuestions.length;
    return parseFloat(average.toFixed(2));
  });
};