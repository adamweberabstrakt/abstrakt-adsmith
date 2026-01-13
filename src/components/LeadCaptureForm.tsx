'use client';

import { useState } from 'react';
import { LeadCaptureData } from '@/lib/types';

interface LeadCaptureFormProps {
  onSubmit: (data: LeadCaptureData) => void;
  isLoading: boolean;
}

export function LeadCaptureForm({ onSubmit, isLoading }: LeadCaptureFormProps) {
  const [formData, setFormData] = useState<LeadCaptureData>({
    email: '',
    companySize: '',
    role: '',
    wantsCall: false,
  });
  const [errors, setErrors] = useState<{ email?: string }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(formData.email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }
    
    setErrors({});
    onSubmit(formData);
  };

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-abstrakt-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-abstrakt-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-heading font-bold text-white mb-2">
          Your Analysis is Ready
        </h2>
        <p className="text-abstrakt-text-muted">
          Enter your email to receive your personalized Brand Lift report
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
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) setErrors({});
            }}
            placeholder="you@company.com"
            className={`abstrakt-input ${errors.email ? 'border-abstrakt-error' : ''}`}
            required
          />
          {errors.email && (
            <p className="text-abstrakt-error text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Optional fields */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-abstrakt-text-muted mb-2">
              Company Size
            </label>
            <select
              value={formData.companySize}
              onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
              className="abstrakt-input"
            >
              <option value="">Select size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="500+">500+ employees</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-abstrakt-text-muted mb-2">
              Your Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="abstrakt-input"
            >
              <option value="">Select role</option>
              <option value="CEO/Founder">CEO / Founder</option>
              <option value="CMO/VP Marketing">CMO / VP Marketing</option>
              <option value="Marketing Manager">Marketing Manager</option>
              <option value="Marketing Coordinator">Marketing Coordinator</option>
              <option value="Sales Leadership">Sales Leadership</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Strategy call checkbox */}
        <div className="bg-abstrakt-input rounded-lg p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="mt-0.5">
              <input
                type="checkbox"
                checked={formData.wantsCall}
                onChange={(e) => setFormData({ ...formData, wantsCall: e.target.checked })}
                className="sr-only"
              />
              <div className={`
                w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                ${formData.wantsCall 
                  ? 'bg-abstrakt-orange border-abstrakt-orange' 
                  : 'border-abstrakt-input-border hover:border-abstrakt-orange'
                }
              `}>
                {formData.wantsCall && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <span className="text-white font-medium">I'd like a free strategy call</span>
              <p className="text-abstrakt-text-dim text-sm mt-1">
                Discuss implementation with a paid media strategist (30 min, no obligation)
              </p>
            </div>
          </label>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full abstrakt-button py-4 text-lg
            ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
          `}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <div className="spinner w-5 h-5" />
              Generating Your Report...
            </span>
          ) : (
            'Get My Brand Lift Report'
          )}
        </button>

        <p className="text-center text-xs text-abstrakt-text-dim">
          We respect your privacy. Your data will only be used to deliver your report.
        </p>
      </form>
    </div>
  );
}
