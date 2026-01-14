'use client';

import { useState } from 'react';
import { AnalysisResult, FormData } from '@/lib/types';
import { AdCreativeGenerator } from './AdCreativeGenerator';

interface ResultsDisplayProps {
  result: AnalysisResult;
  formData: FormData;
  onStartOver: () => void;
  onRegenerateMessaging: () => Promise<void>;
  onOpenScheduler: () => void;
}

export function ResultsDisplay({ result, formData, onStartOver, onRegenerateMessaging, onOpenScheduler }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'messaging' | 'creative'>('overview');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const tierColors: Record<string, string> = {
    emerging: 'text-yellow-400',
    developing: 'text-blue-400',
    established: 'text-green-400',
    dominant: 'text-purple-400',
  };

  const tierLabels: Record<string, string> = {
    emerging: 'Emerging Brand',
    developing: 'Developing Brand',
    established: 'Established Brand',
    dominant: 'Dominant Brand',
  };

  // Get first competitor URL for ads transparency link
  const primaryCompetitor = formData.businessContext.competitorUrls?.find(url => url.trim() !== '');

  const handleCheckCompetitorAds = () => {
    if (primaryCompetitor) {
      // Extract domain from URL
      let domain = primaryCompetitor;
      try {
        const url = new URL(primaryCompetitor.startsWith('http') ? primaryCompetitor : `https://${primaryCompetitor}`);
        domain = url.hostname.replace('www.', '');
      } catch {
        domain = primaryCompetitor.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
      }
      const transparencyUrl = `https://adstransparency.google.com/?domain=${encodeURIComponent(domain)}`;
      window.open(transparencyUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result, formData }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formData.businessContext.companyName.replace(/\s+/g, '-')}-AdSmith-Analysis.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('PDF generation error:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await onRegenerateMessaging();
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-white">
            Analysis for {formData.businessContext.companyName}
          </h2>
          <p className="text-abstrakt-text-muted mt-1">
            Your personalized brand lift strategy
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onOpenScheduler}
            className="abstrakt-button text-sm px-4 py-2 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Schedule a Meeting
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="abstrakt-button-outline text-sm px-4 py-2 flex items-center gap-2"
          >
            {isGeneratingPdf ? (
              <>
                <span className="spinner w-4 h-4" />
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </>
            )}
          </button>
          <button
            onClick={onStartOver}
            className="text-abstrakt-text-muted hover:text-white text-sm px-4 py-2"
          >
            Start Over
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-abstrakt-card rounded-lg p-1">
        {[
          { id: 'overview', label: 'Analysis Overview' },
          { id: 'messaging', label: 'Ad Messaging' },
          { id: 'creative', label: 'Creative Generator' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-abstrakt-orange text-white'
                : 'text-abstrakt-text-muted hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Brand Tier Card */}
          <div className="abstrakt-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-header">Brand Maturity Assessment</h3>
              <span className={`text-2xl font-heading font-bold ${tierColors[result.brandGapAnalysis.tier]}`}>
                {tierLabels[result.brandGapAnalysis.tier]}
              </span>
            </div>
            
            {/* Score Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-abstrakt-text-muted">Brand Score</span>
                <span className="text-white font-semibold">{result.brandGapAnalysis.score}/100</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${result.brandGapAnalysis.score}%` }} 
                />
              </div>
            </div>

            <p className="text-abstrakt-text-muted leading-relaxed">
              {result.brandGapAnalysis.brandDemandGap}
            </p>
          </div>

          {/* Budget Recommendations */}
          <div className="abstrakt-card p-6">
            <h3 className="section-header mb-6">Budget Recommendations</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Conservative */}
              <div className="bg-abstrakt-input rounded-lg p-5 border border-abstrakt-input-border">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-green-400">🎯</span>
                  <h4 className="font-semibold text-white">Conservative Start</h4>
                </div>
                <div className="text-3xl font-heading font-bold text-abstrakt-orange mb-2">
                  {result.budgetRecommendation.conservative.displayTotal}
                </div>
                <p className="text-sm text-abstrakt-text-muted mb-3">
                  {result.budgetRecommendation.conservative.summary}
                </p>
                <div className="text-xs text-abstrakt-text-dim">
                  Single platform focus for validation
                </div>
              </div>

              {/* Aggressive */}
              <div className="bg-abstrakt-input rounded-lg p-5 border-2 border-abstrakt-orange">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-abstrakt-orange">🚀</span>
                  <h4 className="font-semibold text-white">Aggressive Growth</h4>
                </div>
                <div className="text-3xl font-heading font-bold text-abstrakt-orange mb-2">
                  {result.budgetRecommendation.aggressive.displayTotal}
                </div>
                <p className="text-sm text-abstrakt-text-muted mb-3">
                  {result.budgetRecommendation.aggressive.summary}
                </p>
                <div className="text-xs text-abstrakt-text-dim">
                  Multi-platform for accelerated reach
                </div>
              </div>
            </div>

            <p className="text-sm text-abstrakt-text-muted mt-4 leading-relaxed">
              {result.budgetRecommendation.rationale}
            </p>

            {/* SEMRush Disclaimer */}
            {result.semrushDisclaimer && (
              <p className="text-xs text-abstrakt-text-dim mt-4 italic border-t border-abstrakt-card-border pt-4">
                ⚠️ {result.semrushDisclaimer}
              </p>
            )}
          </div>

          {/* Competitor Budget Estimates - NEW */}
          {result.budgetRecommendation.competitorEstimates && result.budgetRecommendation.competitorEstimates.length > 0 && (
            <div className="abstrakt-card p-6">
              <h3 className="section-header mb-4">Estimated Competitor Ad Spend</h3>
              <p className="text-sm text-abstrakt-text-muted mb-4">
                Based on industry benchmarks and market position analysis:
              </p>
              <div className="space-y-3">
                {result.budgetRecommendation.competitorEstimates.map((competitor, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-abstrakt-input rounded-lg p-4 border border-abstrakt-input-border">
                    <div className="flex items-center gap-3">
                      <span className="text-abstrakt-orange">🏢</span>
                      <span className="text-white font-medium">{competitor.domain}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-abstrakt-orange font-semibold">{competitor.estimatedMonthlySpend}/mo</div>
                      <div className="text-xs text-abstrakt-text-dim">
                        Confidence: {competitor.confidence}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Keywords with CPC - NEW */}
          {result.budgetRecommendation.topKeywords && result.budgetRecommendation.topKeywords.length > 0 && (
            <div className="abstrakt-card p-6">
              <h3 className="section-header mb-4">Top 5 Keywords & Estimated CPC</h3>
              <p className="text-sm text-abstrakt-text-muted mb-4">
                High-value keywords for your {formData.businessContext.industry} business:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-abstrakt-card-border">
                      <th className="text-left py-3 px-4 text-abstrakt-text-muted text-sm font-medium">Keyword</th>
                      <th className="text-center py-3 px-4 text-abstrakt-text-muted text-sm font-medium">Avg CPC</th>
                      <th className="text-center py-3 px-4 text-abstrakt-text-muted text-sm font-medium">Search Volume</th>
                      <th className="text-center py-3 px-4 text-abstrakt-text-muted text-sm font-medium">Competition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.budgetRecommendation.topKeywords.map((kw, idx) => (
                      <tr key={idx} className="border-b border-abstrakt-card-border/50">
                        <td className="py-3 px-4 text-white">{kw.keyword}</td>
                        <td className="py-3 px-4 text-center text-abstrakt-orange font-semibold">{kw.avgCpc}</td>
                        <td className="py-3 px-4 text-center text-abstrakt-text-muted">{kw.searchVolume}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            kw.competition === 'high' ? 'bg-red-900/50 text-red-400' :
                            kw.competition === 'medium' ? 'bg-yellow-900/50 text-yellow-400' :
                            'bg-green-900/50 text-green-400'
                          }`}>
                            {kw.competition}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Competitor Ads Button */}
          {primaryCompetitor && (
            <div className="abstrakt-card p-6">
              <h3 className="section-header mb-4">Competitive Intelligence</h3>
              <p className="text-abstrakt-text-muted mb-4">
                See what ads your competitors are running on Google&apos;s Ad Transparency Center.
              </p>
              <button
                onClick={handleCheckCompetitorAds}
                className="abstrakt-button-outline flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Check Competitor&apos;s Ads
              </button>
            </div>
          )}

          {/* AI Search Constraints */}
          <div className="abstrakt-card p-6">
            <h3 className="section-header mb-4">AI Search Visibility Factors</h3>
            <p className="text-sm text-abstrakt-text-muted mb-4">
              Key factors affecting how AI platforms like ChatGPT and Perplexity evaluate your brand:
            </p>
            <ul className="space-y-3">
              {result.brandGapAnalysis.aiSearchConstraints.map((constraint, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-abstrakt-orange mt-1">•</span>
                  <span className="text-abstrakt-text-muted">{constraint}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Executive Summary */}
          <div className="abstrakt-card p-6">
            <h3 className="section-header mb-4">Executive Summary</h3>
            <p className="text-abstrakt-text-muted leading-relaxed">
              {result.executiveSummary}
            </p>
          </div>

          {/* Next Steps */}
          <div className="abstrakt-card p-6">
            <h3 className="section-header mb-4">Recommended Next Steps</h3>
            <ol className="space-y-4">
              {result.nextSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-abstrakt-orange flex items-center justify-center text-white font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-abstrakt-text-muted pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Schedule Meeting CTA */}
          <div className="abstrakt-card p-6 border-2 border-abstrakt-orange bg-gradient-to-r from-abstrakt-orange/10 to-transparent">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-heading font-bold text-white mb-1">Ready to Get Started?</h3>
                <p className="text-abstrakt-text-muted">Let&apos;s discuss how we can help implement this strategy.</p>
              </div>
              <button
                onClick={onOpenScheduler}
                className="abstrakt-button px-6 py-3 flex items-center gap-2 whitespace-nowrap"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Schedule a Meeting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messaging Tab */}
      {activeTab === 'messaging' && (
        <div className="space-y-6">
          {/* Regenerate Button */}
          <div className="flex justify-end">
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="abstrakt-button-outline flex items-center gap-2"
            >
              {isRegenerating ? (
                <>
                  <span className="spinner w-4 h-4" />
                  Regenerating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Regenerate Ad Angles
                </>
              )}
            </button>
          </div>

          {/* Tone Guidance */}
          <div className="abstrakt-card p-6">
            <h3 className="section-header mb-4">Brand Voice & Tone</h3>
            <p className="text-abstrakt-text-muted leading-relaxed">
              {result.messagingRecommendation.toneGuidance}
            </p>
          </div>

          {/* Key Differentiators */}
          <div className="abstrakt-card p-6">
            <h3 className="section-header mb-4">Key Differentiators</h3>
            <div className="flex flex-wrap gap-3">
              {result.messagingRecommendation.keyDifferentiators.map((diff, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-abstrakt-input rounded-full text-sm text-abstrakt-text-muted border border-abstrakt-input-border"
                >
                  {diff}
                </span>
              ))}
            </div>
          </div>

          {/* Ad Angles */}
          <div className="space-y-4">
            <h3 className="section-header px-2">Recommended Ad Angles</h3>
            {result.messagingRecommendation.adAngles.map((angle, idx) => (
              <div key={idx} className="abstrakt-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-wider text-abstrakt-orange font-semibold">
                    {angle.type.replace('-', ' ')}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-abstrakt-input text-abstrakt-text-muted">
                    {angle.targetFunnelStage}
                  </span>
                </div>

                <h4 className="text-xl font-heading font-bold text-white mb-2">
                  {angle.headline}
                </h4>
                <p className="text-abstrakt-text-muted mb-4">
                  {angle.subheadline}
                </p>

                <div className="bg-abstrakt-input rounded-lg p-4 mb-4">
                  <p className="text-sm text-abstrakt-text-muted">
                    {angle.valueProposition}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-abstrakt-text-dim">CTA:</span>
                  <span className="px-4 py-2 bg-abstrakt-orange rounded text-sm font-semibold text-white">
                    {angle.ctaText}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Creative Tab */}
      {activeTab === 'creative' && (
        <AdCreativeGenerator 
          result={result} 
          formData={formData}
        />
      )}
    </div>
  );
}
