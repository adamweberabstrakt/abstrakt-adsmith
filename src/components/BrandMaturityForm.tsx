'use client';

import { BrandMaturityInputs, BRAND_RECOGNITION_OPTIONS } from '@/lib/types';

interface BrandMaturityFormProps {
  data: BrandMaturityInputs;
  onChange: (data: Partial<BrandMaturityInputs>) => void;
}

export function BrandMaturityForm({ data, onChange }: BrandMaturityFormProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Intro text */}
      <div className="bg-abstrakt-card border-l-4 border-abstrakt-orange rounded-lg p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🏆</span>
          <div>
            <h3 className="section-header text-lg mb-2">Brand Maturity Assessment</h3>
            <p className="text-abstrakt-text-muted leading-relaxed">
              AI search engines don't just index content—they learn which brands are trusted and mentioned frequently.
              Your brand maturity directly impacts how often AI platforms cite you in responses.
            </p>
          </div>
        </div>
      </div>

      {/* Brand Recognition */}
      <div className="abstrakt-card p-6">
        <h3 className="section-header text-base mb-2">Brand Recognition Level</h3>
        <p className="text-abstrakt-text-muted text-sm mb-6">
          How well-known is your company in your industry?
        </p>
        <div className="space-y-3">
          {BRAND_RECOGNITION_OPTIONS.map(option => (
            <label
              key={option.value}
              className={`radio-card ${data.brandRecognition === option.value ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="brandRecognition"
                value={option.value}
                checked={data.brandRecognition === option.value}
                onChange={(e) => onChange({ brandRecognition: e.target.value as typeof data.brandRecognition })}
              />
              <div className="flex items-center gap-3 w-full">
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                  ${data.brandRecognition === option.value 
                    ? 'border-abstrakt-orange bg-abstrakt-orange' 
                    : 'border-abstrakt-input-border'
                  }
                `}>
                  {data.brandRecognition === option.value && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1">
                  <span className={`font-medium ${data.brandRecognition === option.value ? 'text-white' : 'text-abstrakt-text'}`}>
                    {option.value.charAt(0).toUpperCase() + option.value.slice(1)}
                  </span>
                  <p className="text-sm text-abstrakt-text-dim mt-0.5">
                    {option.label.replace(`${option.value.charAt(0).toUpperCase() + option.value.slice(1)} `, '')}
                  </p>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Branded Search Volume */}
      <div className="abstrakt-card p-6">
        <h3 className="section-header text-base mb-2">Branded Search Volume</h3>
        <p className="text-abstrakt-text-muted text-sm mb-6">
          Do people search for your company name directly? This is a key signal of brand demand.
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { value: 'yes', label: 'Yes', description: 'We see branded searches in our analytics' },
            { value: 'no', label: 'No', description: 'Very little or no branded search' },
            { value: 'unknown', label: 'Unknown', description: 'Not sure / haven\'t checked' },
          ].map(option => (
            <label
              key={option.value}
              className={`radio-card flex-col items-start p-4 ${data.existingBrandedSearch === option.value ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="existingBrandedSearch"
                value={option.value}
                checked={data.existingBrandedSearch === option.value}
                onChange={(e) => onChange({ existingBrandedSearch: e.target.value as typeof data.existingBrandedSearch })}
              />
              <div className="flex items-center gap-2 mb-2">
                <div className={`
                  w-4 h-4 rounded-full border-2 flex items-center justify-center
                  ${data.existingBrandedSearch === option.value 
                    ? 'border-abstrakt-orange bg-abstrakt-orange' 
                    : 'border-abstrakt-input-border'
                  }
                `}>
                  {data.existingBrandedSearch === option.value && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className={`font-medium ${data.existingBrandedSearch === option.value ? 'text-white' : 'text-abstrakt-text'}`}>
                  {option.label}
                </span>
              </div>
              <p className="text-xs text-abstrakt-text-dim pl-6">
                {option.description}
              </p>
            </label>
          ))}
        </div>
      </div>

      {/* Competitor Awareness */}
      <div className="abstrakt-card p-6">
        <h3 className="section-header text-base mb-2">Market Awareness of Competitors</h3>
        <p className="text-abstrakt-text-muted text-sm mb-6">
          How aware is your target market of your competitors? Higher awareness = more competition for AI citations.
        </p>
        <div className="space-y-3">
          {[
            { value: 'low', label: 'Low', description: 'Few direct competitors, niche market, or competitors aren\'t well-known' },
            { value: 'moderate', label: 'Moderate', description: 'Some known competitors, but market isn\'t dominated by big brands' },
            { value: 'high', label: 'High', description: 'Well-funded competitors with strong brand presence in the market' },
          ].map(option => (
            <label
              key={option.value}
              className={`radio-card ${data.competitorAwareness === option.value ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="competitorAwareness"
                value={option.value}
                checked={data.competitorAwareness === option.value}
                onChange={(e) => onChange({ competitorAwareness: e.target.value as typeof data.competitorAwareness })}
              />
              <div className="flex items-center gap-3 w-full">
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                  ${data.competitorAwareness === option.value 
                    ? 'border-abstrakt-orange bg-abstrakt-orange' 
                    : 'border-abstrakt-input-border'
                  }
                `}>
                  {data.competitorAwareness === option.value && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1">
                  <span className={`font-medium ${data.competitorAwareness === option.value ? 'text-white' : 'text-abstrakt-text'}`}>
                    {option.label}
                  </span>
                  <p className="text-sm text-abstrakt-text-dim mt-0.5">
                    {option.description}
                  </p>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* AI Search explainer */}
      <div className="bg-gradient-to-r from-abstrakt-card to-abstrakt-input rounded-lg p-6 border border-abstrakt-card-border">
        <h4 className="text-abstrakt-orange font-semibold mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How Brand Signals Affect AI Search
        </h4>
        <p className="text-abstrakt-text-muted text-sm leading-relaxed">
          When someone asks ChatGPT or Perplexity for a recommendation in your industry, these AI models draw on patterns from their training data. 
          Brands that are frequently mentioned, discussed, and searched for are more likely to be cited. 
          <span className="text-abstrakt-orange"> Paid media creates the brand awareness that generates these signals.</span>
        </p>
      </div>
    </div>
  );
}
