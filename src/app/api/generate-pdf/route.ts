import { NextRequest, NextResponse } from 'next/server';
import { AnalysisResult, FormData } from '@/lib/types';

interface PDFRequest {
  formData: FormData;
  analysis: AnalysisResult;
  leadData: {
    email: string;
    companySize?: string;
    role?: string;
    wantsCall: boolean;
  };
}

export async function POST(request: NextRequest) {
  console.log('=== /api/generate-pdf called ===');
  
  try {
    const { formData, analysis, leadData }: PDFRequest = await request.json();
    console.log('Lead email:', leadData.email);
    console.log('Company:', formData.businessContext.companyName);

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      console.log('RESEND_API_KEY not configured - skipping email');
      return NextResponse.json({ 
        success: true, 
        skipped: true,
        message: 'Email skipped - Resend not configured' 
      });
    }

    // Dynamic import to avoid errors if package issues
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Build the email HTML
    const emailHtml = buildEmailHTML(formData, analysis);

    // Determine the "from" address
    // Use verified domain if set, otherwise use Resend's test domain
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    console.log('Sending from:', fromEmail);

    // Send via Resend
    try {
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: leadData.email,
        subject: `Brand Lift Analysis for ${formData.businessContext.companyName}`,
        html: emailHtml,
      });

      if (error) {
        console.error('Resend error:', error);
        // Don't fail - just log and continue
        return NextResponse.json({ 
          success: false, 
          error: error.message,
          message: 'Email failed but analysis complete'
        });
      }

      console.log('Email sent successfully:', data?.id);

      // Try to send internal notification (optional)
      try {
        const internalEmail = process.env.INTERNAL_EMAIL;
        if (internalEmail) {
          await resend.emails.send({
            from: fromEmail,
            to: internalEmail,
            subject: `New Brand Lift Lead: ${formData.businessContext.companyName}`,
            html: buildInternalNotificationHTML(formData, analysis, leadData),
          });
          console.log('Internal notification sent');
        }
      } catch (internalError) {
        console.error('Internal notification failed (non-blocking):', internalError);
      }

      return NextResponse.json({ success: true, messageId: data?.id });

    } catch (sendError: any) {
      console.error('Email send error:', sendError);
      return NextResponse.json({ 
        success: false, 
        error: sendError.message,
        message: 'Email failed but analysis complete'
      });
    }

  } catch (error: any) {
    console.error('PDF/Email error:', error?.message || error);
    // Return success anyway so the main flow isn't blocked
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      message: 'Email processing failed but analysis complete'
    });
  }
}

function buildEmailHTML(formData: FormData, analysis: AnalysisResult): string {
  const { businessContext, marketingState } = formData;
  const { brandGapAnalysis, budgetRecommendation, messagingRecommendation, executiveSummary, nextSteps } = analysis;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Brand Lift Analysis - ${businessContext.companyName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #0a0a0a; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #141414;">
    <!-- Header -->
    <tr>
      <td style="padding: 40px 30px; text-align: center; border-bottom: 3px solid #e85d04;">
        <h1 style="margin: 0; font-size: 28px; color: #e85d04; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
          Brand Lift Analysis
        </h1>
        <p style="margin: 10px 0 0; color: #9a9a9a; font-size: 14px;">
          AI Search Visibility & Media Planning Report
        </p>
      </td>
    </tr>
    
    <!-- Company Info -->
    <tr>
      <td style="padding: 30px;">
        <h2 style="margin: 0 0 10px; font-size: 20px; color: #ffffff;">${businessContext.companyName}</h2>
        <p style="margin: 0; color: #9a9a9a; font-size: 14px;">${businessContext.industry} | ${businessContext.geographicFocus}</p>
      </td>
    </tr>

    <!-- Executive Summary -->
    <tr>
      <td style="padding: 0 30px 30px;">
        <div style="background-color: #1a1a1a; border-radius: 8px; padding: 25px; border-left: 4px solid #e85d04;">
          <h3 style="margin: 0 0 15px; color: #e85d04; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Executive Summary</h3>
          <p style="margin: 0; color: #ffffff; line-height: 1.6; font-size: 15px;">${executiveSummary}</p>
        </div>
      </td>
    </tr>

    <!-- Brand Maturity Score -->
    <tr>
      <td style="padding: 0 30px 30px;">
        <div style="background-color: #1a1a1a; border-radius: 8px; padding: 25px; text-align: center;">
          <h3 style="margin: 0 0 15px; color: #e85d04; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Brand Maturity Tier</h3>
          <p style="margin: 0 0 5px; font-size: 48px; font-weight: bold; color: #e85d04; text-transform: uppercase;">${brandGapAnalysis.tier}</p>
          <p style="margin: 0; color: #9a9a9a; font-size: 14px;">Score: ${brandGapAnalysis.score}/100</p>
        </div>
      </td>
    </tr>

    <!-- AI Search Constraints -->
    <tr>
      <td style="padding: 0 30px 30px;">
        <div style="background-color: #1a1a1a; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 15px; color: #e85d04; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">AI Search Visibility Constraints</h3>
          <p style="margin: 0 0 15px; color: #ffffff; line-height: 1.6;">${brandGapAnalysis.brandDemandGap}</p>
          <ul style="margin: 0; padding: 0 0 0 20px; color: #9a9a9a;">
            ${brandGapAnalysis.aiSearchConstraints.map(c => `<li style="margin-bottom: 8px;">${c}</li>`).join('')}
          </ul>
        </div>
      </td>
    </tr>

    <!-- Budget Recommendations -->
    <tr>
      <td style="padding: 0 30px 30px;">
        <div style="background-color: #1a1a1a; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 20px; color: #e85d04; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Recommended Media Budget</h3>
          
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50%" style="padding-right: 10px; vertical-align: top;">
                <div style="background-color: #0a0a0a; border-radius: 6px; padding: 15px; border: 1px solid #333;">
                  <p style="margin: 0 0 10px; color: #9a9a9a; font-size: 12px; text-transform: uppercase;">Conservative</p>
                  <p style="margin: 0 0 15px; font-size: 28px; color: #ffffff; font-weight: bold;">$${budgetRecommendation.conservative.total.toLocaleString()}<span style="font-size: 14px; color: #9a9a9a;">/mo</span></p>
                  <p style="margin: 0; font-size: 12px; color: #666;">
                    Brand: $${budgetRecommendation.conservative.brandSearch.toLocaleString()}<br>
                    Non-Brand: $${budgetRecommendation.conservative.nonBrandSearch.toLocaleString()}<br>
                    LinkedIn: $${budgetRecommendation.conservative.linkedin.toLocaleString()}<br>
                    YouTube: $${budgetRecommendation.conservative.youtube.toLocaleString()}
                  </p>
                </div>
              </td>
              <td width="50%" style="padding-left: 10px; vertical-align: top;">
                <div style="background-color: #0a0a0a; border-radius: 6px; padding: 15px; border: 1px solid #e85d04;">
                  <p style="margin: 0 0 10px; color: #e85d04; font-size: 12px; text-transform: uppercase;">Aggressive</p>
                  <p style="margin: 0 0 15px; font-size: 28px; color: #ffffff; font-weight: bold;">$${budgetRecommendation.aggressive.total.toLocaleString()}<span style="font-size: 14px; color: #9a9a9a;">/mo</span></p>
                  <p style="margin: 0; font-size: 12px; color: #666;">
                    Brand: $${budgetRecommendation.aggressive.brandSearch.toLocaleString()}<br>
                    Non-Brand: $${budgetRecommendation.aggressive.nonBrandSearch.toLocaleString()}<br>
                    LinkedIn: $${budgetRecommendation.aggressive.linkedin.toLocaleString()}<br>
                    YouTube: $${budgetRecommendation.aggressive.youtube.toLocaleString()}
                  </p>
                </div>
              </td>
            </tr>
          </table>
          
          <p style="margin: 20px 0 0; color: #9a9a9a; font-size: 13px; line-height: 1.5;">${budgetRecommendation.rationale}</p>
        </div>
      </td>
    </tr>

    <!-- Ad Angles -->
    <tr>
      <td style="padding: 0 30px 30px;">
        <div style="background-color: #1a1a1a; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 20px; color: #e85d04; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Recommended Ad Angles</h3>
          ${messagingRecommendation.adAngles.slice(0, 3).map(angle => `
          <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #333;">
            <span style="display: inline-block; background-color: #e85d04; color: #fff; font-size: 10px; padding: 3px 8px; border-radius: 3px; text-transform: uppercase; margin-bottom: 10px;">${angle.type.replace('-', ' ')}</span>
            <h4 style="margin: 0 0 5px; color: #ffffff; font-size: 18px;">${angle.headline}</h4>
            <p style="margin: 0 0 10px; color: #9a9a9a; font-size: 14px;">${angle.subheadline}</p>
            <p style="margin: 0; color: #666; font-size: 13px; font-style: italic;">${angle.valueProposition}</p>
          </div>
          `).join('')}
        </div>
      </td>
    </tr>

    <!-- Next Steps -->
    <tr>
      <td style="padding: 0 30px 30px;">
        <div style="background-color: #1a1a1a; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 15px; color: #e85d04; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Recommended Next Steps</h3>
          <ol style="margin: 0; padding: 0 0 0 20px; color: #ffffff;">
            ${nextSteps.map(step => `<li style="margin-bottom: 10px; line-height: 1.5;">${step}</li>`).join('')}
          </ol>
        </div>
      </td>
    </tr>

    <!-- CTA -->
    <tr>
      <td style="padding: 30px; text-align: center; background-color: #0a0a0a;">
        <h3 style="margin: 0 0 15px; color: #ffffff; font-size: 20px;">Ready to Build Your Brand Lift Strategy?</h3>
        <p style="margin: 0 0 25px; color: #9a9a9a; font-size: 14px;">Let's discuss how to implement these recommendations.</p>
        <a href="https://abstraktmg.com/contact" style="display: inline-block; background-color: #e85d04; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 6px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Schedule Strategy Call</a>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 30px; text-align: center; border-top: 1px solid #333;">
        <p style="margin: 0 0 10px; color: #e85d04; font-weight: bold; font-size: 14px;">ABSTRAKT MARKETING GROUP</p>
        <p style="margin: 0; color: #666; font-size: 12px;">© ${new Date().getFullYear()} All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

function buildInternalNotificationHTML(formData: FormData, analysis: AnalysisResult, leadData: { email: string; companySize?: string; role?: string; wantsCall: boolean }): string {
  const { businessContext, marketingState, brandMaturity } = formData;
  
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h1 style="color: #e85d04; margin: 0 0 20px; border-bottom: 2px solid #e85d04; padding-bottom: 10px;">New Brand Lift Lead</h1>
    
    <h2 style="color: #333; margin: 20px 0 10px;">Contact Information</h2>
    <p><strong>Email:</strong> ${leadData.email}</p>
    ${leadData.role ? `<p><strong>Role:</strong> ${leadData.role}</p>` : ''}
    ${leadData.companySize ? `<p><strong>Company Size:</strong> ${leadData.companySize}</p>` : ''}
    <p><strong>Wants Call:</strong> ${leadData.wantsCall ? '✅ YES' : 'No'}</p>
    
    <h2 style="color: #333; margin: 20px 0 10px;">Business Profile</h2>
    <p><strong>Company:</strong> ${businessContext.companyName}</p>
    <p><strong>Industry:</strong> ${businessContext.industry}</p>
    <p><strong>Deal Size:</strong> ${businessContext.averageDealSize ? `$${businessContext.averageDealSize.toLocaleString()}` : 'Not specified'}</p>
    <p><strong>Sales Cycle:</strong> ${businessContext.salesCycleLength}</p>
    <p><strong>Geographic Focus:</strong> ${businessContext.geographicFocus}</p>
    
    <h2 style="color: #333; margin: 20px 0 10px;">Current Marketing</h2>
    <p><strong>SEO Budget:</strong> ${marketingState.monthlySeoBudget ? `$${marketingState.monthlySeoBudget.toLocaleString()}/mo` : 'Not specified'}</p>
    <p><strong>Paid Media Budget:</strong> ${marketingState.monthlyPaidMediaBudget ? `$${marketingState.monthlyPaidMediaBudget.toLocaleString()}/mo` : 'None'}</p>
    <p><strong>Primary Goal:</strong> ${marketingState.primaryGoal}</p>
    <p><strong>Decline Experienced:</strong> ${marketingState.declineExperienced}</p>
    
    <h2 style="color: #333; margin: 20px 0 10px;">Brand Assessment</h2>
    <p><strong>Brand Tier:</strong> <span style="background: #e85d04; color: #fff; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">${analysis.brandGapAnalysis.tier}</span></p>
    <p><strong>Score:</strong> ${analysis.brandGapAnalysis.score}/100</p>
    <p><strong>Recognition:</strong> ${brandMaturity.brandRecognition}</p>
    
    <h2 style="color: #333; margin: 20px 0 10px;">Recommended Budget</h2>
    <p><strong>Conservative:</strong> $${analysis.budgetRecommendation.conservative.total.toLocaleString()}/mo</p>
    <p><strong>Aggressive:</strong> $${analysis.budgetRecommendation.aggressive.total.toLocaleString()}/mo</p>
    
    <div style="margin-top: 30px; padding: 20px; background: #f5f5f5; border-radius: 6px;">
      <p style="margin: 0; color: #666; font-size: 14px;"><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    </div>
  </div>
</body>
</html>
  `;
}
