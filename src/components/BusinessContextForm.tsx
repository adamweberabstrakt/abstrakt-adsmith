'use client';

import { BusinessContextData } from '@/lib/types';

interface BusinessContextFormProps {
  data: BusinessContextData;
  onChange: (data: Partial<BusinessContextData>) => void;
}

const INDUSTRIES = [
  'Accounting',
  'Architecture',
  'Automotive',
  'B2B SaaS',
  'Cleaning',
  'Commercial Printing',
  'Construction',
  'Consulting',
  'Cybersecurity',
  'E-commerce',
  'Education',
  'Electrical Services',
  'Engineering Services',
  'Environmental Services',
  'Event Management',
  'Facilities Management',
  'Finance',
  'Financial Services',
  'Fleet Management',
  'Flooring',
  'Healthcare',
  'HVAC',
  'Industrial Equipment',
  'Insurance',
  'Janitorial Services',
  'Landscaping',
  'LED Lighting',
  'Legal Services',
  'Logistics & Supply Chain',
  'Managed Services (IT)',
  'Manufacturing',
  'Marketing Services',
  'Merchant Services',
  'Outsourced HR',
  'Painting',
  'Paving',
  'Pest Control',
  'Plumbing',
  'Professional Services',
  'Property Management',
  'Real Estate',
  'Roofing',
  'Security Services',
  'Solar',
  'Staffing & Recruiting',
  'Technology',
  'Telecom',
  'Training & Development',
  'Warehousing & Distribution',
  'Waste Management',
  'Other',
];

const SALES_CYCLES = [
  { value: 'short', label: 'Short (< 30 days)' },
  { value: 'medium', label: 'Medium (1-3 months)' },
  { value: 'long', label: 'Long (3-6 months)' },
  { value: 'enterprise', label: 'Enterprise (6+ months)' },
];

const GEOGRAPHIC_OPTIONS = [
  { value: 'local', label: 'Local' },
  { value: 'regional', label: 'Regional' },
  { value: 'national', label: 'National' },
  { value: 'international', label: 'International' },
];

export function BusinessContextForm({ data, onChange }: BusinessContextFormProps) {
  const updateCompetitorUrl = (index: number, value: string) => {
    const newUrls = [...data.competitorUrls];
    newUrls[index] = value;
    onChange({ competitorUrls: newUrls });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-white mb-2">
          Tell Us About Your Business
        </h2>
        <p className="text-abstrakt-text-muted">
          Help us understand your company to provide personalized recommendations.
        </p>
      </div>

      <div className="abstrakt-card p-6 space-y-6">
        {/* Company Name */}
        <div>
          <label className="block text-sm text-abstrakt-text-muted mb-2">
            Company Name <span className="text-abstrakt-orange">*</span>
          </label>
          <input
            type="text"
            value={data.companyName}
            onChange={(e) => onChange({ companyName: e.target.value })}
            placeholder="Enter your company name"
            className="abstrakt-input"
          />
        </div>

        {/* Website URL */}
        <div>
          <label className="block text-sm text-abstrakt-text-muted mb-2">
            Website URL <span className="text-abstrakt-orange">*</span>
          </label>
          <input
            type="url"
            value={data.websiteUrl}
            onChange={(e) => onChange({ websiteUrl: e.target.value })}
            placeholder="https://yourcompany.com"
            className="abstrakt-input"
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
          >
            <option value="">Select your industry</option>
            {INDUSTRIES.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        {/* Two column grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Average Deal Size */}
          <div>
            <label className="block text-sm text-abstrakt-text-muted mb-2">
              Average Deal Size
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-abstrakt-text-dim">$</span>
              <input
                type="number"
                value={data.averageDealSize || ''}
                onChange={(e) => onChange({ averageDealSize: e.target.value ? Number(e.target.value) : null })}
                placeholder="50000"
                className="abstrakt-input pl-7"
              />
            </div>
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
              <option value="">Select cycle length</option>
              {SALES_CYCLES.map((cycle) => (
                <option key={cycle.value} value={cycle.value}>
                  {cycle.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Geographic Focus */}
        <div>
          <label className="block text-sm text-abstrakt-text-muted mb-2">
            Geographic Focus
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {GEOGRAPHIC_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`
                  flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all border
                  ${data.geographicFocus === option.value
                    ? 'bg-abstrakt-orange/20 border-abstrakt-orange text-white'
                    : 'bg-abstrakt-input border-abstrakt-input-border text-abstrakt-text-muted hover:border-abstrakt-orange/50'
                  }
                `}
              >
                <input
                  type="radio"
                  name="geographicFocus"
                  value={option.value}
                  checked={data.geographicFocus === option.value}
                  onChange={(e) => onChange({ geographicFocus: e.target.value as BusinessContextData['geographicFocus'] })}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Competitor Analysis Section */}
      <div className="abstrakt-card p-6 space-y-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-white mb-1">
            Competitor Analysis
          </h3>
          <p className="text-sm text-abstrakt-text-dim">
            Add competitor URLs to enhance your analysis with SEMRush data (optional)
          </p>
        </div>

        <div className="space-y-4">
          {[0, 1, 2].map((index) => (
            <div key={index}>
              <label className="block text-sm text-abstrakt-text-muted mb-2">
                Competitor {index + 1} URL
              </label>
              <input
                type="url"
                value={data.competitorUrls[index] || ''}
                onChange={(e) => updateCompetitorUrl(index, e.target.value)}
                placeholder="https://competitor.com"
                className="abstrakt-input"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Custom Ad Angle Section */}
      <div className="abstrakt-card p-6 space-y-4">
        <div>
          <h3 className="text-lg font-heading font-semibold text-white mb-1">
            Your Unique Value
          </h3>
          <p className="text-sm text-abstrakt-text-dim">
            What makes your company different? This will help us craft better ad angles.
          </p>
        </div>

        <div>
          <label className="block text-sm text-abstrakt-text-muted mb-2">
            Custom Ad Angle / Value Proposition
          </label>
          <textarea
            value={data.customAdAngle || ''}
            onChange={(e) => onChange({ customAdAngle: e.target.value })}
            placeholder="e.g., We're the only platform that combines AI-powered analytics with human expertise..."
            rows={3}
            className="abstrakt-input resize-none"
          />
        </div>
      </div>
    </div>
  );
}
