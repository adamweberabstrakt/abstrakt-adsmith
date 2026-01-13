import { FormData, BrandMaturityTier } from './types';

export function buildAnalysisPrompt(data: FormData): string {
  const { businessContext, marketingState, brandMaturity } = data;
  
  return `You are an expert B2B marketing strategist specializing in the intersection of SEO, paid media, and AI Search visibility. Analyze the following business profile and provide strategic recommendations.

## Business Profile

**Company:** ${businessContext.companyName}
**Industry:** ${businessContext.industry}
**Average Deal Size:** ${businessContext.averageDealSize ? `$${businessContext.averageDealSize.toLocaleString()}` : 'Not specified'}
**Sales Cycle:** ${businessContext.salesCycleLength}
**Geographic Focus:** ${businessContext.geographicFocus}

## Current Marketing State

**Monthly SEO Spend:** ${marketingState.monthlySeoBudget ? `$${marketingState.monthlySeoBudget.toLocaleString()}` : 'Not specified'}
**Monthly Paid Media Spend:** ${marketingState.monthlyPaidMediaBudget ? `$${marketingState.monthlyPaidMediaBudget.toLocaleString()}` : 'None currently'}
**Primary Goal:** ${marketingState.primaryGoal}
**Decline Experienced:** ${marketingState.declineExperienced}

## Brand Maturity Signals

**Brand Recognition:** ${brandMaturity.brandRecognition}
**Existing Branded Search Volume:** ${brandMaturity.existingBrandedSearch}
**Competitor Awareness:** ${brandMaturity.competitorAwareness}

---

Provide a comprehensive analysis in the following JSON structure. Be specific, actionable, and grounded in the reality of AI Search dynamics (ChatGPT, Perplexity, Google AI Overviews, etc.):

{
  "brandGapAnalysis": {
    "tier": "emerging|developing|established|dominant",
    "score": <1-100>,
    "brandDemandGap": "<2-3 sentence explanation of the gap between current brand awareness and what's needed for AI Search visibility>",
    "aiSearchConstraints": ["<constraint 1>", "<constraint 2>", "<constraint 3>"],
    "paidMediaPotential": "<1-2 sentence assessment of how paid media can bridge this gap>"
  },
  "budgetRecommendation": {
    "type": "${marketingState.monthlyPaidMediaBudget && marketingState.monthlyPaidMediaBudget > 0 ? 'existing' : 'new'}",
    "conservative": {
      "total": <monthly spend>,
      "brandSearch": <allocation>,
      "nonBrandSearch": <allocation>,
      "linkedin": <allocation>,
      "youtube": <allocation>,
      "display": <allocation>
    },
    "aggressive": {
      "total": <monthly spend>,
      "brandSearch": <allocation>,
      "nonBrandSearch": <allocation>,
      "linkedin": <allocation>,
      "youtube": <allocation>,
      "display": <allocation>
    },
    ${marketingState.monthlyPaidMediaBudget && marketingState.monthlyPaidMediaBudget > 0 ? '' : '"minimumViable": <minimum monthly spend that could show results>,\n    "warningThreshold": <spend below which results are unlikely>,'}
    "rationale": "<2-3 sentences explaining the budget logic based on deal size, sales cycle, and brand maturity>"
  },
  "messagingRecommendation": {
    "adAngles": [
      {
        "type": "problem-aware|brand-authority|ai-search-capture|social-proof|differentiation",
        "headline": "<compelling headline under 60 chars>",
        "subheadline": "<supporting line under 90 chars>",
        "valueProposition": "<1 sentence value prop>",
        "ctaText": "<CTA button text>",
        "targetFunnelStage": "awareness|consideration|decision"
      }
    ],
    "toneGuidance": "<guidance on brand voice and messaging tone>",
    "keyDifferentiators": ["<differentiator 1>", "<differentiator 2>", "<differentiator 3>"]
  },
  "executiveSummary": "<3-4 sentence summary of the situation and core recommendation>",
  "nextSteps": ["<immediate action 1>", "<action 2>", "<action 3>"]
}

## Key Principles to Apply:

1. **AI Search Visibility Connection**: Explain how branded demand influences AI model training and citation likelihood. Don't say "SEO is dead" - frame it as "SEO outcomes are now influenced by branded demand."

2. **Brand Lift → Demand Capture Pipeline**: Show how paid media investments (especially YouTube, LinkedIn, and branded search) create the search demand that gets captured both in traditional and AI search.

3. **Budget Scaling**: 
   - For deal sizes under $10k: Start conservative, prove ROI quickly
   - For deal sizes $10k-$50k: Balanced approach with brand and demand capture
   - For deal sizes $50k+: Heavier brand investment, longer attribution windows

4. **Realistic Expectations**: Be honest about what budget levels can and cannot achieve. Don't over-promise.

5. **Ad Angles**: Generate 3-5 distinct messaging angles that avoid generic B2B clichés. Make them specific to the industry and situation.

Return ONLY the JSON object, no additional text.`;
}

export function calculateBrandTier(data: FormData): BrandMaturityTier {
  const { brandMaturity, marketingState } = data;
  
  let score = 0;
  
  // Brand recognition scoring
  if (brandMaturity.brandRecognition === 'strong') score += 35;
  else if (brandMaturity.brandRecognition === 'moderate') score += 20;
  else score += 5;
  
  // Branded search scoring
  if (brandMaturity.existingBrandedSearch === 'yes') score += 30;
  else if (brandMaturity.existingBrandedSearch === 'unknown') score += 10;
  
  // Competitor awareness scoring
  if (brandMaturity.competitorAwareness === 'high') score += 20;
  else if (brandMaturity.competitorAwareness === 'moderate') score += 12;
  else score += 5;
  
  // Existing paid media bonus
  if (marketingState.monthlyPaidMediaBudget && marketingState.monthlyPaidMediaBudget > 10000) {
    score += 15;
  } else if (marketingState.monthlyPaidMediaBudget && marketingState.monthlyPaidMediaBudget > 5000) {
    score += 10;
  }
  
  // Determine tier
  if (score >= 80) return 'dominant';
  if (score >= 55) return 'established';
  if (score >= 30) return 'developing';
  return 'emerging';
}

export function generateFallbackAnalysis(data: FormData): string {
  const tier = calculateBrandTier(data);
  const { businessContext, marketingState, brandMaturity } = data;
  
  const isExistingBuyer = marketingState.monthlyPaidMediaBudget && marketingState.monthlyPaidMediaBudget > 0;
  const baseBudget = isExistingBuyer 
    ? marketingState.monthlyPaidMediaBudget! 
    : Math.max(3000, (businessContext.averageDealSize || 10000) * 0.1);
  
  const conservativeTotal = Math.round(baseBudget * 1.2);
  const aggressiveTotal = Math.round(baseBudget * 2);
  
  return JSON.stringify({
    brandGapAnalysis: {
      tier,
      score: tier === 'dominant' ? 85 : tier === 'established' ? 65 : tier === 'developing' ? 45 : 25,
      brandDemandGap: `Your brand is currently in the ${tier} tier. ${
        tier === 'emerging' ? 'AI search engines have limited awareness of your brand, meaning you\'re unlikely to be cited in AI-generated responses.' :
        tier === 'developing' ? 'You have some brand signals, but not enough consistent presence to reliably appear in AI search results.' :
        tier === 'established' ? 'Your brand has good recognition, but there\'s room to strengthen AI search visibility through targeted brand campaigns.' :
        'Your brand has strong recognition and is well-positioned for AI search visibility.'
      }`,
      aiSearchConstraints: [
        tier === 'emerging' || tier === 'developing' ? 'Limited brand mention volume across the web' : 'Competition from well-funded alternatives',
        'Insufficient branded search demand signals',
        marketingState.declineExperienced !== 'none' ? 'Declining organic visibility reducing brand touchpoints' : 'Need for consistent brand presence across channels'
      ],
      paidMediaPotential: `Paid media can ${tier === 'emerging' ? 'establish' : tier === 'developing' ? 'accelerate' : 'reinforce'} brand recognition, creating the search demand that AI systems use as quality signals.`
    },
    budgetRecommendation: {
      type: isExistingBuyer ? 'existing' : 'new',
      conservative: {
        total: conservativeTotal,
        brandSearch: Math.round(conservativeTotal * 0.2),
        nonBrandSearch: Math.round(conservativeTotal * 0.3),
        linkedin: Math.round(conservativeTotal * 0.25),
        youtube: Math.round(conservativeTotal * 0.15),
        display: Math.round(conservativeTotal * 0.1)
      },
      aggressive: {
        total: aggressiveTotal,
        brandSearch: Math.round(aggressiveTotal * 0.15),
        nonBrandSearch: Math.round(aggressiveTotal * 0.25),
        linkedin: Math.round(aggressiveTotal * 0.3),
        youtube: Math.round(aggressiveTotal * 0.2),
        display: Math.round(aggressiveTotal * 0.1)
      },
      ...(isExistingBuyer ? {} : {
        minimumViable: Math.round(baseBudget * 0.8),
        warningThreshold: Math.round(baseBudget * 0.5)
      }),
      rationale: `Based on your ${businessContext.salesCycleLength} sales cycle and ${brandMaturity.brandRecognition} brand recognition, we recommend ${isExistingBuyer ? 'optimizing your current spend with more brand-focused allocation' : 'starting with a balanced approach that builds brand while capturing existing demand'}.`
    },
    messagingRecommendation: {
      adAngles: [
        {
          type: 'problem-aware',
          headline: `${businessContext.industry} Leaders Are Losing Visibility`,
          subheadline: 'AI search is changing how buyers find solutions. Are you being found?',
          valueProposition: `We help ${businessContext.industry.toLowerCase()} companies build the brand presence that AI search engines reward.`,
          ctaText: 'See How You Compare',
          targetFunnelStage: 'awareness'
        },
        {
          type: 'brand-authority',
          headline: `The ${businessContext.industry} Authority`,
          subheadline: 'Trusted by companies who demand results',
          valueProposition: 'Industry-leading expertise backed by proven outcomes.',
          ctaText: 'Learn Our Approach',
          targetFunnelStage: 'consideration'
        },
        {
          type: 'ai-search-capture',
          headline: 'Stop Losing Deals to AI Recommendations',
          subheadline: 'Your competitors are being cited. You should be too.',
          valueProposition: 'Build the brand signals that make AI search engines recommend you.',
          ctaText: 'Get Your Visibility Report',
          targetFunnelStage: 'awareness'
        }
      ],
      toneGuidance: `Given your ${brandMaturity.brandRecognition} brand recognition, maintain a ${brandMaturity.brandRecognition === 'strong' ? 'confident, authoritative' : 'credible, proof-focused'} tone. Focus on outcomes over features.`,
      keyDifferentiators: [
        'Deep industry expertise',
        'Proven methodology',
        'Measurable outcomes'
      ]
    },
    executiveSummary: `${businessContext.companyName} is currently at the ${tier} tier of brand maturity. ${marketingState.declineExperienced !== 'none' ? 'The organic visibility decline you\'re experiencing is likely connected to shifting search behavior toward AI-powered platforms.' : ''} The path forward involves strategic paid media investment that builds brand awareness while capturing existing demand. This creates the virtuous cycle where brand lift drives search demand, which improves both traditional and AI search visibility.`,
    nextSteps: [
      `${isExistingBuyer ? 'Reallocate' : 'Establish'} budget for brand-focused campaigns on LinkedIn and YouTube`,
      'Set up branded search campaigns to capture growing brand demand',
      'Schedule a strategy call to discuss implementation timeline'
    ]
  });
}
