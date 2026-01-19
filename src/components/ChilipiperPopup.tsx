'use client';

import { useEffect, useRef } from 'react';

interface ChilipiperPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CHILIPIPER_URL = 'https://abstraktmg.chilipiper.com/round-robin/inbound-sdr';

export function ChilipiperPopup({ isOpen, onClose }: ChilipiperPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Close on click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div
        ref={popupRef}
        className="relative w-full max-w-2xl bg-abstrakt-card rounded-xl shadow-2xl border border-abstrakt-card-border overflow-hidden"
        style={{ maxHeight: '90vh' }}
      >
        {/* Header with new explanatory text */}
        <div className="p-6 border-b border-abstrakt-card-border bg-gradient-to-r from-abstrakt-orange/10 to-transparent">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h3 className="text-xl font-heading font-bold text-white mb-2">
                Want to learn more about your brand lift results?
              </h3>
              <p className="text-abstrakt-text-muted">
                Schedule a call with our team to review your AI assessment and discover how to improve your AI Search visibility and brand positioning.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-abstrakt-input transition-colors text-abstrakt-text-muted hover:text-white flex-shrink-0"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Iframe Container */}
        <div className="relative" style={{ height: '550px' }}>
          <iframe
            src={CHILIPIPER_URL}
            title="Schedule a Meeting"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-abstrakt-card-border bg-abstrakt-bg text-center">
          <button
            onClick={onClose}
            className="text-sm text-abstrakt-text-muted hover:text-white transition-colors"
          >
            I&apos;ll schedule later
          </button>
        </div>
      </div>
    </div>
  );
}
