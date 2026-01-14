// Form step definition
export interface FormStep {
  id: string;
  title: string;
  description: string;
}

export const FORM_STEPS: FormStep[] = [
  {
    id: 'business-context',
    title: 'Business Context',
    description: 'Tell us about your company',
  },
  {
    id: 'marketing-state',
    title: 'Marketing State',
    description: 'Current marketing investments',
  },
  {
    id: 'brand-maturity',
    title: 'Brand Maturity',
    description: 'Assess your brand strength',
  },
];

// Business Context
export interface BusinessContextData {
  companyName: string;
  industry: string;
  averageDealSize: number | null;
  salesCycleLength: string;
  geographicFocus: 'local' | 'regional' | 'national' | 'international';
  websiteUrl: string;
  competitorUrls: string[];
  customAdAngle?: string;
}

// Marketing State
export interface MarketingStateData {
  monthlySeoBudget: number | null;
  monthlyPaidMediaBudget: number | null;
  primaryGoal: 'leads' | 'pipeline' | 'brand' | 'all';
  declineExperienced: 'none' | 'slight' | 'moderate' | 'significant';
}

// Brand Maturity
export interface BrandMaturityData {
  brandRecognition: 'low' | 'moderate' | 'high' | 'dominant';
  existingBrandedSearch: 'none' | 'low' | 'moderate' | 'high' | 'unknown';
  competitorAwareness: 'low' | 'moderate' | 'high';
}

// Combined Form Data
export interface FormData {
  businessContext: BusinessContextData;
  marketingState: MarketingStateData;
  brandMaturity: BrandMaturityData;
}

// Attribution tracking
export interface AttributionData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
}

// Lead Capture
export interface LeadCaptureData {
  email: string;
  companySize: string;
  role: string;
  wantsCall: boolean;
  attribution?: AttributionData;
}

// Platform types
export type PlatformType = 'google-ads' | 'ott-ads' | 'linkedin' | 'meta';

export interface PlatformRecommendation {
  platform: PlatformType;
  displayName: string;
  budget: number;
  channels: string[];
}

// Budget Recommendation
export interface BudgetRecommendation {
  type: 'new' | 'existing';
  conservative: {
    total: number;
    displayTotal: string;
    platforms: PlatformRecommendation[];
    summary: string;
  };
  aggressive: {
    total: number;
    displayTotal: string;
    platforms: PlatformRecommendation[];
    summary: string;
  };
  rationale: string;
}

// Brand maturity tiers
export type BrandMaturityTier = 'emerging' | 'developing' | 'established' | 'dominant';

// Ad Angle
export interface AdAngle {
  type: 'problem-aware' | 'brand-authority' | 'ai-search-capture' | 'social-proof' | 'differentiation';
  headline: string;
  subheadline: string;
  valueProposition: string;
  ctaText: string;
  targetFunnelStage: 'awareness' | 'consideration' | 'decision';
}

// Messaging Recommendation
export interface MessagingRecommendation {
  adAngles: AdAngle[];
  toneGuidance: string;
  keyDifferentiators: string[];
}

// Brand Gap Analysis
export interface BrandGapAnalysis {
  tier: BrandMaturityTier;
  score: number;
  brandDemandGap: string;
  aiSearchConstraints: string[];
  paidMediaPotential: string;
}

// Complete Analysis Result
export interface AnalysisResult {
  brandGapAnalysis: BrandGapAnalysis;
  budgetRecommendation: BudgetRecommendation;
  messagingRecommendation: MessagingRecommendation;
  executiveSummary: string;
  nextSteps: string[];
  semrushDisclaimer?: string;
}

// Competitor Insight (for future SEMRush integration)
export interface CompetitorInsight {
  domain: string;
  monthlyAdSpend?: number;
  keywordCount?: number;
  avgCpc?: number;
}

// Zapier webhook payload
export interface ZapierPayload {
  timestamp: string;
  email: string;
  companyName: string;
  companySize: string;
  role: string;
  websiteUrl: string;
  competitorUrls: string[];
  industry: string;
  wantsCall: boolean;
  budgetRecommendation: {
    conservative: string;
    aggressive: string;
  };
  brandTier: BrandMaturityTier;
  attribution: AttributionData;
}

// Platform configuration
export const PLATFORMS = {
  'google-ads': {
    displayName: 'Google Ads',
    channels: ['PMAX', 'Search', 'Demand Gen', 'Video', 'Display'],
  },
  'ott-ads': {
    displayName: 'OTT Ads',
    channels: ['Display', 'Online Video', 'Streaming CTV', 'Streaming Audio', 'Native'],
  },
  'linkedin': {
    displayName: 'LinkedIn',
    channels: ['LinkedIn Ads'],
  },
  'meta': {
    displayName: 'Meta',
    channels: ['Facebook & Instagram Ads'],
  },
} as const;
