'use client';

import { BusinessContextInputs, INDUSTRIES, SALES_CYCLES, GEOGRAPHIC_OPTIONS } from '@/lib/types';

interface BusinessContextFormProps {
  data: BusinessContextInputs;
  onChange: (data: Partial<BusinessContextInputs>) => void;
}

export function BusinessContextForm({ data, onChange }: BusinessContextFormProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Intro text */}
      <div className="bg-abstrakt-card border-l-4 border-abstrakt-orange rounded-lg p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🎯</span>
          <div>
            <h3 className="section-header text-lg mb-2">Why This Matters</h3>
            <p className="text-abstrakt-text-muted leading-relaxed">
              AI Search engines like ChatGPT, Perplexity, and Google's AI Overviews are changing how buyers find solutions. 
              Your business context helps us understand how paid media can build the <span className="text-abstrakt-orange font-medium">brand signals</span> these platforms reward.
            </p>
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div className="abstrakt-card p-6">
        <h3 className="section-header text-base mb-6">Company Information</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Company Name */}
          <div>
            <label className="block text-sm text-abstrakt-text-muted mb-2">
              Company Name <span className="text-abstrakt-orange">*</span>
            </label>
            <input
              type="text"
              value={data.companyName}
              onChange={(e) => onChange({ companyName: e.target.value })}
              placeholder="e.g., Acme Industries"
              className="abstrakt-input"
              required
            />
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm text-abstrakt-text-muted mb-2">
              Industry <span className="text-abstrakt-orange">*</span>
            </label>
            <select
              value={data.industry}
              onChange={(e) => onChange({ industry: e.target.value })}
              className="abstrakt-input"
              required
            >
              <option value="">Select your industry</option>
              {INDUSTRIES.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          {/* Average Deal Size */}
          <div>
            <label className="block text-sm text-abstrakt-text-muted mb-2">
              Average Deal Size
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-abstrakt-text-dim">$</span>
              <input
                type="number"
                value={data.averageDealSize || ''}
                onChange={(e) => onChange({ averageDealSize: e.target.value ? Number(e.target.value) : null })}
                placeholder="50,000"
                className="abstrakt-input pl-8"
              />
            </div>
            <p className="text-xs text-abstrakt-text-dim mt-1">Leave blank if you're unsure—we can estimate</p>
          </div>

          {/* Sales Cycle */}
          <div>
            <label className="block text-sm text-abstrakt-text-muted mb-2">
              Sales Cycle Length
            </label>
            <select
              value={data.salesCycleLength}
              onChange={(e) => onChange({ salesCycleLength: e.target.value })}
              className="abstrakt-input"
            >
              <option value="">Select sales cycle</option>
              {SALES_CYCLES.map(cycle => (
                <option key={cycle.value} value={cycle.value}>{cycle.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Geographic Focus - Full width radio cards */}
        <div className="mt-6">
          <label className="block text-sm text-abstrakt-text-muted mb-3">
            Geographic Focus
          </label>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {GEOGRAPHIC_OPTIONS.map(option => (
              <label
                key={option.value}
                className={`radio-card ${data.geographicFocus === option.value ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="geographicFocus"
                  value={option.value}
                  checked={data.geographicFocus === option.value}
                  onChange={(e) => onChange({ geographicFocus: e.target.value as typeof data.geographicFocus })}
                />
                <div className="flex items-center gap-3">
                  <div className={`
                    w-4 h-4 rounded-full border-2 flex items-center justify-center
                    ${data.geographicFocus === option.value 
                      ? 'border-abstrakt-orange bg-abstrakt-orange' 
                      : 'border-abstrakt-input-border'
                    }
                  `}>
                    {data.geographicFocus === option.value && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className={data.geographicFocus === option.value ? 'text-white' : 'text-abstrakt-text-muted'}>
                    {option.label}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
