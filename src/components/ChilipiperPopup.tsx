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
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-abstrakt-card-border bg-abstrakt-bg">
          <div>
            <h3 className="text-lg font-heading font-bold text-white">Schedule a Meeting</h3>
            <p className="text-sm text-abstrakt-text-muted">Pick a time that works for you</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-abstrakt-input transition-colors text-abstrakt-text-muted hover:text-white"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Iframe Container */}
        <div className="relative" style={{ height: '600px' }}>
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
