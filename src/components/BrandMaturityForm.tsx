'use client';

import { MarketingStateData, BrandMaturityData, BusinessContextData } from '@/lib/types';

interface BrandMaturityFormProps {
  marketingData: MarketingStateData;
  brandData: BrandMaturityData;
  wantsCall: boolean;
  onMarketingChange: (data: Partial<MarketingStateData>) => void;
  onBrandChange: (data: Partial<BrandMaturityData>) => void;
  onWantsCallChange: (wantsCall: boolean) => void;
}

const PRIMARY_GOALS = [
  { value: 'leads', label: 'Lead Generation', description: 'Drive qualified leads and demo requests' },
  { value: 'pipeline', label: 'Pipeline Growth', description: 'Accelerate deals through the funnel' },
  { value: 'brand', label: 'Brand Awareness', description: 'Increase visibility and recognition' },
  { value: 'all', label: 'All of the Above', description: 'Balanced approach across all goals' },
];

const DECLINE_OPTIONS = [
  { value: 'none', label: 'No decline' },
  { value: 'slight', label: 'Slight decline (5-15%)' },
  { value: 'moderate', label: 'Moderate decline (15-30%)' },
  { value: 'significant', label: 'Significant decline (30%+)' },
];

const RECOGNITION_LEVELS = [
  { value: 'low', label: 'Low', description: 'Most prospects don\'t know our brand' },
  { value: 'moderate', label: 'Moderate', description: 'Some awareness in our target market' },
  { value: 'high', label: 'High', description: 'Well-known in our industry' },
  { value: 'dominant', label: 'Dominant', description: 'Category leader / household name' },
];

const BRANDED_SEARCH_OPTIONS = [
  { value: 'none', label: 'No branded search traffic' },
  { value: 'low', label: 'Low (< 100 monthly searches)' },
  { value: 'moderate', label: 'Moderate (100-1,000 monthly searches)' },
  { value: 'high', label: 'High (1,000+ monthly searches)' },
  { value: 'unknown', label: 'I\'m not sure' },
];

const COMPETITOR_AWARENESS = [
  { value: 'low', label: 'Low', description: 'We\'re rarely compared to competitors' },
  { value: 'moderate', label: 'Moderate', description: 'Sometimes mentioned alongside competitors' },
  { value: 'high', label: 'High', description: 'Often compared, but we differentiate well' },
];

export function BrandMaturityForm({ 
  marketingData, 
  brandData, 
  wantsCall,
  onMarketingChange, 
  onBrandChange,
  onWantsCallChange,
}: BrandMaturityFormProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-white mb-2">
          Marketing & Brand
        </h2>
        <p className="text-abstrakt-text-muted">
          Help us understand your current marketing investments and brand position.
        </p>
      </div>

      {/* Marketing State Section */}
      <div className="abstrakt-card p-6 space-y-6">
        <h3 className="text-lg font-heading font-semibold text-white">
          Current Marketing
        </h3>

        {/* Budget Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-abstrakt-text-muted mb-2">
              Monthly SEO Budget
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-abstrakt-text-dim">$</span>
              <input
                type="number"
                value={marketingData.monthlySeoBudget || ''}
                onChange={(e) => onMarketingChange({ monthlySeoBudget: e.target.value ? Number(e.target.value) : null })}
                placeholder="0"
                className="abstrakt-input pl-7"
              />
            </div>
            <p className="text-xs text-abstrakt-text-dim mt-1">Leave blank if none</p>
          </div>

          <div>
            <label className="block text-sm text-abstrakt-text-muted mb-2">
              Monthly Paid Media Budget
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-abstrakt-text-dim">$</span>
              <input
                type="number"
                value={marketingData.monthlyPaidMediaBudget || ''}
                onChange={(e) => onMarketingChange({ monthlyPaidMediaBudget: e.target.value ? Number(e.target.value) : null })}
                placeholder="0"
                className="abstrakt-input pl-7"
              />
            </div>
            <p className="text-xs text-abstrakt-text-dim mt-1">Leave blank if none</p>
          </div>
        </div>

        {/* Primary Goal */}
        <div>
          <label className="block text-sm text-abstrakt-text-muted mb-3">
            Primary Marketing Goal
          </label>
          <div className="grid sm:grid-cols-2 gap-3">
            {PRIMARY_GOALS.map((goal) => (
              <label
                key={goal.value}
                className={`
                  flex flex-col p-4 rounded-lg cursor-pointer transition-all border
                  ${marketingData.primaryGoal === goal.value
                    ? 'bg-abstrakt-orange/20 border-abstrakt-orange'
                    : 'bg-abstrakt-input border-abstrakt-input-border hover:border-abstrakt-orange/50'
                  }
                `}
              >
                <input
                  type="radio"
                  name="primaryGoal"
                  value={goal.value}
                  checked={marketingData.primaryGoal === goal.value}
                  onChange={(e) => onMarketingChange({ primaryGoal: e.target.value as MarketingStateData['primaryGoal'] })}
                  className="sr-only"
                />
                <span className={`font-semibold ${marketingData.primaryGoal === goal.value ? 'text-white' : 'text-abstrakt-text-muted'}`}>
                  {goal.label}
                </span>
                <span className="text-xs text-abstrakt-text-dim mt-1">
                  {goal.description}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Decline Experienced */}
        <div>
          <label className="block text-sm text-abstrakt-text-muted mb-2">
            Have you experienced organic traffic decline recently?
          </label>
          <select
            value={marketingData.declineExperienced}
            onChange={(e) => onMarketingChange({ declineExperienced: e.target.value as MarketingStateData['declineExperienced'] })}
            className="abstrakt-input"
          >
            {DECLINE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-abstrakt-text-dim mt-1">
            This helps us understand how AI search may be impacting your visibility.
          </p>
        </div>
      </div>

      {/* Brand Maturity Section */}
      <div className="abstrakt-card p-6 space-y-8">
        <h3 className="text-lg font-heading font-semibold text-white">
          Brand Strength
        </h3>

        {/* Brand Recognition */}
        <div>
          <label className="block text-sm text-abstrakt-text-muted mb-3">
            How would you describe your brand recognition?
          </label>
          <div className="grid sm:grid-cols-2 gap-3">
            {RECOGNITION_LEVELS.map((level) => (
              <label
                key={level.value}
                className={`
                  flex flex-col p-4 rounded-lg cursor-pointer transition-all border
                  ${brandData.brandRecognition === level.value
                    ? 'bg-abstrakt-orange/20 border-abstrakt-orange'
                    : 'bg-abstrakt-input border-abstrakt-input-border hover:border-abstrakt-orange/50'
                  }
                `}
              >
                <input
                  type="radio"
                  name="brandRecognition"
                  value={level.value}
                  checked={brandData.brandRecognition === level.value}
                  onChange={(e) => onBrandChange({ brandRecognition: e.target.value as BrandMaturityData['brandRecognition'] })}
                  className="sr-only"
                />
                <span className={`font-semibold ${brandData.brandRecognition === level.value ? 'text-white' : 'text-abstrakt-text-muted'}`}>
                  {level.label}
                </span>
                <span className="text-xs text-abstrakt-text-dim mt-1">
                  {level.description}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Existing Branded Search */}
        <div>
          <label className="block text-sm text-abstrakt-text-muted mb-2">
            What&apos;s your current branded search volume?
          </label>
          <select
            value={brandData.existingBrandedSearch}
            onChange={(e) => onBrandChange({ existingBrandedSearch: e.target.value as BrandMaturityData['existingBrandedSearch'] })}
            className="abstrakt-input"
          >
            {BRANDED_SEARCH_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-abstrakt-text-dim mt-1">
            Branded search = people searching for your company name directly.
          </p>
        </div>

        {/* Competitor Awareness */}
        <div>
          <label className="block text-sm text-abstrakt-text-muted mb-3">
            How often are you compared to competitors?
          </label>
          <div className="space-y-3">
            {COMPETITOR_AWARENESS.map((level) => (
              <label
                key={level.value}
                className={`
                  flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all border
                  ${brandData.competitorAwareness === level.value
                    ? 'bg-abstrakt-orange/20 border-abstrakt-orange'
                    : 'bg-abstrakt-input border-abstrakt-input-border hover:border-abstrakt-orange/50'
                  }
                `}
              >
                <input
                  type="radio"
                  name="competitorAwareness"
                  value={level.value}
                  checked={brandData.competitorAwareness === level.value}
                  onChange={(e) => onBrandChange({ competitorAwareness: e.target.value as BrandMaturityData['competitorAwareness'] })}
                  className="sr-only"
                />
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                  ${brandData.competitorAwareness === level.value
                    ? 'border-abstrakt-orange bg-abstrakt-orange'
                    : 'border-abstrakt-input-border'
                  }
                `}>
                  {brandData.competitorAwareness === level.value && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div>
                  <span className={`font-semibold ${brandData.competitorAwareness === level.value ? 'text-white' : 'text-abstrakt-text-muted'}`}>
                    {level.label}
                  </span>
                  <p className="text-xs text-abstrakt-text-dim mt-1">
                    {level.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* I'd Like A Call Checkbox */}
      <div className="abstrakt-card p-6">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-1">
            <input
              type="checkbox"
              checked={wantsCall}
              onChange={(e) => onWantsCallChange(e.target.checked)}
              className="sr-only"
            />
            <div className={`
              w-5 h-5 rounded border-2 flex items-center justify-center transition-all
              ${wantsCall
                ? 'bg-abstrakt-orange border-abstrakt-orange'
                : 'border-abstrakt-input-border group-hover:border-abstrakt-orange'
              }
            `}>
              {wantsCall && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <div>
            <span className="text-white font-medium">
              I&apos;d like a free strategy call
            </span>
            <p className="text-sm text-abstrakt-text-muted mt-1">
              Get a 30-minute consultation with our paid media experts to discuss your results.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}
