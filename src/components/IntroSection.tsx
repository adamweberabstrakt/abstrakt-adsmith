'use client';

import Image from 'next/image';

interface IntroSectionProps {
  onStartAssessment: () => void;
}

export function IntroSection({ onStartAssessment }: IntroSectionProps) {
  return (
    <div className="space-y-10 animate-fade-in max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">
          AdSmith Brand Lift Radar
        </h1>
        <p className="text-xl text-abstrakt-orange font-medium">
          Discover how branded paid media drives AI Search visibility
        </p>
        <div className="bg-abstrakt-card/50 border border-abstrakt-card-border rounded-lg p-4 mt-6 max-w-2xl mx-auto">
          <p className="text-sm text-abstrakt-text-muted leading-relaxed">
            <span className="text-abstrakt-orange font-semibold">⚠️ AI-Powered Analysis:</span> This tool provides directional insights to help inform your brand lift strategy. Results are generated using AI and should be used as a starting point for discussion with your marketing team—not as definitive recommendations.
          </p>
        </div>
      </div>

      {/* Infographic Image */}
      <div className="rounded-xl overflow-hidden border border-abstrakt-card-border shadow-lg">
        <Image
          src="/images/ai-search-explainer.png"
          alt="How AI Search Really Works: From Query to Answer - Infographic explaining the fan-out, retrieval, and synthesis process"
          width={1600}
          height={900}
          className="w-full h-auto"
          priority
        />
      </div>

      {/* What This Assessment Will Do */}
      <div className="abstrakt-card p-8">
        <h2 className="text-2xl font-heading font-bold text-white mb-4">
          What This Free Assessment Will Do
        </h2>
        <p className="text-abstrakt-text-muted leading-relaxed mb-6">
          In just a few minutes, you&apos;ll receive a personalized analysis that evaluates your brand&apos;s current market position and provides actionable recommendations for improving visibility in both traditional and AI-powered search—completely free.
        </p>
        
        <h3 className="text-lg font-semibold text-white mb-4">Your assessment will include:</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-abstrakt-orange mt-1 flex-shrink-0">📊</span>
            <div>
              <span className="text-white font-medium">Brand position analysis</span>
              <span className="text-abstrakt-text-muted"> — See how your brand awareness compares to competitors</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-abstrakt-orange mt-1 flex-shrink-0">💰</span>
            <div>
              <span className="text-white font-medium">Budget recommendations</span>
              <span className="text-abstrakt-text-muted"> — Get conservative and aggressive spend scenarios tailored to your goals</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-abstrakt-orange mt-1 flex-shrink-0">✍️</span>
            <div>
              <span className="text-white font-medium">Ad messaging angles</span>
              <span className="text-abstrakt-text-muted"> — Receive AI-generated headlines and copy directions to test</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-abstrakt-orange mt-1 flex-shrink-0">🤖</span>
            <div>
              <span className="text-white font-medium">AI search visibility factors</span>
              <span className="text-abstrakt-text-muted"> — Understand what&apos;s helping or hurting your discoverability</span>
            </div>
          </li>
        </ul>
      </div>

      {/* Why Brand Lift Matters */}
      <div className="abstrakt-card p-8 border-l-4 border-abstrakt-orange">
        <h2 className="text-2xl font-heading font-bold text-white mb-4">
          Why Brand Lift Matters for AI Search
        </h2>
        <p className="text-abstrakt-text-muted leading-relaxed mb-6">
          AI search engines like ChatGPT, Perplexity, and Google AI Overviews don&apos;t just index content—they evaluate brand authority signals. Here&apos;s how brand lift advertising creates a flywheel effect:
        </p>
        
        <div className="space-y-4">
          <div className="flex items-start gap-4 bg-abstrakt-input rounded-lg p-4">
            <div className="w-8 h-8 rounded-full bg-abstrakt-orange/20 flex items-center justify-center flex-shrink-0">
              <span className="text-abstrakt-orange font-bold text-sm">1</span>
            </div>
            <div>
              <span className="text-white font-medium">Brand lift ads increase branded search volume</span>
              <p className="text-sm text-abstrakt-text-muted mt-1">When people see your ads, they search for your company by name</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 bg-abstrakt-input rounded-lg p-4">
            <div className="w-8 h-8 rounded-full bg-abstrakt-orange/20 flex items-center justify-center flex-shrink-0">
              <span className="text-abstrakt-orange font-bold text-sm">2</span>
            </div>
            <div>
              <span className="text-white font-medium">Branded searches signal authority to search engines</span>
              <p className="text-sm text-abstrakt-text-muted mt-1">High branded search volume tells algorithms your brand is recognized and trusted</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 bg-abstrakt-input rounded-lg p-4">
            <div className="w-8 h-8 rounded-full bg-abstrakt-orange/20 flex items-center justify-center flex-shrink-0">
              <span className="text-abstrakt-orange font-bold text-sm">3</span>
            </div>
            <div>
              <span className="text-white font-medium">Search engines feed AI models</span>
              <p className="text-sm text-abstrakt-text-muted mt-1">LLMs pull from top-ranked content, and brands with strong search signals get cited more often</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 bg-abstrakt-input rounded-lg p-4">
            <div className="w-8 h-8 rounded-full bg-abstrakt-orange/20 flex items-center justify-center flex-shrink-0">
              <span className="text-abstrakt-orange font-bold text-sm">4</span>
            </div>
            <div>
              <span className="text-white font-medium">AI visibility drives more branded searches</span>
              <p className="text-sm text-abstrakt-text-muted mt-1">When AI recommends you, it reinforces the cycle</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center space-y-4 pb-8">
        <button
          onClick={onStartAssessment}
          className="abstrakt-button text-xl px-12 py-5 font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          Start Assessment
        </button>
        
        {/* Abstrakt Attribution */}
        <p className="text-xs text-abstrakt-text-dim">
          This free assessment is provided by{' '}
          <a 
            href="https://www.abstraktmg.com/digital-marketing-services/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-abstrakt-orange hover:underline"
          >
            Abstrakt
          </a>
        </p>
      </div>
    </div>
  );
}
