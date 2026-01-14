'use client';

import { useState } from 'react';
import { LeadCaptureData } from '@/lib/types';

interface LeadCaptureFormProps {
  onSubmit: (data: LeadCaptureData) => void;
  companyName: string;
}

const COMPANY_SIZES = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501+', label: '500+ employees' },
];

const ROLES = [
  { value: 'founder', label: 'Founder / CEO' },
  { value: 'marketing', label: 'Marketing Leader' },
  { value: 'sales', label: 'Sales Leader' },
  { value: 'operations', label: 'Operations' },
  { value: 'other', label: 'Other' },
];

export function LeadCaptureForm({ onSubmit, companyName }: LeadCaptureFormProps) {
  const [formData, setFormData] = useState<LeadCaptureData>({
    email: '',
    companySize: '',
    role: '',
    wantsCall: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(formData);
  };

  const isValid = formData.email.trim() !== '' && formData.email.includes('@');

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">📊</div>
        <h2 className="text-2xl font-heading font-bold text-white mb-2">
          Your Analysis is Ready!
        </h2>
        <p className="text-abstrakt-text-muted">
          Enter your email to unlock your personalized brand lift strategy for {companyName}.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="abstrakt-card p-6 space-y-6">
        {/* Email - Required */}
        <div>
          <label className="block text-sm text-abstrakt-text-muted mb-2">
            Work Email <span className="text-abstrakt-orange">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="you@company.com"
            className="abstrakt-input"
            required
          />
        </div>

        {/* Company Size - Optional */}
        <div>
          <label className="block text-sm text-abstrakt-text-muted mb-2">
            Company Size
          </label>
          <select
            value={formData.companySize}
            onChange={(e) => setFormData(prev => ({ ...prev, companySize: e.target.value }))}
            className="abstrakt-input"
          >
            <option value="">Select size (optional)</option>
            {COMPANY_SIZES.map(size => (
              <option key={size.value} value={size.value}>{size.label}</option>
            ))}
          </select>
        </div>

        {/* Role - Optional */}
        <div>
          <label className="block text-sm text-abstrakt-text-muted mb-2">
            Your Role
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
            className="abstrakt-input"
          >
            <option value="">Select role (optional)</option>
            {ROLES.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
        </div>

        {/* Wants Call - Checkbox */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-1">
              <input
                type="checkbox"
                checked={formData.wantsCall}
                onChange={(e) => setFormData(prev => ({ ...prev, wantsCall: e.target.checked }))}
                className="sr-only"
              />
              <div className={`
                w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                ${formData.wantsCall 
                  ? 'bg-abstrakt-orange border-abstrakt-orange' 
                  : 'border-abstrakt-input-border group-hover:border-abstrakt-orange'
                }
              `}>
                {formData.wantsCall && (
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`w-full abstrakt-button text-lg py-4 ${(!isValid || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="spinner w-5 h-5" />
              Generating Analysis...
            </span>
          ) : (
            'Unlock My Analysis →'
          )}
        </button>

        <p className="text-xs text-abstrakt-text-dim text-center">
          By submitting, you agree to receive marketing communications from Abstrakt Marketing Group.
          You can unsubscribe at any time.
        </p>
      </form>
    </div>
  );
}
