'use client';

import { useState } from 'react';
import { AnalysisResult, FormData } from '@/lib/types';
import { AdCreativeGenerator } from './AdCreativeGenerator';

interface ResultsDisplayProps {
  analysis: AnalysisResult;
  formData: FormData;
}

type ResultsTab = 'analysis' | 'creative';

export function ResultsDisplay({ analysis, formData }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState<ResultsTab>('analysis');
  const [showDebug, setShowDebug] = useState(false);
  
  // Safely extract data with fallbacks
  const brandGapAnalysis = analysis?.brandGapAnalysis || null;
  const budgetRecommendation = analysis?.budgetRecommendation || null;
  const messagingRecommendation = analysis?.messagingRecommendation || null;
  const executiveSummary = analysis?.executiveSummary || 'Analysis complete.';
  const nextSteps = analysis?.nextSteps || ['Contact us for a detailed strategy session.'];
  
  const businessContext = formData?.businessContext || { companyName: 'Your Company', industry: 'Business', geographicFocus: '' };

  const tierDescriptions: Record<string, string> = {
    emerging: 'Building foundation',
    developing: 'Gaining momentum',
    established: 'Strong presence',
    dominant: 'Market leader',
  };

  // Card style helper
  const cardStyle = {
    backgroundColor: '#141414',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    borderTop: '3px solid #e85d04',
    marginBottom: '1.5rem'
  };

  const headerStyle = {
    color: '#e85d04',
    fontSize: '0.875rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: '1rem',
    fontFamily: 'Oswald, sans-serif',
    fontWeight: 600
  };

  // If critical data is missing, show a fallback
  if (!brandGapAnalysis && !budgetRecommendation) {
    return (
      <div style={{ padding: '1rem' }}>
        {/* Hero section */}
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <p style={{ color: '#e85d04', fontWeight: 500, marginBottom: '0.5rem' }}>Analysis Complete</p>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '1rem' }}>
            {businessContext.companyName}
          </h1>
        </div>

        <div style={{ ...cardStyle, textAlign: 'center', padding: '2rem' }}>
          <h2 style={{ color: '#ffffff', fontSize: '1.5rem', marginBottom: '1rem' }}>
            Analysis Generated
          </h2>
          <p style={{ color: '#9a9a9a', marginBottom: '1.5rem' }}>
            Your brand analysis has been processed. Some visualization data may not be available.
          </p>
          
          {executiveSummary && (
            <div style={{ 
              backgroundColor: '#1a1a1a', 
              padding: '1.5rem', 
              borderRadius: '0.5rem',
              textAlign: 'left',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ color: '#e85d04', marginBottom: '0.5rem', fontWeight: 600 }}>Summary</h3>
              <p style={{ color: '#ffffff' }}>{executiveSummary}</p>
            </div>
          )}

          <a 
            href="https://abstraktmg.com/contact"
            style={{
              display: 'inline-block',
              backgroundColor: '#e85d04',
              color: '#ffffff',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: 600
            }}
          >
            Get Your Full Report
          </a>

          <button
            onClick={() => setShowDebug(!showDebug)}
            style={{
              display: 'block',
              margin: '1.5rem auto 0',
              color: '#666',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            {showDebug ? 'Hide' : 'Show'} Debug Info
          </button>

          {showDebug && (
            <pre style={{ 
              marginTop: '1rem',
              padding: '1rem', 
              backgroundColor: '#0a0a0a', 
              borderRadius: '0.5rem',
              textAlign: 'left',
              overflow: 'auto',
              fontSize: '0.75rem',
              color: '#9a9a9a'
            }}>
              {JSON.stringify(analysis, null, 2)}
            </pre>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      {/* Hero section */}
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <p style={{ color: '#e85d04', fontWeight: 500, marginBottom: '0.5rem' }}>Analysis Complete</p>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '1rem', fontFamily: 'Oswald, sans-serif' }}>
          {businessContext.companyName}
        </h1>
        <p style={{ color: '#9a9a9a' }}>
          {businessContext.industry} {businessContext.geographicFocus ? `• ${businessContext.geographicFocus}` : ''}
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <div style={{ 
          display: 'inline-flex', 
          backgroundColor: '#141414', 
          borderRadius: '0.5rem', 
          padding: '0.25rem',
          border: '1px solid #1e1e1e'
        }}>
          <button
            onClick={() => setActiveTab('analysis')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'analysis' ? '#e85d04' : 'transparent',
              color: activeTab === 'analysis' ? '#ffffff' : '#9a9a9a'
            }}
          >
            📊 Analysis & Budget
          </button>
          <button
            onClick={() => setActiveTab('creative')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'creative' ? '#e85d04' : 'transparent',
              color: activeTab === 'creative' ? '#ffffff' : '#9a9a9a'
            }}
          >
            🎨 Ad Creative Generator
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'creative' ? (
        <AdCreativeGenerator formData={formData} analysis={analysis} />
      ) : (
        <>
          {/* Brand Tier Score */}
          {brandGapAnalysis && (
            <div style={{ ...cardStyle, padding: '2rem' }}>
              <h2 style={headerStyle}>Brand Maturity Assessment</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                {/* Score Display */}
                <div style={{ 
                  fontSize: '4rem', 
                  fontWeight: 'bold', 
                  color: '#e85d04',
                  fontFamily: 'Oswald, sans-serif'
                }}>
                  {brandGapAnalysis.brandMaturityScore || 0}
                </div>
                <div style={{ color: '#9a9a9a', marginBottom: '0.5rem' }}>out of 100</div>
                
                {/* Tier Badge */}
                <div style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#1a1a1a',
                  borderRadius: '9999px',
                  border: '1px solid #333'
                }}>
                  <span style={{ 
                    color: '#e85d04', 
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: '0.875rem'
                  }}>
                    {brandGapAnalysis.currentTier || 'Emerging'} Brand
                  </span>
                  <span style={{ color: '#666', marginLeft: '0.5rem', fontSize: '0.875rem' }}>
                    — {tierDescriptions[(brandGapAnalysis.currentTier || 'emerging').toLowerCase()] || 'Building foundation'}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ 
                  height: '0.5rem', 
                  backgroundColor: '#1a1a1a', 
                  borderRadius: '9999px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${brandGapAnalysis.brandMaturityScore || 0}%`,
                    background: 'linear-gradient(90deg, #e85d04, #ff6b1a)',
                    borderRadius: '9999px',
                    transition: 'width 1s ease-out'
                  }} />
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '0.5rem',
                  fontSize: '0.75rem',
                  color: '#666'
                }}>
                  <span>Emerging</span>
                  <span>Developing</span>
                  <span>Established</span>
                  <span>Dominant</span>
                </div>
              </div>
            </div>
          )}

          {/* Executive Summary */}
          {executiveSummary && (
            <div style={cardStyle}>
              <h2 style={headerStyle}>Executive Summary</h2>
              <p style={{ color: '#ffffff', lineHeight: 1.7 }}>{executiveSummary}</p>
            </div>
          )}

          {/* Brand Demand Gap */}
          {brandGapAnalysis?.brandDemandGap && (
            <div style={cardStyle}>
              <h2 style={headerStyle}>Brand Demand Gap Analysis</h2>
              <p style={{ color: '#ffffff', lineHeight: 1.7 }}>{brandGapAnalysis.brandDemandGap}</p>
            </div>
          )}

          {/* AI Search Constraints */}
          {brandGapAnalysis?.aiSearchConstraints && brandGapAnalysis.aiSearchConstraints.length > 0 && (
            <div style={cardStyle}>
              <h2 style={headerStyle}>AI Search Visibility Constraints</h2>
              <ul style={{ color: '#ffffff', paddingLeft: '1.25rem', margin: 0 }}>
                {brandGapAnalysis.aiSearchConstraints.map((constraint: string, index: number) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>
                    {constraint}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Budget Recommendations */}
          {budgetRecommendation && (
            <div style={cardStyle}>
              <h2 style={headerStyle}>Budget Recommendations</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {/* Conservative */}
                {budgetRecommendation.conservative && (
                  <div style={{ 
                    backgroundColor: '#1a1a1a', 
                    borderRadius: '0.5rem', 
                    padding: '1.5rem',
                    border: '1px solid #333'
                  }}>
                    <h3 style={{ color: '#9a9a9a', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Conservative
                    </h3>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Oswald, sans-serif' }}>
                      ${(budgetRecommendation.conservative.totalMonthly || 0).toLocaleString()}<span style={{ fontSize: '1rem', color: '#666' }}>/mo</span>
                    </div>
                    <p style={{ color: '#666', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                      {budgetRecommendation.conservative.rationale || 'Low-risk entry point'}
                    </p>
                  </div>
                )}

                {/* Aggressive */}
                {budgetRecommendation.aggressive && (
                  <div style={{ 
                    backgroundColor: '#1a1a1a', 
                    borderRadius: '0.5rem', 
                    padding: '1.5rem',
                    border: '2px solid #e85d04'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h3 style={{ color: '#e85d04', fontSize: '0.75rem', textTransform: 'uppercase', margin: 0 }}>
                        Aggressive
                      </h3>
                      <span style={{ 
                        backgroundColor: '#e85d04', 
                        color: '#fff', 
                        fontSize: '0.625rem', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '9999px' 
                      }}>
                        RECOMMENDED
                      </span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Oswald, sans-serif' }}>
                      ${(budgetRecommendation.aggressive.totalMonthly || 0).toLocaleString()}<span style={{ fontSize: '1rem', color: '#666' }}>/mo</span>
                    </div>
                    <p style={{ color: '#666', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                      {budgetRecommendation.aggressive.rationale || 'Maximum impact strategy'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ad Angles / Messaging */}
          {messagingRecommendation?.adAngles && messagingRecommendation.adAngles.length > 0 && (
            <div style={cardStyle}>
              <h2 style={headerStyle}>Recommended Ad Angles</h2>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                {messagingRecommendation.adAngles.map((angle: any, index: number) => (
                  <div 
                    key={index}
                    style={{ 
                      backgroundColor: '#1a1a1a', 
                      borderRadius: '0.5rem', 
                      padding: '1.25rem',
                      border: '1px solid #333'
                    }}
                  >
                    <div style={{ marginBottom: '0.75rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#e85d04',
                        color: '#fff',
                        fontSize: '0.625rem',
                        borderRadius: '0.25rem',
                        textTransform: 'uppercase',
                        fontWeight: 600
                      }}>
                        {angle.type || 'Ad Angle'}
                      </span>
                    </div>
                    <h3 style={{ color: '#ffffff', fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', margin: 0 }}>
                      {angle.headline || 'Headline'}
                    </h3>
                    <p style={{ color: '#9a9a9a', fontSize: '0.875rem', marginBottom: '0.75rem', marginTop: '0.5rem' }}>
                      {angle.subheadline || angle.valueProposition || ''}
                    </p>
                    {angle.ctaText && (
                      <span style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        border: '1px solid #e85d04',
                        color: '#e85d04',
                        fontSize: '0.875rem',
                        borderRadius: '0.25rem'
                      }}>
                        {angle.ctaText}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Steps */}
          {nextSteps && nextSteps.length > 0 && (
            <div style={cardStyle}>
              <h2 style={headerStyle}>Recommended Next Steps</h2>
              <ol style={{ color: '#ffffff', paddingLeft: '1.25rem', margin: 0 }}>
                {nextSteps.map((step: string, index: number) => (
                  <li key={index} style={{ marginBottom: '0.75rem' }}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* CTA */}
          <div style={{ 
            ...cardStyle,
            textAlign: 'center',
            padding: '3rem'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#ffffff', 
              marginBottom: '0.75rem',
              fontFamily: 'Oswald, sans-serif'
            }}>
              Ready to Build Your Brand Lift Strategy?
            </h2>
            <p style={{ color: '#9a9a9a', marginBottom: '1.5rem', maxWidth: '28rem', margin: '0 auto 1.5rem' }}>
              Our paid media strategists specialize in AI Search visibility and brand-first campaigns.
            </p>
            <a 
              href="https://abstraktmg.com/contact"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                backgroundColor: '#e85d04',
                color: '#ffffff',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1.125rem'
              }}
            >
              Schedule Strategy Call
            </a>
            <p style={{ color: '#666', fontSize: '0.875rem', marginTop: '1rem' }}>
              Free 30-minute consultation • No obligation
            </p>
          </div>

          {/* Debug toggle */}
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              onClick={() => setShowDebug(!showDebug)}
              style={{
                color: '#666',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.75rem'
              }}
            >
              {showDebug ? 'Hide' : 'Show'} Raw Data
            </button>
            {showDebug && (
              <pre style={{ 
                marginTop: '1rem',
                padding: '1rem', 
                backgroundColor: '#0a0a0a', 
                borderRadius: '0.5rem',
                textAlign: 'left',
                overflow: 'auto',
                fontSize: '0.625rem',
                color: '#666',
                maxHeight: '300px'
              }}>
                {JSON.stringify(analysis, null, 2)}
              </pre>
            )}
          </div>
        </>
      )}
    </div>
  );
}
