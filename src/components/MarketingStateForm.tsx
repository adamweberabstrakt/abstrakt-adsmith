'use client';

import { MarketingStateInputs, GOAL_OPTIONS, DECLINE_OPTIONS } from '@/lib/types';

interface MarketingStateFormProps {
  data: MarketingStateInputs;
  onChange: (data: Partial<MarketingStateInputs>) => void;
}

export function MarketingStateForm({ data, onChange }: MarketingStateFormProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Intro text */}
      <div className="bg-abstrakt-card border-l-4 border-abstrakt-orange rounded-lg p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📊</span>
          <div>
            <h3 className="section-header text-lg mb-2">Current Marketing Investment</h3>
            <p className="text-abstrakt-text-muted leading-relaxed">
              Understanding your current spend helps us identify gaps and opportunities. 
              Recent research shows that <span className="text-abstrakt-orange font-medium">Google Click Thru Rate has dropped by 32% on average</span> due to AI Overviews—your marketing mix may need adjustment.
            </p>
          </div>
        </div>
      </div>

      {/* Budget inputs */}
      <div className="abstrakt-card p-6">
        <h3 className="section-header text-base mb-6">Monthly Marketing Spend</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* SEO Budget */}
          <div>
            <label className="block text-sm text-abstrakt-text-muted mb-2">
              Monthly SEO Spend
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-abstrakt-text-dim">$</span>
              <input
                type="number"
                value={data.monthlySeoBudget || ''}
                onChange={(e) => onChange({ monthlySeoBudget: e.target.value ? Number(e.target.value) : null })}
                placeholder="5,000"
                className="abstrakt-input pl-8"
              />
            </div>
            <p className="text-xs text-abstrakt-text-dim mt-1">Include agency fees, content, tools</p>
          </div>

          {/* Paid Media Budget */}
          <div>
            <label className="block text-sm text-abstrakt-text-muted mb-2">
              Monthly Paid Media Spend
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-abstrakt-text-dim">$</span>
              <input
                type="number"
                value={data.monthlyPaidMediaBudget || ''}
                onChange={(e) => onChange({ monthlyPaidMediaBudget: e.target.value ? Number(e.target.value) : null })}
                placeholder="0"
                className="abstrakt-input pl-8"
              />
            </div>
            <p className="text-xs text-abstrakt-text-dim mt-1">Google Ads, LinkedIn, Meta, YouTube, etc.</p>
          </div>
        </div>

        {/* Budget visualization */}
        {(data.monthlySeoBudget || data.monthlyPaidMediaBudget) && (
          <div className="mt-6 p-4 bg-abstrakt-input rounded-lg">
            <p className="text-sm text-abstrakt-text-muted mb-3">Current Marketing Mix</p>
            <div className="flex h-4 rounded-full overflow-hidden bg-abstrakt-card-border">
              {data.monthlySeoBudget && data.monthlySeoBudget > 0 && (
                <div 
                  className="bg-blue-500 transition-all duration-500"
                  style={{ 
                    width: `${(data.monthlySeoBudget / ((data.monthlySeoBudget || 0) + (data.monthlyPaidMediaBudget || 0))) * 100}%` 
                  }}
                />
              )}
              {data.monthlyPaidMediaBudget && data.monthlyPaidMediaBudget > 0 && (
                <div 
                  className="bg-abstrakt-orange transition-all duration-500"
                  style={{ 
                    width: `${(data.monthlyPaidMediaBudget / ((data.monthlySeoBudget || 0) + (data.monthlyPaidMediaBudget || 0))) * 100}%` 
                  }}
                />
              )}
            </div>
            <div className="flex justify-between mt-2 text-xs">
              <span className="text-blue-400">
                SEO: ${(data.monthlySeoBudget || 0).toLocaleString()}
              </span>
              <span className="text-abstrakt-orange">
                Paid: ${(data.monthlyPaidMediaBudget || 0).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Goals */}
      <div className="abstrakt-card p-6">
        <h3 className="section-header text-base mb-6">Primary Marketing Goal</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {GOAL_OPTIONS.map(option => (
            <label
              key={option.value}
              className={`radio-card ${data.primaryGoal === option.value ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="primaryGoal"
                value={option.value}
                checked={data.primaryGoal === option.value}
                onChange={(e) => onChange({ primaryGoal: e.target.value as typeof data.primaryGoal })}
              />
              <div className="flex items-center gap-3">
                <div className={`
                  w-4 h-4 rounded-full border-2 flex items-center justify-center
                  ${data.primaryGoal === option.value 
                    ? 'border-abstrakt-orange bg-abstrakt-orange' 
                    : 'border-abstrakt-input-border'
                  }
                `}>
                  {data.primaryGoal === option.value && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className={data.primaryGoal === option.value ? 'text-white' : 'text-abstrakt-text-muted'}>
                  {option.label}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Decline experienced */}
      <div className="abstrakt-card p-6">
        <h3 className="section-header text-base mb-2">Have You Experienced Decline?</h3>
        <p className="text-abstrakt-text-muted text-sm mb-6">
          Many businesses are seeing organic performance decline as AI search changes buyer behavior.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {DECLINE_OPTIONS.map(option => (
            <label
              key={option.value}
              className={`radio-card ${data.declineExperienced === option.value ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="declineExperienced"
                value={option.value}
                checked={data.declineExperienced === option.value}
                onChange={(e) => onChange({ declineExperienced: e.target.value as typeof data.declineExperienced })}
              />
              <div className="flex items-center gap-3">
                <div className={`
                  w-4 h-4 rounded-full border-2 flex items-center justify-center
                  ${data.declineExperienced === option.value 
                    ? 'border-abstrakt-orange bg-abstrakt-orange' 
                    : 'border-abstrakt-input-border'
                  }
                `}>
                  {data.declineExperienced === option.value && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className={data.declineExperienced === option.value ? 'text-white' : 'text-abstrakt-text-muted'}>
                  {option.label}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
