import { NextRequest, NextResponse } from 'next/server';
import { FormData, LeadCaptureData, AnalysisResult, ZapierPayload } from '@/lib/types';

const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/26047972/ugzsmru/';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formData, leadData, analysisResult } = body as {
      formData: FormData;
      leadData: LeadCaptureData;
      analysisResult: AnalysisResult;
    };

    // Build Zapier payload
    const payload: ZapierPayload = {
      timestamp: new Date().toISOString(),
      email: leadData.email,
      companyName: formData.businessContext.companyName,
      companySize: leadData.companySize,
      role: leadData.role,
      websiteUrl: formData.businessContext.websiteUrl,
      competitorUrls: formData.businessContext.competitorUrls.filter(url => url.trim() !== ''),
      industry: formData.businessContext.industry,
      wantsCall: leadData.wantsCall,
      budgetRecommendation: {
        conservative: analysisResult.budgetRecommendation.conservative.summary,
        aggressive: analysisResult.budgetRecommendation.aggressive.summary,
      },
      brandTier: analysisResult.brandGapAnalysis.tier,
      attribution: leadData.attribution || {},
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
