'use client';

import { FORM_STEPS } from '@/lib/types';

interface ProgressIndicatorProps {
  currentStep: number;
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const progress = ((currentStep + 1) / FORM_STEPS.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      {/* Step indicators */}
      <div className="flex justify-between mb-4">
        {FORM_STEPS.map((step, index) => (
          <div 
            key={step.id}
            className={`flex items-center ${index < FORM_STEPS.length - 1 ? 'flex-1' : ''}`}
          >
            <div className="flex flex-col items-center">
              <div 
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                  transition-all duration-300
                  ${index < currentStep 
                    ? 'bg-abstrakt-orange text-white' 
                    : index === currentStep 
                      ? 'bg-abstrakt-orange text-white animate-pulse-glow'
                      : 'bg-abstrakt-input border-2 border-abstrakt-input-border text-abstrakt-text-muted'
                  }
                `}
              >
                {index < currentStep ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span className={`
                mt-2 text-xs font-medium hidden md:block
                ${index <= currentStep ? 'text-abstrakt-orange' : 'text-abstrakt-text-dim'}
              `}>
                {step.title}
              </span>
            </div>
            {index < FORM_STEPS.length - 1 && (
              <div 
                className={`
                  flex-1 h-1 mx-2 rounded-full transition-all duration-500
                  ${index < currentStep ? 'bg-abstrakt-orange' : 'bg-abstrakt-input-border'}
                `}
              />
            )}
          </div>
        ))}
      </div>
      
      {/* Mobile step label */}
      <div className="md:hidden text-center">
        <span className="text-abstrakt-orange font-medium">
          Step {currentStep + 1}: {FORM_STEPS[currentStep]?.title}
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="progress-bar mt-4">
        <div 
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
