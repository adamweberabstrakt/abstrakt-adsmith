'use client';

import { useState, useCallback } from 'react';
import { BrandHeader } from '@/components/Logo';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { BusinessContextForm } from '@/components/BusinessContextForm';
import { MarketingStateForm } from '@/components/MarketingStateForm';
import { BrandMaturityForm } from '@/components/BrandMaturityForm';
import { LeadCaptureForm } from '@/components/LeadCaptureForm';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { 
  FormData, 
  BusinessContextInputs, 
  MarketingStateInputs, 
  BrandMaturityInputs,
  AnalysisResult,
  LeadCaptureData,
  FORM_STEPS 
} from '@/lib/types';

type AppState = 'form' | 'lead-capture' | 'loading' | 'results';

const initialBusinessContext: BusinessContextInputs = {
  companyName: '',
  industry: '',
  averageDealSize: null,
  salesCycleLength: '',
  geographicFocus: 'national',
};

const initialMarketingState: MarketingStateInputs = {
  monthlySeoBudget: null,
  monthlyPaidMediaBudget: null,
  primaryGoal: 'leads',
  declineExperienced: 'none',
};

const initialBrandMaturity: BrandMaturityInputs = {
  brandRecognition: 'moderate',
  existingBrandedSearch: 'unknown',
  competitorAwareness: 'moderate',
};

export default function Home() {
  const [appState, setAppState] = useState<AppState>('form');
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    businessContext: initialBusinessContext,
    marketingState: initialMarketingState,
    brandMaturity: initialBrandMaturity,
  });
  
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const updateBusinessContext = useCallback((updates: Partial<BusinessContextInputs>) => {
    setFormData(prev => ({
      ...prev,
      businessContext: { ...prev.businessContext, ...updates }
    }));
  }, []);

  const updateMarketingState = useCallback((updates: Partial<MarketingStateInputs>) => {
    setFormData(prev => ({
      ...prev,
      marketingState: { ...prev.marketingState, ...updates }
    }));
  }, []);

  const updateBrandMaturity = useCallback((updates: Partial<BrandMaturityInputs>) => {
    setFormData(prev => ({
      ...prev,
      brandMaturity: { ...prev.brandMaturity, ...updates }
    }));
  }, []);

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!(formData.businessContext.companyName && formData.businessContext.industry);
      case 1:
        return true; // Marketing state is optional
      case 2:
        return true; // Brand maturity has defaults
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Last step - move to lead capture
      setAppState('lead-capture');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleLeadSubmit = async (leadData: LeadCaptureData) => {
    setIsLoading(true);
    setError(null);
    setAppState('loading');

    try {
      // Call analysis API
      const analysisResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const analysis: AnalysisResult = await analysisResponse.json();
      setAnalysisResult(analysis);

      // Send email report
      try {
        await fetch('/api/generate-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ formData, analysis, leadData }),
        });
      } catch (emailError) {
        console.error('Email send failed:', emailError);
        // Don't fail the whole flow if email fails
      }

      setAppState('results');
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setAppState('lead-capture');
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BusinessContextForm
            data={formData.businessContext}
            onChange={updateBusinessContext}
          />
        );
      case 1:
        return (
          <MarketingStateForm
            data={formData.marketingState}
            onChange={updateMarketingState}
          />
        );
      case 2:
        return (
          <BrandMaturityForm
            data={formData.brandMaturity}
            onChange={updateBrandMaturity}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen pb-16">
      <BrandHeader />
      
      <div className="max-w-4xl mx-auto px-4">
        {appState === 'form' && (
          <>
            <ProgressIndicator currentStep={currentStep} />
            
            <div className="mb-8">
              <h2 className="text-xl font-heading font-semibold text-white mb-2">
                {FORM_STEPS[currentStep]?.title}
              </h2>
              <p className="text-abstrakt-text-muted">
                {FORM_STEPS[currentStep]?.description}
              </p>
            </div>

            {renderFormStep()}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-abstrakt-card-border">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`
                  abstrakt-button-outline
                  ${currentStep === 0 ? 'opacity-30 cursor-not-allowed' : ''}
                `}
              >
                ← Back
              </button>
              
              <button
                onClick={handleNext}
                disabled={!isStepValid(currentStep)}
                className={`
                  abstrakt-button
                  ${!isStepValid(currentStep) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {currentStep === FORM_STEPS.length - 1 ? 'Get My Analysis →' : 'Continue →'}
              </button>
            </div>
          </>
        )}

        {appState === 'lead-capture' && (
          <>
            {error && (
              <div className="mb-6 p-4 bg-abstrakt-error/20 border border-abstrakt-error rounded-lg text-abstrakt-error">
                {error}
              </div>
            )}
            <LeadCaptureForm onSubmit={handleLeadSubmit} isLoading={isLoading} />
            <button
              onClick={() => setAppState('form')}
              className="mt-6 w-full text-center text-abstrakt-text-muted hover:text-abstrakt-orange transition-colors"
            >
              ← Back to edit answers
            </button>
          </>
        )}

        {appState === 'loading' && (
          <div className="text-center py-16">
            <div className="spinner w-16 h-16 mx-auto mb-6" />
            <h2 className="text-2xl font-heading font-bold text-white mb-3">
              Analyzing Your Brand Lift Potential
            </h2>
            <p className="text-abstrakt-text-muted max-w-md mx-auto">
              Our AI is evaluating your brand maturity, calculating optimal budget allocations, 
              and generating personalized ad recommendations...
            </p>
          </div>
        )}

        {appState === 'results' && analysisResult && (
          <ResultsDisplay analysis={analysisResult} formData={formData} />
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-abstrakt-card-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-abstrakt-orange font-heading font-bold tracking-wider mb-2">
            ABSTRAKT MARKETING GROUP
          </p>
          <p className="text-abstrakt-text-dim text-sm">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
