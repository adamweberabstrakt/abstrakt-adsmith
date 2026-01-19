import { FormData, AnalysisResult, BrandMaturityTier, PlatformRecommendation, KeywordCPC, CompetitorBudgetEstimate } from './types';

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

// Calculate budget recommendations based on tier, inputs, and existing PPC budget
export function calculateBudgetRecommendation(tier: BrandMaturityTier, formData: FormData) {
  const existingPpcBudget = formData.marketingState.monthlyPaidMediaBudget || 0;
  
  // Check if user has existing PPC budget > $5,000
  if (existingPpcBudget > 5000) {
    return calculateBudgetFromExisting(existingPpcBudget, formData);
  }
  
  // Default logic for new advertisers or budgets <= $5,000
  const conservativeBudget = getConservativeBudget(tier);
  const conservativePlatform = getRecommendedSinglePlatform(formData);
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

// New function: Calculate budget based on existing PPC spend > $5k
function calculateBudgetFromExisting(existingBudget: number, formData: FormData) {
  // Conservative: Up to 25% LOWER than current budget
  const conservativeReduction = 0.25;
  const conservativeBudget = Math.round(existingBudget * (1 - conservativeReduction));
  
  // Aggressive: Up to 50% HIGHER than current budget
  const aggressiveIncrease = 0.50;
  const aggressiveBudget = Math.round(existingBudget * (1 + aggressiveIncrease));
  
  const conservativePlatform = getRecommendedSinglePlatform(formData);
  const aggressivePlatforms = getRecommendedMultiPlatforms(formData, 'established');

  return {
    conservative: {
      total: conservativeBudget,
      displayTotal: `$${conservativeBudget.toLocaleString()}`,
      platforms: [conservativePlatform],
      summary: `Optimized spend: ${conservativePlatform.displayName} - $${conservativeBudget.toLocaleString()}`,
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
  // Must be at least 25% higher than conservative
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

  // Ensure it's at least 25% higher
  return Math.max(minAggressive, baseBudget);
}

function getRecommendedSinglePlatform(formData: FormData): PlatformRecommendation {
  const { industry, primaryGoal } = {
    industry: formData.businessContext.industry,
    primaryGoal: formData.marketingState.primaryGoal
  };

  // B2B industries → LinkedIn
  const b2bIndustries = ['B2B SaaS', 'Professional Services', 'Technology', 'Financial Services', 'Finance', 'Accounting', 'Insurance', 'Managed Services (IT)'];
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

  const b2bIndustries = ['B2B SaaS', 'Professional Services', 'Technology', 'Financial Services', 'Finance', 'Accounting', 'Insurance', 'Managed Services (IT)'];
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

  // Check if competitor URLs were provided
  const hasCompetitors = businessContext.competitorUrls?.filter(u => u.trim()).length > 0;
  const competitorSection = hasCompetitors
    ? `- Competitors: ${businessContext.competitorUrls.filter(u => u.trim()).join(', ')}`
    : '';

  return `You are an expert B2B marketing strategist specializing in paid media and AI search visibility. Analyze the following business and provide strategic recommendations.

## Business Context
- Company: ${businessContext.companyName}
- Website: ${businessContext.websiteUrl}
- Industry: ${businessContext.industry}
- Average Deal Size: ${businessContext.averageDealSize ? `$${businessContext.averageDealSize.toLocaleString()}` : 'Not specified'}
- Sales Cycle: ${businessContext.salesCycleLength || 'Not specified'}
- Geographic Focus: ${businessContext.geographicFocus}
${competitorSection}
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
  "topKeywords": [
    {
      "keyword": "<relevant keyword for this industry/business>",
      "avgCpc": "<estimated CPC like $2.50>",
      "searchVolume": "<monthly volume like 1,200>",
      "competition": "low|medium|high"
    }
  ],
  ${hasCompetitors ? `"competitorEstimates": [
    {
      "domain": "<competitor domain>",
      "estimatedMonthlySpend": "<estimated monthly ad spend like $5,000-$10,000>",
      "confidence": "low|medium|high"
    }
  ],` : ''}
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
7. For topKeywords, provide exactly 5 keywords relevant to this ${businessContext.industry} business with realistic CPC estimates based on industry benchmarks
${hasCompetitors ? '8. For competitorEstimates, analyze each provided competitor URL and estimate their monthly paid media spend based on typical industry benchmarks and their apparent market position' : ''}

Respond with ONLY the JSON object, no additional text.`;
}

// Build prompt for regenerating just messaging/ad angles
export function buildRegenerateMessagingPrompt(formData: FormData, existingAngles: string[]): string {
  const { businessContext } = formData;

  return `You are an expert B2B marketing strategist. Generate 3 NEW ad angles for the following business. These should be DIFFERENT from the previously generated angles.

## Business Context
- Company: ${businessContext.companyName}
- Industry: ${businessContext.industry}
- Website: ${businessContext.websiteUrl}
${businessContext.customAdAngle ? `- Unique Value Proposition: ${businessContext.customAdAngle}` : ''}

## Previously Generated Headlines (DO NOT REPEAT THESE):
${existingAngles.map((a, i) => `${i + 1}. ${a}`).join('\n')}

Generate 3 completely new ad angles in this JSON format:

{
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
}

IMPORTANT:
- Create FRESH angles with different approaches than the previous ones
- Use different headline styles and messaging angles
- Vary the funnel stages targeted
- Make headlines compelling and specific to ${businessContext.industry}

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

  // Calculate budget recommendations based on the tier and existing PPC budget
  const budgetRecommendation = calculateBudgetRecommendation(
    parsed.brandGapAnalysis.tier,
    formData
  );

  // Extract competitor estimates and keywords from parsed response
  const competitorEstimates: CompetitorBudgetEstimate[] | undefined = parsed.competitorEstimates;
  const topKeywords: KeywordCPC[] | undefined = parsed.topKeywords;

  // Check if using existing budget logic
  const existingPpcBudget = formData.marketingState.monthlyPaidMediaBudget || 0;
  const usingExistingBudget = existingPpcBudget > 5000;

  return {
    ...parsed,
    budgetRecommendation: {
      type: formData.marketingState.monthlyPaidMediaBudget ? 'existing' : 'new',
      ...budgetRecommendation,
      rationale: generateBudgetRationale(parsed.brandGapAnalysis.tier, formData, usingExistingBudget),
      competitorEstimates,
      topKeywords,
    },
    semrushDisclaimer: 'Budget and CPC estimates are AI-generated based on industry benchmarks. Actual values may vary.',
  };
}

// Parse regenerated messaging response
export function parseRegenerateMessagingResponse(response: string): {
  adAngles: AnalysisResult['messagingRecommendation']['adAngles'];
  toneGuidance: string;
  keyDifferentiators: string[];
} {
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

  return JSON.parse(cleanResponse);
}

function generateBudgetRationale(tier: BrandMaturityTier, formData: FormData, usingExistingBudget: boolean): string {
  const { industry } = { industry: formData.businessContext.industry };

  if (usingExistingBudget) {
    const existingBudget = formData.marketingState.monthlyPaidMediaBudget || 0;
    return `Based on your current paid media investment of $${existingBudget.toLocaleString()}/month, we've calculated optimized budget recommendations. The conservative option allows for efficiency improvements with up to 25% savings, while the aggressive option expands reach with up to 50% additional investment across multiple platforms for accelerated brand visibility.`;
  }

  const tierDescriptions: Record<BrandMaturityTier, string> = {
    emerging: 'an emerging brand with significant growth opportunity',
    developing: 'a developing brand building market presence',
    established: 'an established brand ready for expansion',
    dominant: 'a dominant brand optimizing market position',
  };

  return `Based on your position as ${tierDescriptions[tier]} in the ${industry} industry, we recommend starting with a focused single-platform approach (conservative) to validate messaging and targeting. The aggressive option adds multi-platform reach to accelerate brand awareness and capture demand across the buyer journey.`;
}
