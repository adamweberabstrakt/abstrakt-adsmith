'use client';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 60 50" 
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stylized wing/checkmark shape */}
      <path 
        d="M10 35L25 20L40 35L55 10" 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
      <path 
        d="M5 40L20 25L35 40L50 15" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        opacity="0.5"
        fill="none"
      />
    </svg>
  );
}

export function BrandHeader() {
  return (
    <header className="text-center py-8 px-4">
      <div className="flex items-center justify-center gap-4 mb-3">
        <Logo className="w-14 h-12 text-abstrakt-orange" />
        <div className="text-left">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-abstrakt-orange tracking-wider">
            ABSTRAKT BRAND LIFT SIMULATOR
          </h1>
          <p className="text-xs md:text-sm text-abstrakt-text-muted tracking-widest uppercase">
            AI Search Visibility • Media Planning • Brand Strategy
          </p>
        </div>
      </div>
    </header>
  );
}
