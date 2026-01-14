'use client';

import { MarketingStateData } from '@/lib/types';

interface MarketingStateFormProps {
  data: MarketingStateData;
  onChange: (data: Partial<MarketingStateData>) => void;
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

export function MarketingStateForm({ data, onChange }: MarketingStateFormProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-white mb-2">
          Current Marketing State
        </h2>
        <p className="text-abstrakt-text-muted">
          Help us understand your current marketing investments and goals.
        </p>
      </div>

      <div className="abstrakt-card p-6 space-y-6">
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
                value={data.monthlySeoBudget || ''}
                onChange={(e) => onChange({ monthlySeoBudget: e.target.value ? Number(e.target.value) : null })}
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
                value={data.monthlyPaidMediaBudget || ''}
                onChange={(e) => onChange({ monthlyPaidMediaBudget: e.target.value ? Number(e.target.value) : null })}
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
                  ${data.primaryGoal === goal.value
                    ? 'bg-abstrakt-orange/20 border-abstrakt-orange'
                    : 'bg-abstrakt-input border-abstrakt-input-border hover:border-abstrakt-orange/50'
                  }
                `}
              >
                <input
                  type="radio"
                  name="primaryGoal"
                  value={goal.value}
                  checked={data.primaryGoal === goal.value}
                  onChange={(e) => onChange({ primaryGoal: e.target.value as MarketingStateData['primaryGoal'] })}
                  className="sr-only"
                />
                <span className={`font-semibold ${data.primaryGoal === goal.value ? 'text-white' : 'text-abstrakt-text-muted'}`}>
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
            value={data.declineExperienced}
            onChange={(e) => onChange({ declineExperienced: e.target.value as MarketingStateData['declineExperienced'] })}
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
    </div>
  );
}
