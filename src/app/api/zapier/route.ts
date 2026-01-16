import { NextRequest, NextResponse } from 'next/server';
import { FormData, LeadCaptureData, AnalysisResult } from '@/lib/types';

const ZAPIER_WEBHOOK_URL = process.env.ZAPIER_WEBHOOK_URL || 'https://hooks.zapier.com/hooks/catch/26047972/ugzsmru/';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formData, leadData, analysisResult } = body as {
      formData: FormData;
      leadData: LeadCaptureData;
      analysisResult: AnalysisResult;
    };

    // Build comprehensive Zapier payload with all fields
    const payload = {
      // Timestamp
      timestamp: new Date().toISOString(),
      
      // Lead Form Data
      email: leadData.email,
      companySize: leadData.companySize || '',
      role: leadData.role || '',
      wantsCall: leadData.wantsCall ? 'Yes' : 'No',
      
      // Business Context
      companyName: formData.businessContext.companyName,
      websiteUrl: formData.businessContext.websiteUrl,
      industry: formData.businessContext.industry,
      averageDealSize: formData.businessContext.averageDealSize || '',
      salesCycleLength: formData.businessContext.salesCycleLength || '',
      geographicFocus: formData.businessContext.geographicFocus || '',
      competitorUrls: formData.businessContext.competitorUrls.filter(url => url.trim() !== '').join(', '),
      
      // Marketing State
      monthlySeoBudget: formData.marketingState.monthlySeoBudget || '',
      monthlyPaidMediaBudget: formData.marketingState.monthlyPaidMediaBudget || '',
      primaryGoal: formData.marketingState.primaryGoal || '',
      declineExperienced: formData.marketingState.declineExperienced || '',
      
      // Brand Maturity Inputs
      brandRecognition: formData.brandMaturity.brandRecognition || '',
      existingBrandedSearch: formData.brandMaturity.existingBrandedSearch || '',
      competitorAwareness: formData.brandMaturity.competitorAwareness || '',
      
      // Analysis Results - Brand
      brandTier: analysisResult.brandGapAnalysis.tier,
      brandScore: analysisResult.brandGapAnalysis.score,
      brandDemandGap: analysisResult.brandGapAnalysis.brandDemandGap,
      
      // Analysis Results - Budget (amounts and summaries)
      conservativeBudgetAmount: analysisResult.budgetRecommendation.conservative.displayTotal,
      conservativeBudgetSummary: analysisResult.budgetRecommendation.conservative.summary,
      aggressiveBudgetAmount: analysisResult.budgetRecommendation.aggressive.displayTotal,
      aggressiveBudgetSummary: analysisResult.budgetRecommendation.aggressive.summary,
      budgetRationale: analysisResult.budgetRecommendation.rationale,
      
      // Executive Summary
      executiveSummary: analysisResult.executiveSummary,
      
      // Attribution / UTM Tracking
      utmSource: leadData.attribution?.utm_source || '',
      utmMedium: leadData.attribution?.utm_medium || '',
      utmCampaign: leadData.attribution?.utm_campaign || '',
      utmContent: leadData.attribution?.utm_content || '',
      utmTerm: leadData.attribution?.utm_term || '',
      gclid: leadData.attribution?.gclid || '',
    };

    // Send to Zapier
    const response = await fetch(ZAPIER_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Zapier webhook failed:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Zapier webhook failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Zapier API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
