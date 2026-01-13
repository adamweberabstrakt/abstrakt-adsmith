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
  const { brandGapAnalysis, budgetRecommendation, messagingRecommendation, executiveSummary, nextSteps } = analysis;
  const { businessContext } = formData;

  const tierColors = {
    emerging: 'from-red-500 to-orange-500',
    developing: 'from-orange-500 to-yellow-500',
    established: 'from-yellow-500 to-green-500',
    dominant: 'from-green-500 to-emerald-500',
  };

  const tierDescriptions = {
    emerging: 'Building foundation',
    developing: 'Gaining momentum',
    established: 'Strong presence',
    dominant: 'Market leader',
  };

  return (
    <div className="space-y-8 animate-stagger">
      {/* Hero section */}
      <div className="text-center py-8">
        <p className="text-abstrakt-orange font-medium mb-2">Analysis Complete</p>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
          {businessContext.companyName}
        </h1>
        <p className="text-abstrakt-text-muted">
          {businessContext.industry} • {businessContext.geographicFocus}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="inline-flex bg-abstrakt-card rounded-lg p-1 border border-abstrakt-card-border">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`
              px-6 py-3 rounded-md font-medium transition-all
              ${activeTab === 'analysis'
                ? 'bg-abstrakt-orange text-white'
                : 'text-abstrakt-text-muted hover:text-white'
              }
            `}
          >
            📊 Analysis & Budget
          </button>
          <button
            onClick={() => setActiveTab('creative')}
            className={`
              px-6 py-3 rounded-md font-medium transition-all
              ${activeTab === 'creative'
                ? 'bg-abstrakt-orange text-white'
                : 'text-abstrakt-text-muted hover:text-white'
              }
            `}
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
      <div className="abstrakt-card p-8 text-center">
        <h2 className="section-header text-lg mb-6">Brand Maturity Tier</h2>
        
        <div className={`
          inline-block px-8 py-4 rounded-xl mb-4
          bg-gradient-to-r ${tierColors[brandGapAnalysis.tier]}
        `}>
          <span className="text-4xl md:text-5xl font-heading font-bold text-white uppercase tracking-wider">
            {brandGapAnalysis.tier}
          </span>
        </div>
        
        <p className="text-abstrakt-text-muted mb-6">{tierDescriptions[brandGapAnalysis.tier]}</p>
        
        {/* Score gauge */}
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-xs text-abstrakt-text-dim mb-2">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
          <div className="h-4 bg-abstrakt-input rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full bg-gradient-to-r ${tierColors[brandGapAnalysis.tier]} transition-all duration-1000`}
              style={{ width: `${brandGapAnalysis.score}%` }}
            />
          </div>
          <p className="text-2xl font-bold text-white mt-3">{brandGapAnalysis.score}/100</p>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="abstrakt-card p-6">
        <h2 className="section-header text-base mb-4">Executive Summary</h2>
        <p className="text-abstrakt-text leading-relaxed text-lg">{executiveSummary}</p>
      </div>

      {/* AI Search Constraints */}
      <div className="abstrakt-card p-6">
        <h2 className="section-header text-base mb-4">AI Search Visibility Analysis</h2>
        <p className="text-abstrakt-text-muted mb-6">{brandGapAnalysis.brandDemandGap}</p>
        
        <h3 className="text-sm text-abstrakt-text-dim uppercase tracking-wider mb-3">Current Constraints</h3>
        <ul className="space-y-3">
          {brandGapAnalysis.aiSearchConstraints.map((constraint, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-abstrakt-orange/20 text-abstrakt-orange flex items-center justify-center shrink-0 text-sm">
                {index + 1}
              </span>
              <span className="text-abstrakt-text">{constraint}</span>
            </li>
          ))}
        </ul>
        
        <div className="mt-6 p-4 bg-abstrakt-input rounded-lg border-l-4 border-abstrakt-orange">
          <p className="text-sm">
            <span className="text-abstrakt-orange font-medium">Paid Media Potential: </span>
            <span className="text-abstrakt-text-muted">{brandGapAnalysis.paidMediaPotential}</span>
          </p>
        </div>
      </div>

      {/* Budget Recommendations */}
      <div className="abstrakt-card p-6">
        <h2 className="section-header text-base mb-6">Recommended Media Budget</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Conservative */}
          <div className="bg-abstrakt-input rounded-lg p-6 border border-abstrakt-card-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-abstrakt-text-dim uppercase tracking-wider">Conservative</span>
              <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">Low Risk</span>
            </div>
            <p className="text-4xl font-heading font-bold text-white mb-1">
              ${budgetRecommendation.conservative.total.toLocaleString()}
              <span className="text-lg text-abstrakt-text-muted font-normal">/mo</span>
            </p>
            
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-abstrakt-text-dim">Brand Search</span>
                <span className="text-abstrakt-text">${budgetRecommendation.conservative.brandSearch.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-abstrakt-text-dim">Non-Brand Search</span>
                <span className="text-abstrakt-text">${budgetRecommendation.conservative.nonBrandSearch.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-abstrakt-text-dim">LinkedIn</span>
                <span className="text-abstrakt-text">${budgetRecommendation.conservative.linkedin.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-abstrakt-text-dim">YouTube</span>
                <span className="text-abstrakt-text">${budgetRecommendation.conservative.youtube.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-abstrakt-text-dim">Display</span>
                <span className="text-abstrakt-text">${budgetRecommendation.conservative.display.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Aggressive */}
          <div className="bg-abstrakt-input rounded-lg p-6 border-2 border-abstrakt-orange relative">
            <div className="absolute -top-3 left-4 px-3 py-0.5 bg-abstrakt-orange text-white text-xs font-bold rounded">
              RECOMMENDED
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-abstrakt-orange uppercase tracking-wider">Aggressive</span>
              <span className="text-xs px-2 py-1 bg-abstrakt-orange/20 text-abstrakt-orange rounded">High Growth</span>
            </div>
            <p className="text-4xl font-heading font-bold text-white mb-1">
              ${budgetRecommendation.aggressive.total.toLocaleString()}
              <span className="text-lg text-abstrakt-text-muted font-normal">/mo</span>
            </p>
            
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-abstrakt-text-dim">Brand Search</span>
                <span className="text-abstrakt-text">${budgetRecommendation.aggressive.brandSearch.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-abstrakt-text-dim">Non-Brand Search</span>
                <span className="text-abstrakt-text">${budgetRecommendation.aggressive.nonBrandSearch.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-abstrakt-text-dim">LinkedIn</span>
                <span className="text-abstrakt-text">${budgetRecommendation.aggressive.linkedin.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-abstrakt-text-dim">YouTube</span>
                <span className="text-abstrakt-text">${budgetRecommendation.aggressive.youtube.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-abstrakt-text-dim">Display</span>
                <span className="text-abstrakt-text">${budgetRecommendation.aggressive.display.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Warning thresholds for new buyers */}
        {budgetRecommendation.minimumViable && (
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="bg-abstrakt-warning/10 border border-abstrakt-warning/30 rounded-lg p-4">
              <p className="text-abstrakt-warning text-sm font-medium mb-1">Minimum Viable Budget</p>
              <p className="text-2xl font-bold text-white">${budgetRecommendation.minimumViable.toLocaleString()}/mo</p>
              <p className="text-xs text-abstrakt-text-dim mt-1">Lowest spend that can show measurable results</p>
            </div>
            <div className="bg-abstrakt-error/10 border border-abstrakt-error/30 rounded-lg p-4">
              <p className="text-abstrakt-error text-sm font-medium mb-1">Warning Threshold</p>
              <p className="text-2xl font-bold text-white">${budgetRecommendation.warningThreshold?.toLocaleString()}/mo</p>
              <p className="text-xs text-abstrakt-text-dim mt-1">Below this, expect limited results</p>
            </div>
          </div>
        )}

        <p className="mt-6 text-abstrakt-text-muted text-sm leading-relaxed">
          {budgetRecommendation.rationale}
        </p>
      </div>

      {/* Ad Angles */}
      <div className="abstrakt-card p-6">
        <h2 className="section-header text-base mb-6">Recommended Ad Angles</h2>
        <p className="text-abstrakt-text-muted text-sm mb-6">{messagingRecommendation.toneGuidance}</p>
        
        <div className="space-y-4">
          {messagingRecommendation.adAngles.map((angle, index) => (
            <div 
              key={index}
              className="bg-abstrakt-input rounded-lg p-5 border border-abstrakt-card-border hover:border-abstrakt-orange transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`
                  px-3 py-1 rounded text-xs font-medium uppercase tracking-wider
                  ${angle.type === 'problem-aware' ? 'bg-red-500/20 text-red-400' :
                    angle.type === 'brand-authority' ? 'bg-blue-500/20 text-blue-400' :
                    angle.type === 'ai-search-capture' ? 'bg-purple-500/20 text-purple-400' :
                    angle.type === 'social-proof' ? 'bg-green-500/20 text-green-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }
                `}>
                  {angle.type.replace(/-/g, ' ')}
                </span>
                <span className="text-xs text-abstrakt-text-dim">
                  {angle.targetFunnelStage} stage
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1">{angle.headline}</h3>
              <p className="text-abstrakt-text-muted mb-3">{angle.subheadline}</p>
              
              <div className="flex items-center justify-between pt-3 border-t border-abstrakt-card-border">
                <p className="text-sm text-abstrakt-text-dim italic">{angle.valueProposition}</p>
                <span className="px-4 py-1.5 bg-abstrakt-orange text-white text-sm font-medium rounded">
                  {angle.ctaText}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Key differentiators */}
        <div className="mt-6 p-4 bg-abstrakt-card rounded-lg">
          <h4 className="text-sm text-abstrakt-text-dim uppercase tracking-wider mb-3">Key Differentiators to Emphasize</h4>
          <div className="flex flex-wrap gap-2">
            {messagingRecommendation.keyDifferentiators.map((diff, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-abstrakt-input text-abstrakt-text text-sm rounded-full border border-abstrakt-card-border"
              >
                {diff}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="abstrakt-card p-6">
        <h2 className="section-header text-base mb-6">Recommended Next Steps</h2>
        <ol className="space-y-4">
          {nextSteps.map((step, index) => (
            <li key={index} className="flex items-start gap-4">
              <span className="w-8 h-8 rounded-full bg-abstrakt-orange flex items-center justify-center text-white font-bold shrink-0">
                {index + 1}
              </span>
              <span className="text-abstrakt-text pt-1">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* CTA */}
      <div className="abstrakt-card p-8 text-center bg-gradient-to-br from-abstrakt-card to-abstrakt-input">
        <h2 className="text-2xl font-heading font-bold text-white mb-3">
          Ready to Build Your Brand Lift Strategy?
        </h2>
        <p className="text-abstrakt-text-muted mb-6 max-w-md mx-auto">
          Our paid media strategists specialize in AI Search visibility and brand-first campaigns.
        </p>
        <a 
          href="https://abstraktmg.com/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="abstrakt-button inline-block text-lg px-8"
        >
          Schedule Strategy Call
        </a>
        <p className="text-abstrakt-text-dim text-sm mt-4">Free 30-minute consultation • No obligation</p>
      </div>
        </>
      )}
    </div>
  );
}
