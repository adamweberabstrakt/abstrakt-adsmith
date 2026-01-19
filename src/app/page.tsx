'use client';

import { useState, useEffect, useRef } from 'react';
import { BrandHeader } from '@/components/Logo';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { BusinessContextForm } from '@/components/BusinessContextForm';
import { MarketingStateForm } from '@/components/MarketingStateForm';
import { BrandMaturityForm } from '@/components/BrandMaturityForm';
import { LeadCaptureForm } from '@/components/LeadCaptureForm';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { ChilipiperPopup } from '@/components/ChilipiperPopup';
import { FormData, AnalysisResult, LeadCaptureData, AttributionData, FORM_STEPS } from '@/lib/types';

type AppStep = 'form' | 'lead-capture' | 'analyzing' | 'results';

export default function Home() {
  const [currentFormStep, setCurrentFormStep] = useState(0);
  const [appStep, setAppStep] = useState<AppStep>('form');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [leadData, setLeadData] = useState<LeadCaptureData | null>(null);
  
  // Chilipiper popup state
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const popupTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasShownAutoPopup = useRef(false);

  // Attribution tracking state
  const [attribution, setAttribution] = useState<AttributionData>({});

  const [formData, setFormData] = useState<FormData>({
    businessContext: {
      companyName: '',
      industry: '',
      averageDealSize: null,
      salesCycleLength: '',
      geographicFocus: 'national',
      websiteUrl: '',
      competitorUrls: ['', '', ''],
      customAdAngle: '',
    },
    marketingState: {
      monthlySeoBudget: null,
      monthlyPaidMediaBudget: null,
      primaryGoal: 'leads',
      declineExperienced: 'none',
    },
    brandMaturity: {
      brandRecognition: 'moderate',
      existingBrandedSearch: 'unknown',
      competitorAwareness: 'moderate',
    },
  });

  // Capture UTM parameters and GCLID on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const attributionData: AttributionData = {};

      // Capture UTM parameters
      const utmSource = params.get('utm_source');
      const utmMedium = params.get('utm_medium');
      const utmCampaign = params.get('utm_campaign');
      const utmContent = params.get('utm_content');
      const utmTerm = params.get('utm_term');
      const gclid = params.get('gclid');

      if (utmSource) attributionData.utm_source = utmSource;
      if (utmMedium) attributionData.utm_medium = utmMedium;
      if (utmCampaign) attributionData.utm_campaign = utmCampaign;
      if (utmContent) attributionData.utm_content = utmContent;
      if (utmTerm) attributionData.utm_term = utmTerm;
      if (gclid) attributionData.gclid = gclid;

      setAttribution(attributionData);

      // Log for debugging (remove in production)
      if (Object.keys(attributionData).length > 0) {
        console.log('Attribution captured:', attributionData);
      }
    }
  }, []);

  // Auto-popup timer when results are shown - 45 seconds delay
  useEffect(() => {
    if (appStep === 'results' && !hasShownAutoPopup.current) {
      popupTimerRef.current = setTimeout(() => {
        setIsSchedulerOpen(true);
        hasShownAutoPopup.current = true;
      }, 45000); // 45 seconds
    }

    return () => {
      if (popupTimerRef.current) {
        clearTimeout(popupTimerRef.current);
      }
    };
  }, [appStep]);

  const updateFormData = (section: keyof FormData, data: Partial<FormData[keyof FormData]>) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));
  };

  const handleNext = () => {
    if (currentFormStep < FORM_STEPS.length - 1) {
      setCurrentFormStep(prev => prev + 1);
    } else {
      // Form complete, show lead capture
      setAppStep('lead-capture');
    }
  };

  const handleBack = () => {
    if (currentFormStep > 0) {
      setCurrentFormStep(prev => prev - 1);
    }
  };

  const handleLeadCapture = async (data: LeadCaptureData) => {
    // Add attribution to lead data
    const leadWithAttribution = {
      ...data,
      attribution,
    };
    
    setLeadData(leadWithAttribution);
    setAppStep('analyzing');
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          leadData: leadWithAttribution,
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      setAnalysisResult(result);

      // Send to Zapier webhook
      try {
        await fetch('/api/zapier', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            formData,
            leadData: leadWithAttribution,
            analysisResult: result,
          }),
        });
      } catch (zapierError) {
        console.error('Zapier webhook error:', zapierError);
        // Don't block results display if Zapier fails
      }

      setAppStep('results');
    } catch (error) {
      console.error('Analysis error:', error);
      // Handle error - show error state
      setAppStep('form');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRegenerateMessaging = async () => {
    if (!analysisResult) return;

    try {
      // Get existing headlines to avoid repeating
      const existingAngles = analysisResult.messagingRecommendation.adAngles.map(a => a.headline);

      const response = await fetch('/api/regenerate-messaging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          existingAngles,
        }),
      });

      if (!response.ok) {
        throw new Error('Regeneration failed');
      }

      const newMessaging = await response.json();

      // Update analysis result with new messaging
      setAnalysisResult(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          messagingRecommendation: {
            adAngles: newMessaging.adAngles,
            toneGuidance: newMessaging.toneGuidance,
            keyDifferentiators: newMessaging.keyDifferentiators,
          },
        };
      });
    } catch (error) {
      console.error('Regenerate messaging error:', error);
    }
  };

  const handleStartOver = () => {
    // Clear the auto-popup flag
    hasShownAutoPopup.current = false;
    
    // Clear popup timer
    if (popupTimerRef.current) {
      clearTimeout(popupTimerRef.current);
    }

    setCurrentFormStep(0);
    setAppStep('form');
    setAnalysisResult(null);
    setLeadData(null);
    setFormData({
      businessContext: {
        companyName: '',
        industry: '',
        averageDealSize: null,
        salesCycleLength: '',
        geographicFocus: 'national',
        websiteUrl: '',
        competitorUrls: ['', '', ''],
        customAdAngle: '',
      },
      marketingState: {
        monthlySeoBudget: null,
        monthlyPaidMediaBudget: null,
        primaryGoal: 'leads',
        declineExperienced: 'none',
      },
      brandMaturity: {
        brandRecognition: 'moderate',
        existingBrandedSearch: 'unknown',
        competitorAwareness: 'moderate',
      },
    });
  };

  const handleOpenScheduler = () => {
    // Cancel auto-popup timer if user manually opens
    if (popupTimerRef.current) {
      clearTimeout(popupTimerRef.current);
    }
    hasShownAutoPopup.current = true;
    setIsSchedulerOpen(true);
  };

  const canProceed = () => {
    const step = FORM_STEPS[currentFormStep];
    if (step.id === 'business-context') {
      return formData.businessContext.companyName.trim() !== '' &&
             formData.businessContext.industry !== '' &&
             formData.businessContext.websiteUrl.trim() !== '';
    }
    return true;
  };

  const renderFormStep = () => {
    switch (FORM_STEPS[currentFormStep].id) {
      case 'business-context':
        return (
          <BusinessContextForm
            data={formData.businessContext}
            onChange={(data) => updateFormData('businessContext', data)}
          />
        );
      case 'marketing-state':
        return (
          <MarketingStateForm
            data={formData.marketingState}
            onChange={(data) => updateFormData('marketingState', data)}
          />
        );
      case 'brand-maturity':
        return (
          <BrandMaturityForm
            data={formData.brandMaturity}
            onChange={(data) => updateFormData('brandMaturity', data)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen pb-12">
      <BrandHeader />
      
      <div className="max-w-4xl mx-auto px-4">
        {appStep === 'form' && (
          <>
            <ProgressIndicator
              currentStep={currentFormStep}
              totalSteps={FORM_STEPS.length}
              steps={FORM_STEPS}
            />
            
            <div className="mt-8">
              {renderFormStep()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                disabled={currentFormStep === 0}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${currentFormStep === 0
                  ? 'opacity-50 cursor-not-allowed text-abstrakt-text-dim'
                  : 'text-abstrakt-text-muted hover:text-white'
                }`}
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`abstrakt-button ${!canProceed() ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {currentFormStep === FORM_STEPS.length - 1 ? 'Get My Analysis' : 'Continue →'}
              </button>
            </div>
          </>
        )}

        {appStep === 'lead-capture' && (
          <LeadCaptureForm
            onSubmit={handleLeadCapture}
            companyName={formData.businessContext.companyName}
          />
        )}

        {appStep === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="spinner mb-6" />
            <h2 className="text-2xl font-heading font-bold text-white mb-2">
              Analyzing Your Brand Position
            </h2>
            <p className="text-abstrakt-text-muted text-center max-w-md">
              Our AI is evaluating your business context, market position, and generating personalized recommendations...
            </p>
          </div>
        )}

        {appStep === 'results' && analysisResult && (
          <ResultsDisplay
            result={analysisResult}
            formData={formData}
            onStartOver={handleStartOver}
            onRegenerateMessaging={handleRegenerateMessaging}
            onOpenScheduler={handleOpenScheduler}
          />
        )}
      </div>

      {/* Chilipiper Popup */}
      <ChilipiperPopup
        isOpen={isSchedulerOpen}
        onClose={() => setIsSchedulerOpen(false)}
      />
    </main>
  );
}
