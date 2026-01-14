import { NextRequest, NextResponse } from 'next/server';
import { AnalysisResult, FormData } from '@/lib/types';

// Simple HTML-to-PDF using browser print
// For production, consider using puppeteer or a PDF service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { result, formData } = body as { 
      result: AnalysisResult; 
      formData: FormData;
    };

    const html = generatePdfHtml(result, formData);
    
    // Return HTML that can be printed as PDF
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'PDF generation failed' },
      { status: 500 }
    );
  }
}

function generatePdfHtml(result: AnalysisResult, formData: FormData): string {
  const tierLabels: Record<string, string> = {
    emerging: 'Emerging Brand',
    developing: 'Developing Brand',
    established: 'Established Brand',
    dominant: 'Dominant Brand',
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${formData.businessContext.companyName} - AdSmith Analysis</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #e85d04;
    }
    .header h1 {
      color: #e85d04;
      font-size: 28px;
      margin-bottom: 5px;
    }
    .header p {
      color: #666;
    }
    .section {
      margin-bottom: 30px;
    }
    .section h2 {
      color: #e85d04;
      font-size: 18px;
      margin-bottom: 15px;
      padding-bottom: 5px;
      border-bottom: 1px solid #ddd;
    }
    .tier-badge {
      display: inline-block;
      background: #e85d04;
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      font-weight: bold;
      margin-bottom: 15px;
    }
    .score-bar {
      background: #eee;
      height: 20px;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 15px;
    }
    .score-fill {
      background: #e85d04;
      height: 100%;
    }
    .budget-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .budget-card {
      border: 1px solid #ddd;
      padding: 20px;
      border-radius: 8px;
    }
    .budget-card.highlight {
      border-color: #e85d04;
      border-width: 2px;
    }
    .budget-amount {
      font-size: 24px;
      font-weight: bold;
      color: #e85d04;
    }
    .ad-angle {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 15px;
    }
    .ad-angle h3 {
      font-size: 16px;
      margin-bottom: 10px;
    }
    .ad-angle .type {
      color: #e85d04;
      font-size: 12px;
      text-transform: uppercase;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .next-steps ol {
      padding-left: 20px;
    }
    .next-steps li {
      margin-bottom: 10px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      color: #999;
      font-size: 12px;
    }
    .disclaimer {
      font-size: 11px;
      color: #999;
      font-style: italic;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>AdSmith Analysis</h1>
    <p>Brand Lift Strategy for ${formData.businessContext.companyName}</p>
  </div>

  <div class="section">
    <h2>Brand Maturity Assessment</h2>
    <div class="tier-badge">${tierLabels[result.brandGapAnalysis.tier]}</div>
    <div class="score-bar">
      <div class="score-fill" style="width: ${result.brandGapAnalysis.score}%"></div>
    </div>
    <p><strong>Score:</strong> ${result.brandGapAnalysis.score}/100</p>
    <p style="margin-top: 10px;">${result.brandGapAnalysis.brandDemandGap}</p>
  </div>

  <div class="section">
    <h2>Budget Recommendations</h2>
    <div class="budget-grid">
      <div class="budget-card">
        <strong>Conservative Start</strong>
        <div class="budget-amount">${result.budgetRecommendation.conservative.displayTotal}</div>
        <p>${result.budgetRecommendation.conservative.summary}</p>
      </div>
      <div class="budget-card highlight">
        <strong>Aggressive Growth</strong>
        <div class="budget-amount">${result.budgetRecommendation.aggressive.displayTotal}</div>
        <p>${result.budgetRecommendation.aggressive.summary}</p>
      </div>
    </div>
    <p class="disclaimer">${result.semrushDisclaimer || ''}</p>
  </div>

  <div class="section">
    <h2>Recommended Ad Angles</h2>
    ${result.messagingRecommendation.adAngles.map(angle => `
      <div class="ad-angle">
        <div class="type">${angle.type.replace('-', ' ')}</div>
        <h3>${angle.headline}</h3>
        <p>${angle.subheadline}</p>
        <p style="margin-top: 10px;"><strong>CTA:</strong> ${angle.ctaText}</p>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2>Executive Summary</h2>
    <p>${result.executiveSummary}</p>
  </div>

  <div class="section next-steps">
    <h2>Recommended Next Steps</h2>
    <ol>
      ${result.nextSteps.map(step => `<li>${step}</li>`).join('')}
    </ol>
  </div>

  <div class="footer">
    <p>Generated by AdSmith | Abstrakt Marketing Group</p>
    <p>For questions, contact us at abstrakt.com</p>
  </div>
</body>
</html>
  `;
}
