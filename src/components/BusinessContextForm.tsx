'use client';

import { BusinessContextData } from '@/lib/types';

interface BusinessContextFormProps {
  data: BusinessContextData;
  onChange: (data: Partial<BusinessContextData>) => void;
}

const COMPANY_SIZES = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501+', label: '500+ employees' },
];

const ROLES = [
  { value: 'owner', label: 'Owner' },
  { value: 'director', label: 'Director' },
  { value: 'manager', label: 'Manager' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'other', label: 'Other' },
];

export function BusinessContextForm({ data, onChange }: BusinessContextFormProps) {
  // Show additional fields after website URL is entered
  const showAdditionalFields = data.websiteUrl.trim() !== '';

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-white mb-2">
          Tell Us About You
        </h2>
        <p className="text-abstrakt-text-muted">
          Enter your company details to get started.
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

        {/* Additional fields revealed after URL is entered */}
        {showAdditionalFields && (
          <div className="space-y-6 animate-fade-in">
            {/* Email */}
            <div>
              <label className="block text-sm text-abstrakt-text-muted mb-2">
                Work Email <span className="text-abstrakt-orange">*</span>
              </label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => onChange({ email: e.target.value })}
                placeholder="you@company.com"
                className="abstrakt-input"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm text-abstrakt-text-muted mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="First and last name"
                className="abstrakt-input"
              />
            </div>

            {/* Two column grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Company Size */}
              <div>
                <label className="block text-sm text-abstrakt-text-muted mb-2">
                  Company Size
                </label>
                <select
                  value={data.companySize}
                  onChange={(e) => onChange({ companySize: e.target.value })}
                  className="abstrakt-input"
                >
                  <option value="">Select size (optional)</option>
                  {COMPANY_SIZES.map(size => (
                    <option key={size.value} value={size.value}>{size.label}</option>
                  ))}
                </select>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm text-abstrakt-text-muted mb-2">
                  Your Role
                </label>
                <select
                  value={data.role}
                  onChange={(e) => onChange({ role: e.target.value })}
                  className="abstrakt-input"
                >
                  <option value="">Select role (optional)</option>
                  {ROLES.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
