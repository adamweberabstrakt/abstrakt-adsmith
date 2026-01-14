'use client';

import { FormStep } from '@/lib/types';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: FormStep[];
}

export function ProgressIndicator({ currentStep, totalSteps, steps }: ProgressIndicatorProps) {
  return (
    <div className="w-full">
      {/* Step indicators */}
      <div className="flex justify-between mb-2">
        {steps.map((step, idx) => (
          <div 
            key={step.id}
            className={`flex-1 text-center ${idx < totalSteps - 1 ? 'relative' : ''}`}
          >
            <div className="flex flex-col items-center">
              <div 
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2
                  ${idx < currentStep 
                    ? 'bg-abstrakt-orange text-white' 
                    : idx === currentStep 
                      ? 'bg-abstrakt-orange text-white ring-4 ring-abstrakt-orange/30' 
                      : 'bg-abstrakt-input text-abstrakt-text-dim border border-abstrakt-input-border'
                  }
                `}
              >
                {idx < currentStep ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  idx + 1
                )}
              </div>
              <span className={`text-xs ${idx === currentStep ? 'text-white' : 'text-abstrakt-text-dim'}`}>
                {step.title}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Progress bar */}
      <div className="progress-bar mt-4">
        <div 
          className="progress-bar-fill transition-all duration-300"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}
