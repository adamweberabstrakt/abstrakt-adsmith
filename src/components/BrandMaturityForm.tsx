'use client';

import { BrandMaturityData } from '@/lib/types';

interface BrandMaturityFormProps {
  data: BrandMaturityData;
  onChange: (data: Partial<BrandMaturityData>) => void;
}

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

export function BrandMaturityForm({ data, onChange }: BrandMaturityFormProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-white mb-2">
          Brand Maturity
        </h2>
        <p className="text-abstrakt-text-muted">
          Help us assess your current brand strength and market position.
        </p>
      </div>

      <div className="abstrakt-card p-6 space-y-8">
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
                  ${data.brandRecognition === level.value
                    ? 'bg-abstrakt-orange/20 border-abstrakt-orange'
                    : 'bg-abstrakt-input border-abstrakt-input-border hover:border-abstrakt-orange/50'
                  }
                `}
              >
                <input
                  type="radio"
                  name="brandRecognition"
                  value={level.value}
                  checked={data.brandRecognition === level.value}
                  onChange={(e) => onChange({ brandRecognition: e.target.value as BrandMaturityData['brandRecognition'] })}
                  className="sr-only"
                />
                <span className={`font-semibold ${data.brandRecognition === level.value ? 'text-white' : 'text-abstrakt-text-muted'}`}>
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
            value={data.existingBrandedSearch}
            onChange={(e) => onChange({ existingBrandedSearch: e.target.value as BrandMaturityData['existingBrandedSearch'] })}
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
                  ${data.competitorAwareness === level.value
                    ? 'bg-abstrakt-orange/20 border-abstrakt-orange'
                    : 'bg-abstrakt-input border-abstrakt-input-border hover:border-abstrakt-orange/50'
                  }
                `}
              >
                <input
                  type="radio"
                  name="competitorAwareness"
                  value={level.value}
                  checked={data.competitorAwareness === level.value}
                  onChange={(e) => onChange({ competitorAwareness: e.target.value as BrandMaturityData['competitorAwareness'] })}
                  className="sr-only"
                />
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                  ${data.competitorAwareness === level.value 
                    ? 'border-abstrakt-orange bg-abstrakt-orange' 
                    : 'border-abstrakt-input-border'
                  }
                `}>
                  {data.competitorAwareness === level.value && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div>
                  <span className={`font-semibold ${data.competitorAwareness === level.value ? 'text-white' : 'text-abstrakt-text-muted'}`}>
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
    </div>
  );
}
