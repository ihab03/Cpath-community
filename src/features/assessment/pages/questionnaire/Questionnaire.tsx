import React, { useState } from 'react';
import { ProgressBar } from '../../components/Progress/ProgressBar';
import { PrevButton } from '../../components/PrevButton/PrevButton';
import { NextButton } from '../../components/NextButton/NextButton';
import { ASSESSMENT_QUESTIONS } from './questions.data';

// --- NEW HOOKS & UTILS ---
import { useAssessmentStore } from '../../store/useAssessmentStore';
import { useSubmitAssessment } from '../../hooks/useSubmitAssessment';
import { generateFinalVector } from '../../utils/scoring';

const OPTIONS = [
  { label: "Strongly Agree", value: 7 },
  { label: "Agree", value: 6 },
  { label: "Slightly Agree", value: 5 },
  { label: "Neutral", value: 4 },
  { label: "Slightly Disagree", value: 3 },
  { label: "Disagree", value: 2 },
  { label: "Strongly Disagree", value: 1 },
];

export const Questionnaire = () => {
  // 1. Local State for navigation
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // 2. Global State for memory (Zustand)
  const { answers, setAnswer } = useAssessmentStore();
  
  // 3. Server State for submission (React Query)
  const { mutate: submit, isPending: isSubmitting } = useSubmitAssessment();

  const currentQuestion = ASSESSMENT_QUESTIONS[currentIndex];
  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;

  // --- HANDLERS ---
  const handleSelect = (value: number) => {
    setAnswer(currentQuestion.id, value);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Process the answers into the 27-item AI vector before submitting
      const finalVector = generateFinalVector(answers);
      submit({ answers: finalVector }); 
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  // --- RENDER LOADING STATE ---
  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-[#222222] flex flex-col items-center justify-center text-white font-sans">
        <div className="w-12 h-12 border-4 border-[#D97706] border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-2xl font-light tracking-widest uppercase text-[#D97706]">Analyzing Profile</p>
      </div>
    );
  }

  // --- RENDER MAIN UI ---
  return (
    <div className="min-h-screen bg-[#222222] text-[#E5E5E5] flex flex-col relative overflow-x-hidden font-sans">
      
      {/* Header: Question Counter */}
      <header className="pt-12 md:pt-20 px-8 md:px-24 flex justify-end items-center z-20">
        <div className="text-xl md:text-2xl font-semibold text-white/90">
          Question {currentIndex + 1} / {totalQuestions}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 md:px-12 lg:px-24 z-20">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          <div className="text-center lg:text-left">
            <h2 className="text-2xl md:text-4xl font-medium leading-tight text-white">
              {currentQuestion.text}
            </h2>
          </div>

          <div className="flex flex-col gap-4 md:gap-6 w-full max-w-md mx-auto lg:mx-0">
            {OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-4 cursor-pointer group">
                <div className={`w-5 h-5 shrink-0 rounded-md border-2 flex items-center justify-center transition-all ${
                  answers[currentQuestion.id] === opt.value 
                  ? 'border-[#D97706] bg-[#D97706]' 
                  : 'border-gray-500 group-hover:border-gray-400'
                }`}>
                  {answers[currentQuestion.id] === opt.value && (
                    <div className="w-2 h-2 bg-white rounded-sm" />
                  )}
                </div>
                <input 
                  type="radio" 
                  className="hidden" 
                  onChange={() => handleSelect(opt.value)} 
                  checked={answers[currentQuestion.id] === opt.value} 
                />
                <span className="text-base md:text-lg text-gray-200 font-light group-hover:text-white transition-colors">
                  {opt.label}
                </span>
              </label>
            ))}

            <div className="flex items-center gap-4 mt-6 md:mt-10">
              <PrevButton 
                onClick={handlePrevious} 
                disabled={currentIndex === 0} 
              />
              <NextButton 
                onClick={handleNext} 
                disabled={!answers[currentQuestion.id]} 
                label={currentIndex === totalQuestions - 1 ? 'Finish' : 'Next'} 
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer: Fixed & Responsive Bottom Section */}
      <div className="relative w-full h-[200px] md:h-[280px] flex items-end overflow-hidden mt-auto">
        
        <div className="hidden lg:block absolute bottom-0 left-0 w-[45%] h-full pointer-events-none z-0">
          <div 
            className="absolute bottom-0 left-0 w-full h-full bg-black/40 blur-3xl translate-x-4"
            style={{ clipPath: 'polygon(0 45%, 100% 15%, 85% 100%, 0% 100%)' }} 
          />
          <div 
            className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-tr from-[#DC5F00] to-[#D97706]" 
            style={{ clipPath: 'polygon(0 45%, 100% 15%, 85% 100%, 0% 100%)' }} 
          />
        </div>

        <div className="relative z-10 w-full pb-10 md:pb-16 px-8 md:px-24 lg:pl-[48%] lg:pr-32">
          <ProgressBar progress={progressPercentage} />
        </div>
      </div>
    </div>
  );
};