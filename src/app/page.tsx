'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { BrandHeader } from '@/components/Logo';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { BusinessContextForm } from '@/components/BusinessContextForm';
import { MarketingStateForm } from '@/components/MarketingStateForm';
import { BrandMaturityForm } from '@/components/BrandMaturityForm';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { ChilipiperPopup } from '@/components/ChilipiperPopup';
import { IntroSection } from '@/components/IntroSection';
import { FormData, AnalysisResult, LeadCaptureData, AttributionData, FORM_STEPS } from '@/lib/types';

type AppStep = 'intro' | 'form' | 'analyzing' | 'results';

export default function Home() {
  const router = useRouter();
  const [currentFormStep, setCurrentFormStep] = useState(0);
  const [appStep, setAppStep] = useState<AppStep>('intro');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Shareable results
  const [shareableId, setShareableId] = useState<string | null>(null);
  
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
      competitorUrls: ['', ''],
      customAdAngle: '',
      // Lead capture fields
      email: '',
      name: '',
      companySize: '',
      role: '',
      wantsCall: true,
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
      }, 45000);
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

  const handleStartAssessment = () => {
    setAppStep('form');
  };

  // Construct leadData from businessContext for API compatibility
  const buildLeadData = (): LeadCaptureData => {
    return {
      email: formData.businessContext.email,
      companySize: formData.businessContext.companySize,
      role: formData.businessContext.role,
      wantsCall: formData.businessContext.wantsCall,
      attribution,
    };
  };

  const handleSubmitAnalysis = async () => {
    const leadData = buildLeadData();
    setAppStep('analyzing');
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, leadData }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      setAnalysisResult(result);

      // Save to KV for shareable link
      try {
        const saveResponse = await fetch('/api/results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ formData, leadData, analysisResult: result }),
        });

        if (saveResponse.ok) {
          const { id } = await saveResponse.json();
          setShareableId(id);
          window.history.replaceState({}, '', `/results/${id}`);
        }
      } catch (saveError) {
        console.error('Error saving shareable results:', saveError);
      }

      // Send to Zapier webhook
      try {
        await fetch('/api/zapier', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ formData, leadData, analysisResult: result }),
        });
      } catch (zapierError) {
        console.error('Zapier webhook error:', zapierError);
      }

      setAppStep('results');
    } catch (error) {
      console.error('Analysis error:', error);
      setAppStep('form');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNext = () => {
    if (currentFormStep < FORM_STEPS.length - 1) {
      setCurrentFormStep(prev => prev + 1);
    } else {
      // Last form step complete — go straight to analysis
      handleSubmitAnalysis();
    }
  };

  const handleBack = () => {
    if (currentFormStep > 0) {
      setCurrentFormStep(prev => prev - 1);
    } else {
      setAppStep('intro');
    }
  };

  const handleRegenerateMessaging = async () => {
    if (!analysisResult) return;

    try {
      const existingAngles = analysisResult.messagingRecommendation.adAngles.map(a => a.headline);

      const response = await fetch('/api/regenerate-messaging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, existingAngles }),
      });

      if (!response.ok) {
        throw new Error('Regeneration failed');
      }

      const newMessaging = await response.json();

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
    hasShownAutoPopup.current = false;
    if (popupTimerRef.current) {
      clearTimeout(popupTimerRef.current);
    }

    window.history.replaceState({}, '', '/');
    setCurrentFormStep(0);
    setAppStep('intro');
    setAnalysisResult(null);
    setShareableId(null);
    setFormData({
      businessContext: {
        companyName: '',
        industry: '',
        averageDealSize: null,
        salesCycleLength: '',
        geographicFocus: 'national',
        websiteUrl: '',
        competitorUrls: ['', ''],
        customAdAngle: '',
        email: '',
        name: '',
        companySize: '',
        role: '',
        wantsCall: true,
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
    if (popupTimerRef.current) {
      clearTimeout(popupTimerRef.current);
    }
    hasShownAutoPopup.current = true;
    setIsSchedulerOpen(true);
  };

  const canProceed = () => {
    const step = FORM_STEPS[currentFormStep];
    if (step.id === 'business-context') {
      return (
        formData.businessContext.companyName.trim() !== '' &&
        formData.businessContext.websiteUrl.trim() !== '' &&
        formData.businessContext.email.trim() !== '' &&
        formData.businessContext.email.includes('@')
      );
    }
    if (step.id === 'marketing-state') {
      return (formData.businessContext.customAdAngle || '').trim() !== '';
    }
    // brand-maturity step: always can proceed
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
            data={formData.businessContext}
            onChange={(data) => updateFormData('businessContext', data)}
          />
        );
      case 'brand-maturity':
        return (
          <BrandMaturityForm
            marketingData={formData.marketingState}
            brandData={formData.brandMaturity}
            wantsCall={formData.businessContext.wantsCall}
            onMarketingChange={(data) => updateFormData('marketingState', data)}
            onBrandChange={(data) => updateFormData('brandMaturity', data)}
            onWantsCallChange={(wantsCall) => updateFormData('businessContext', { wantsCall })}
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
        {appStep === 'intro' && (
          <IntroSection onStartAssessment={handleStartAssessment} />
        )}

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
                className="px-6 py-3 rounded-lg font-semibold transition-all text-abstrakt-text-muted hover:text-white"
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

            {/* Privacy note on last step */}
            {currentFormStep === FORM_STEPS.length - 1 && (
              <p className="text-xs text-abstrakt-text-dim text-center mt-4">
                By submitting, you agree to receive marketing communications from Abstrakt Marketing Group. You can unsubscribe at any time.
              </p>
            )}
          </>
        )}

        {appStep === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="spinner mb-6" />
            <h2 className="text-2xl font-heading font-bold text-white mb-2">
              Analyzing Your Brand Position
            </h2>
            <p className="text-abstrakt-text-muted text-center max-w-md">
              Our AI is evaluating your business context, market position, and generating
              personalized recommendations...
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
            shareableId={shareableId}
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
