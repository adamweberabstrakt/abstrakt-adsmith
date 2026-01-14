import { FormData, AnalysisResult, BrandMaturityTier, PlatformRecommendation } from './types';

// Platform definitions for budget recommendations
const PLATFORM_CONFIG = {
  'google-ads': {
    displayName: 'Google Ads',
    channels: ['PMAX', 'Search', 'Demand Gen', 'Video', 'Display'],
    minBudget: 1000,
  },
  'ott-ads': {
    displayName: 'OTT Ads',
    channels: ['Display', 'Online Video', 'Streaming CTV', 'Streaming Audio', 'Native'],
    minBudget: 1500,
  },
  'linkedin': {
    displayName: 'LinkedIn',
    channels: ['LinkedIn Ads'],
    minBudget: 1000,
  },
  'meta': {
    displayName: 'Meta',
    channels: ['Facebook & Instagram Ads'],
    minBudget: 800,
  },
} as const;

// Calculate budget recommendations based on tier and inputs
export function calculateBudgetRecommendation(tier: BrandMaturityTier, formData: FormData) {
  // Conservative: Always $1,000-$2,500, single platform
  const conservativeBudget = getConservativeBudget(tier);
  const conservativePlatform = getRecommendedSinglePlatform(formData);
  
  // Aggressive: Multi-platform, $X,000+ format, max $5,000+
  const aggressiveBudget = getAggressiveBudget(tier, conservativeBudget);
  const aggressivePlatforms = getRecommendedMultiPlatforms(formData, tier);
  
  return {
    conservative: {
      total: conservativeBudget,
      displayTotal: `$${conservativeBudget.toLocaleString()}`,
      platforms: [conservativePlatform],
      summary: `${conservativePlatform.displayName} - $${conservativeBudget.toLocaleString()}`,
    },
    aggressive: {
      total: aggressiveBudget,
      displayTotal: `$${aggressiveBudget.toLocaleString()}+`,
      platforms: aggressivePlatforms,
      summary: formatAggressiveSummary(aggressivePlatforms, aggressiveBudget),
    },
  };
}

function getConservativeBudget(tier: BrandMaturityTier): number {
  // Fixed range: $1,000 - $2,500
  switch (tier) {
    case 'emerging':
      return 1000;
    case 'developing':
      return 1500;
    case 'established':
      return 2000;
    case 'dominant':
      return 2500;
    default:
      return 1500;
  }
}

function getAggressiveBudget(tier: BrandMaturityTier, conservativeBudget: number): number {
  // Must be at least 25% higher than conservative, max $5,000
  const minAggressive = Math.ceil(conservativeBudget * 1.35); // 35% higher to ensure > 25%
  
  let baseBudget: number;
  switch (tier) {
    case 'emerging':
      baseBudget = 2500;
      break;
    case 'developing':
      baseBudget = 3500;
      break;
    case 'established':
      baseBudget = 4500;
      break;
    case 'dominant':
      baseBudget = 5000;
      break;
    default:
      baseBudget = 3500;
  }
  
  // Ensure it's at least 25% higher and cap at $5,000
  const finalBudget = Math.max(minAggressive, baseBudget);
  return Math.min(finalBudget, 5000);
}

function getRecommendedSinglePlatform(formData: FormData): PlatformRecommendation {
  const { industry, primaryGoal } = { 
    industry: formData.businessContext.industry,
    primaryGoal: formData.marketingState.primaryGoal 
  };
  
  // B2B industries → LinkedIn
  const b2bIndustries = ['B2B SaaS', 'Professional Services', 'Technology', 'Financial Services'];
  if (b2bIndustries.includes(industry)) {
    return {
      platform: 'linkedin',
      displayName: 'LinkedIn Ads',
      budget: 1500,
      channels: ['LinkedIn Ads'],
    };
  }
  
  // Lead generation focus → Google Ads
  if (primaryGoal === 'leads' || primaryGoal === 'pipeline') {
    return {
      platform: 'google-ads',
      displayName: 'Google Ads',
      budget: 1500,
      channels: ['Search', 'PMAX'],
    };
  }
  
  // Brand awareness → OTT
  if (primaryGoal === 'brand') {
    return {
      platform: 'ott-ads',
      displayName: 'OTT Ads',
      budget: 1500,
      channels: ['Streaming CTV', 'Online Video'],
    };
  }
  
  // Default to Google Ads
  return {
    platform: 'google-ads',
    displayName: 'Google Ads',
    budget: 1500,
    channels: ['Search', 'PMAX'],
  };
}

function getRecommendedMultiPlatforms(formData: FormData, tier: BrandMaturityTier): PlatformRecommendation[] {
  const platforms: PlatformRecommendation[] = [];
  const { industry, primaryGoal } = { 
    industry: formData.businessContext.industry,
    primaryGoal: formData.marketingState.primaryGoal 
  };
  
  const b2bIndustries = ['B2B SaaS', 'Professional Services', 'Technology', 'Financial Services'];
  const isB2B = b2bIndustries.includes(industry);
  
  // Always include Google Ads for aggressive
  platforms.push({
    platform: 'google-ads',
    displayName: 'Google Ads',
    budget: 1500,
    channels: ['Search', 'PMAX', 'Demand Gen'],
  });
  
  // Add LinkedIn for B2B
  if (isB2B) {
    platforms.push({
      platform: 'linkedin',
      displayName: 'LinkedIn',
      budget: 1500,
      channels: ['LinkedIn Ads'],
    });
  }
  
  // Add OTT for brand awareness or established+ tiers
  if (primaryGoal === 'brand' || tier === 'established' || tier === 'dominant') {
    platforms.push({
      platform: 'ott-ads',
      displayName: 'OTT',
      budget: 1500,
      channels: ['Streaming CTV', 'Online Video'],
    });
  }
  
  // Add Meta for consumer-facing or "all" goals
  if (!isB2B || primaryGoal === 'all') {
    platforms.push({
      platform: 'meta',
      displayName: 'Meta',
      budget: 1000,
      channels: ['Facebook & Instagram Ads'],
    });
  }
  
  return platforms;
}

function formatAggressiveSummary(platforms: PlatformRecommendation[], totalBudget: number): string {
  const platformNames = platforms.map(p => p.displayName);
  
  if (platformNames.length === 1) {
    return `${platformNames[0]} - $${totalBudget.toLocaleString()}+`;
  }
  
  if (platformNames.length === 2) {
    return `${platformNames.join(' + ')} - $${totalBudget.toLocaleString()}+`;
  }
  
  // 3+ platforms: "Platform1 + Platform2 + Platform3 - $X,000+"
  return `${platformNames.join(' + ')} - $${totalBudget.toLocaleString()}+`;
}

// Build the Claude analysis prompt
export function buildAnalysisPrompt(formData: FormData): string {
  const { businessContext, marketingState, brandMaturity } = formData;
  
  return `You are an expert B2B marketing strategist specializing in paid media and AI search visibility. Analyze the following business and provide strategic recommendations.

## Business Context
- Company: ${businessContext.companyName}
- Website: ${businessContext.websiteUrl}
- Industry: ${businessContext.industry}
- Average Deal Size: ${businessContext.averageDealSize ? `$${businessContext.averageDealSize.toLocaleString()}` : 'Not specified'}
- Sales Cycle: ${businessContext.salesCycleLength || 'Not specified'}
- Geographic Focus: ${businessContext.geographicFocus}
${businessContext.competitorUrls?.filter(u => u).length ? `- Competitors: ${businessContext.competitorUrls.filter(u => u).join(', ')}` : ''}
${businessContext.customAdAngle ? `- Unique Value Proposition: ${businessContext.customAdAngle}` : ''}

## Current Marketing State
- Monthly SEO Budget: ${marketingState.monthlySeoBudget ? `$${marketingState.monthlySeoBudget.toLocaleString()}` : 'None/Unknown'}
- Monthly Paid Media Budget: ${marketingState.monthlyPaidMediaBudget ? `$${marketingState.monthlyPaidMediaBudget.toLocaleString()}` : 'None/Unknown'}
- Primary Goal: ${marketingState.primaryGoal}
- Decline Experienced: ${marketingState.declineExperienced}

## Brand Maturity
- Brand Recognition: ${brandMaturity.brandRecognition}
- Existing Branded Search: ${brandMaturity.existingBrandedSearch}
- Competitor Awareness: ${brandMaturity.competitorAwareness}

Based on this information, provide a comprehensive analysis in the following JSON format:

{
  "brandGapAnalysis": {
    "tier": "emerging|developing|established|dominant",
    "score": <number 1-100>,
    "brandDemandGap": "<2-3 sentence analysis of the gap between brand awareness and market demand>",
    "aiSearchConstraints": ["<constraint 1>", "<constraint 2>", "<constraint 3>"],
    "paidMediaPotential": "<2-3 sentence analysis of paid media opportunity>"
  },
  "messagingRecommendation": {
    "adAngles": [
      {
        "type": "problem-aware|brand-authority|ai-search-capture|social-proof|differentiation",
        "headline": "<compelling headline under 60 characters>",
        "subheadline": "<supporting subheadline under 90 characters>",
        "valueProposition": "<1-2 sentence value prop>",
        "ctaText": "<call to action text>",
        "targetFunnelStage": "awareness|consideration|decision"
      }
    ],
    "toneGuidance": "<guidance on brand voice and messaging tone>",
    "keyDifferentiators": ["<differentiator 1>", "<differentiator 2>", "<differentiator 3>"]
  },
  "executiveSummary": "<3-4 sentence executive summary of the analysis and top recommendation>",
  "nextSteps": ["<actionable next step 1>", "<actionable next step 2>", "<actionable next step 3>", "<actionable next step 4>"]
}

IMPORTANT GUIDELINES:
1. Provide exactly 3 ad angles with different types
2. Make headlines compelling and specific to the industry
3. Consider the custom value proposition if provided when crafting messaging
4. Base tier assessment on: brand recognition (40%), existing branded search (30%), competitor awareness (30%)
5. AI search constraints should focus on how AI platforms like ChatGPT and Perplexity evaluate brand authority
6. Next steps should be specific, actionable, and prioritized

Respond with ONLY the JSON object, no additional text.`;
}

// Parse and enhance the Claude response with budget calculations
export function parseAnalysisResponse(response: string, formData: FormData): AnalysisResult {
  // Clean up the response - remove markdown code blocks if present
  let cleanResponse = response.trim();
  if (cleanResponse.startsWith('```json')) {
    cleanResponse = cleanResponse.slice(7);
  }
  if (cleanResponse.startsWith('```')) {
    cleanResponse = cleanResponse.slice(3);
  }
  if (cleanResponse.endsWith('```')) {
    cleanResponse = cleanResponse.slice(0, -3);
  }
  
  const parsed = JSON.parse(cleanResponse);
  
  // Calculate budget recommendations based on the tier
  const budgetRecommendation = calculateBudgetRecommendation(
    parsed.brandGapAnalysis.tier,
    formData
  );
  
  return {
    ...parsed,
    budgetRecommendation: {
      type: formData.marketingState.monthlyPaidMediaBudget ? 'existing' : 'new',
      ...budgetRecommendation,
      rationale: generateBudgetRationale(parsed.brandGapAnalysis.tier, formData),
    },
    semrushDisclaimer: 'Budget estimates provided by SEMRush and may not be fully accurate.',
  };
}

function generateBudgetRationale(tier: BrandMaturityTier, formData: FormData): string {
  const { industry, primaryGoal } = { 
    industry: formData.businessContext.industry,
    primaryGoal: formData.marketingState.primaryGoal 
  };
  
  const tierDescriptions: Record<BrandMaturityTier, string> = {
    emerging: 'an emerging brand with significant growth opportunity',
    developing: 'a developing brand building market presence',
    established: 'an established brand ready for expansion',
    dominant: 'a dominant brand optimizing market position',
  };
  
  return `Based on your position as ${tierDescriptions[tier]} in the ${industry} industry, we recommend starting with a focused single-platform approach (conservative) to validate messaging and targeting. The aggressive option adds multi-platform reach to accelerate brand awareness and capture demand across the buyer journey.`;
}
