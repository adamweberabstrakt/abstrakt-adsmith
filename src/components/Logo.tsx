'use client';

import Image from 'next/image';

export function BrandHeader() {
  return (
    <header className="text-center py-8 px-4">
      <div className="flex flex-col items-center justify-center gap-4 mb-3">
        {/* Abstrakt Logo */}
        <Image
          src="/abstrakt-logo.png"
          alt="Abstrakt Marketing Group"
          width={280}
          height={70}
          className="h-auto"
          priority
        />
        
        {/* App Name and Tagline */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white tracking-wider">
            ADSMITH
          </h1>
          <p className="text-sm md:text-base text-abstrakt-orange tracking-widest uppercase mt-1">
            Brand Lift Radar
          </p>
        </div>
      </div>
    </header>
  );
}
