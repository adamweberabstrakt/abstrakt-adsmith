// Form input types
export interface BusinessContextInputs {
  companyName: string;
  industry: string;
  averageDealSize: number | null;
  salesCycleLength: string;
  geographicFocus: 'local' | 'regional' | 'national' | 'international';
  // New fields
  websiteUrl: string;
  competitorUrls: string[];
  customAdAngle?: string;
}

export interface MarketingStateInputs {
  monthlySeoBudget: number | null;
  monthlyPaidMediaBudget: number | null;
  primaryGoal: 'leads' | 'pipeline' | 'brand' | 'all';
  declineExperienced: 'traffic' | 'leads' | 'both' | 'none';
}

export interface BrandMaturityInputs {
  brandRecognition: 'low' | 'moderate' | 'strong';
  existingBrandedSearch: 'yes' | 'no' | 'unknown';
  competitorAwareness: 'low' | 'moderate' | 'high';
}

export interface FormData {
  businessContext: BusinessContextInputs;
  marketingState: MarketingStateInputs;
  brandMaturity: BrandMaturityInputs;
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

// Analysis result types
export type BrandMaturityTier = 'emerging' | 'developing' | 'established' | 'dominant';

export interface BrandGapAnalysis {
  tier: BrandMaturityTier;
  score: number;
  brandDemandGap: string;
  aiSearchConstraints: string[];
  paidMediaPotential: string;
}

// Updated platform structure
export type PlatformType = 'google-ads' | 'ott-ads' | 'linkedin' | 'meta';

export interface PlatformRecommendation {
  platform: PlatformType;
  displayName: string;
  budget: number;
  channels: string[];
}

export interface BudgetRecommendation {
  type: 'existing' | 'new';
  conservative: {
    total: number;
    displayTotal: string; // e.g., "$1,500"
    platforms: PlatformRecommendation[];
    summary: string; // e.g., "LinkedIn Ads - $1,500"
  };
  aggressive: {
    total: number;
    displayTotal: string; // e.g., "$4,000+"
    platforms: PlatformRecommendation[];
    summary: string; // e.g., "LinkedIn Ads + Google Ads + OTT - $4,000+"
  };
  minimumViable?: number;
  warningThreshold?: number;
  rationale: string;
}

export interface AdAngle {
  type: 'problem-aware' | 'brand-authority' | 'ai-search-capture' | 'social-proof' | 'differentiation';
  headline: string;
  subheadline: string;
  valueProposition: string;
  ctaText: string;
  targetFunnelStage: 'awareness' | 'consideration' | 'decision';
}

export interface MessagingRecommendation {
  adAngles: AdAngle[];
  toneGuidance: string;
  keyDifferentiators: string[];
}

// Competitor analysis from SEMRush
export interface CompetitorInsight {
  domain: string;
  estimatedMonthlySpend?: number;
  keywordCount?: number;
  avgCpc?: number;
  topKeywords?: string[];
}

export interface AnalysisResult {
  brandGapAnalysis: BrandGapAnalysis;
  budgetRecommendation: BudgetRecommendation;
  messagingRecommendation: MessagingRecommendation;
  executiveSummary: string;
  nextSteps: string[];
  competitorInsights?: CompetitorInsight[];
  semrushDisclaimer?: string;
}

// Form step configuration
export interface FormStep {
  id: string;
  title: string;
  description: string;
  fields: string[];
}

export const FORM_STEPS: FormStep[] = [
  {
    id: 'business-context',
    title: 'Business Context',
    description: 'Tell us about your business fundamentals',
    fields: ['companyName', 'websiteUrl', 'industry', 'averageDealSize', 'salesCycleLength', 'geographicFocus', 'competitorUrls', 'customAdAngle'],
  },
  {
    id: 'marketing-state',
    title: 'Current Marketing State',
    description: 'Where are you today with marketing spend?',
    fields: ['monthlySeoBudget', 'monthlyPaidMediaBudget', 'primaryGoal', 'declineExperienced'],
  },
  {
    id: 'brand-maturity',
    title: 'Brand Maturity',
    description: 'How established is your brand in the market?',
    fields: ['brandRecognition', 'existingBrandedSearch', 'competitorAwareness'],
  },
];

// Industry options
export const INDUSTRIES = [
  'B2B SaaS',
  'Professional Services',
  'Manufacturing',
  'Healthcare & Medical',
  'Financial Services',
  'Technology',
  'Legal Services',
  'Construction & Trades',
  'Education & Training',
  'Real Estate',
  'Logistics & Supply Chain',
  'Energy & Utilities',
  'Other',
] as const;

// Sales cycle options
export const SALES_CYCLES = [
  { value: 'short', label: 'Short (< 30 days)' },
  { value: 'medium', label: 'Medium (1-3 months)' },
  { value: 'long', label: 'Long (3-6 months)' },
  { value: 'enterprise', label: 'Enterprise (6+ months)' },
] as const;

// Geographic focus options
export const GEOGRAPHIC_OPTIONS = [
  { value: 'local', label: 'Local (single city/metro)' },
  { value: 'regional', label: 'Regional (multi-state)' },
  { value: 'national', label: 'National (US-wide)' },
  { value: 'international', label: 'International' },
] as const;

// Goal options
export const GOAL_OPTIONS = [
  { value: 'leads', label: 'Lead Generation' },
  { value: 'pipeline', label: 'Pipeline Growth' },
  { value: 'brand', label: 'Brand Awareness' },
  { value: 'all', label: 'All of the Above' },
] as const;

// Decline options
export const DECLINE_OPTIONS = [
  { value: 'traffic', label: 'Organic traffic decline' },
  { value: 'leads', label: 'Lead volume decline' },
  { value: 'both', label: 'Both traffic and leads declining' },
  { value: 'none', label: 'No significant decline' },
] as const;

// Brand recognition options
export const BRAND_RECOGNITION_OPTIONS = [
  { value: 'low', label: 'Low (Few know us outside existing customers)' },
  { value: 'moderate', label: 'Moderate (Some industry recognition)' },
  { value: 'strong', label: 'Strong (Well-known in our space)' },
] as const;

// Platform definitions
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

// Lead capture form with attribution
export interface LeadCaptureData {
  email: string;
  companySize?: string;
  role?: string;
  wantsCall: boolean;
  attribution?: AttributionData;
}

// Zapier webhook payload
export interface ZapierPayload {
  timestamp: string;
  email: string;
  companyName: string;
  companySize?: string;
  role?: string;
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
