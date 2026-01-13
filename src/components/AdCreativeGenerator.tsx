'use client';

import { useState, useEffect } from 'react';
import { FormData, AnalysisResult, AdAngle } from '@/lib/types';

interface AdCreativeGeneratorProps {
  formData: FormData;
  analysis: AnalysisResult;
}

type ImageStyle = 'professional' | 'bold' | 'minimal' | 'tech';
type ImageProvider = 'dalle3' | 'flux' | 'imagen';

interface GeneratedImage {
  angleIndex: number;
  style: ImageStyle;
  url: string;
  provider: string;
}

interface ProviderInfo {
  name: string;
  source: string;
  cost: string;
}

export function AdCreativeGenerator({ formData, analysis }: AdCreativeGeneratorProps) {
  const [selectedAngle, setSelectedAngle] = useState<number>(0);
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>('professional');
  const [selectedProvider, setSelectedProvider] = useState<ImageProvider>('flux');
  const [availableProviders, setAvailableProviders] = useState<ImageProvider[]>([]);
  const [providerDetails, setProviderDetails] = useState<Record<ImageProvider, ProviderInfo>>({
    dalle3: { name: 'DALL-E 3', source: 'OpenAI', cost: '~$0.04/image' },
    flux: { name: 'Flux Schnell', source: 'Replicate', cost: '~$0.003/image' },
    imagen: { name: 'Imagen 3', source: 'Google via Replicate', cost: '~$0.03/image' },
  });
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const { messagingRecommendation } = analysis;
  const { businessContext } = formData;
  const currentAngle = messagingRecommendation.adAngles[selectedAngle];

  // Fetch available providers on mount
  useEffect(() => {
    async function checkProviders() {
      try {
        const response = await fetch('/api/generate-image');
        const data = await response.json();
        if (data.availableProviders?.length > 0) {
          setAvailableProviders(data.availableProviders);
          setSelectedProvider(data.availableProviders[0]);
          if (data.providerDetails) {
            setProviderDetails(data.providerDetails);
          }
        }
      } catch (err) {
        console.error('Failed to check providers:', err);
      }
    }
    checkProviders();
  }, []);

  const styleOptions: { value: ImageStyle; label: string; description: string }[] = [
    { value: 'professional', label: 'Professional', description: 'Clean, corporate, trustworthy' },
    { value: 'bold', label: 'Bold', description: 'Vibrant, energetic, startup' },
    { value: 'minimal', label: 'Minimal', description: 'Elegant, refined, Apple-like' },
    { value: 'tech', label: 'Tech', description: 'Dark mode, futuristic, innovative' },
  ];

  // Build Pomelli prompt
  const buildPomelliPrompt = (angle: AdAngle): string => {
    return `Create a ${businessContext.industry} B2B advertisement with these specifications:

HEADLINE: ${angle.headline}
SUBHEADLINE: ${angle.subheadline}
VALUE PROPOSITION: ${angle.valueProposition}
CALL TO ACTION: ${angle.ctaText}

BRAND: ${businessContext.companyName}
INDUSTRY: ${businessContext.industry}
TARGET AUDIENCE: B2B decision makers, ${angle.targetFunnelStage} stage

STYLE: Professional, modern, trustworthy
FORMAT: LinkedIn/Facebook ad (1200x628)

Generate 3 variations with different visual approaches.`;
  };

  const copyPomelliPrompt = async () => {
    const prompt = buildPomelliPrompt(currentAngle);
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const openPomelli = () => {
    window.open('https://labs.google/fx/tools/pomelli', '_blank');
  };

  const generateImage = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          analysis,
          adAngle: currentAngle,
          style: selectedStyle,
          provider: selectedProvider,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Image generation failed');
      }

      const data = await response.json();
      setGeneratedImages(prev => [
        {
          angleIndex: selectedAngle,
          style: selectedStyle,
          url: data.imageUrl,
          provider: data.provider,
        },
        ...prev,
      ]);
    } catch (err: any) {
      setError(err.message || 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="abstrakt-card p-6">
        <h2 className="section-header text-lg mb-4 flex items-center gap-3">
          <span className="text-2xl">🎨</span>
          Ad Creative Generator
        </h2>
        <p className="text-abstrakt-text-muted">
          Generate visual ad creatives using AI or create them in Google's Pomelli tool. 
          Select an ad angle below, then choose your preferred method.
        </p>
      </div>

      {/* Angle Selection */}
      <div className="abstrakt-card p-6">
        <h3 className="text-sm text-abstrakt-text-dim uppercase tracking-wider mb-4">
          Select Ad Angle
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {messagingRecommendation.adAngles.map((angle, index) => (
            <button
              key={index}
              onClick={() => setSelectedAngle(index)}
              className={`
                p-4 rounded-lg border text-left transition-all
                ${selectedAngle === index
                  ? 'border-abstrakt-orange bg-abstrakt-orange/10'
                  : 'border-abstrakt-card-border bg-abstrakt-input hover:border-abstrakt-orange/50'
                }
              `}
            >
              <span className={`
                inline-block px-2 py-0.5 rounded text-xs font-medium uppercase mb-2
                ${angle.type === 'problem-aware' ? 'bg-red-500/20 text-red-400' :
                  angle.type === 'brand-authority' ? 'bg-blue-500/20 text-blue-400' :
                  angle.type === 'ai-search-capture' ? 'bg-purple-500/20 text-purple-400' :
                  angle.type === 'social-proof' ? 'bg-green-500/20 text-green-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }
              `}>
                {angle.type.replace(/-/g, ' ')}
              </span>
              <p className={`font-medium text-sm ${selectedAngle === index ? 'text-white' : 'text-abstrakt-text-muted'}`}>
                {angle.headline}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Angle Preview */}
      <div className="abstrakt-card p-6">
        <h3 className="text-sm text-abstrakt-text-dim uppercase tracking-wider mb-4">
          Selected Ad Copy
        </h3>
        <div className="bg-abstrakt-input rounded-lg p-5 border border-abstrakt-card-border">
          <h4 className="text-xl font-bold text-white mb-2">{currentAngle.headline}</h4>
          <p className="text-abstrakt-text-muted mb-3">{currentAngle.subheadline}</p>
          <p className="text-sm text-abstrakt-text-dim italic mb-4">{currentAngle.valueProposition}</p>
          <span className="inline-block px-4 py-2 bg-abstrakt-orange text-white text-sm font-medium rounded">
            {currentAngle.ctaText}
          </span>
        </div>
      </div>

      {/* Two Generation Options */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Option 1: Pomelli */}
        <div className="abstrakt-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-white">Google Pomelli</h3>
              <p className="text-xs text-abstrakt-text-dim">Create full ad mockups with Google AI</p>
            </div>
          </div>

          <p className="text-sm text-abstrakt-text-muted mb-4">
            Pomelli generates complete ad creatives with text, images, and layouts. 
            Copy the prompt below and paste it into Pomelli.
          </p>

          {/* Prompt preview */}
          <div className="bg-abstrakt-bg rounded-lg p-4 mb-4 max-h-40 overflow-y-auto">
            <pre className="text-xs text-abstrakt-text-dim whitespace-pre-wrap font-mono">
              {buildPomelliPrompt(currentAngle)}
            </pre>
          </div>

          <div className="flex gap-3">
            <button
              onClick={copyPomelliPrompt}
              className={`
                flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2
                ${copiedPrompt
                  ? 'bg-abstrakt-success text-white'
                  : 'bg-abstrakt-input border border-abstrakt-card-border text-abstrakt-text hover:border-abstrakt-orange'
                }
              `}
            >
              {copiedPrompt ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy Prompt
                </>
              )}
            </button>
            <button
              onClick={openPomelli}
              className="flex-1 abstrakt-button flex items-center justify-center gap-2"
            >
              Open Pomelli
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>
        </div>

        {/* Option 2: AI Image Generation */}
        <div className="abstrakt-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-abstrakt-orange to-yellow-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-white">AI Image Generator</h3>
              <p className="text-xs text-abstrakt-text-dim">Generate background images with DALL-E / Flux</p>
            </div>
          </div>

          <p className="text-sm text-abstrakt-text-muted mb-4">
            Generate professional background images for your ads. These are text-free images 
            designed for overlay with your ad copy.
          </p>

          {/* Provider Selection */}
          {availableProviders.length > 0 && (
            <div className="mb-4">
              <label className="text-xs text-abstrakt-text-dim uppercase tracking-wider mb-2 block">
                AI Model
              </label>
              <div className="grid grid-cols-1 gap-2">
                {availableProviders.map(provider => (
                  <button
                    key={provider}
                    onClick={() => setSelectedProvider(provider)}
                    className={`
                      p-3 rounded-lg border text-left transition-all flex items-center justify-between
                      ${selectedProvider === provider
                        ? 'border-abstrakt-orange bg-abstrakt-orange/10'
                        : 'border-abstrakt-card-border bg-abstrakt-input hover:border-abstrakt-orange/50'
                      }
                    `}
                  >
                    <div>
                      <p className={`font-medium text-sm ${selectedProvider === provider ? 'text-white' : 'text-abstrakt-text-muted'}`}>
                        {providerDetails[provider]?.name || provider}
                      </p>
                      <p className="text-xs text-abstrakt-text-dim">
                        {providerDetails[provider]?.source}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      provider === 'flux' ? 'bg-green-500/20 text-green-400' :
                      provider === 'imagen' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {providerDetails[provider]?.cost}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {availableProviders.length === 0 && (
            <div className="mb-4 p-3 bg-abstrakt-warning/20 border border-abstrakt-warning/50 rounded-lg">
              <p className="text-sm text-abstrakt-warning">
                No image generation API configured. Add OPENAI_API_KEY or REPLICATE_API_TOKEN to enable this feature.
              </p>
            </div>
          )}

          {/* Style Selection */}
          <div className="mb-4">
            <label className="text-xs text-abstrakt-text-dim uppercase tracking-wider mb-2 block">
              Visual Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              {styleOptions.map(style => (
                <button
                  key={style.value}
                  onClick={() => setSelectedStyle(style.value)}
                  className={`
                    p-3 rounded-lg border text-left transition-all
                    ${selectedStyle === style.value
                      ? 'border-abstrakt-orange bg-abstrakt-orange/10'
                      : 'border-abstrakt-card-border bg-abstrakt-input hover:border-abstrakt-orange/50'
                    }
                  `}
                >
                  <p className={`font-medium text-sm ${selectedStyle === style.value ? 'text-white' : 'text-abstrakt-text-muted'}`}>
                    {style.label}
                  </p>
                  <p className="text-xs text-abstrakt-text-dim">{style.description}</p>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-abstrakt-error/20 border border-abstrakt-error rounded-lg text-abstrakt-error text-sm">
              {error}
            </div>
          )}

          <button
            onClick={generateImage}
            disabled={isGenerating || availableProviders.length === 0}
            className={`
              w-full abstrakt-button flex items-center justify-center gap-2
              ${(isGenerating || availableProviders.length === 0) ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            {isGenerating ? (
              <>
                <div className="spinner w-4 h-4" />
                Generating with {providerDetails[selectedProvider]?.name || selectedProvider}...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Image
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Images Gallery */}
      {generatedImages.length > 0 && (
        <div className="abstrakt-card p-6">
          <h3 className="section-header text-base mb-4">Generated Images</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {generatedImages.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img.url}
                  alt={`Generated ad image ${index + 1}`}
                  className="w-full rounded-lg border border-abstrakt-card-border"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-3">
                  <button
                    onClick={() => downloadImage(img.url, `ad-image-${index + 1}.png`)}
                    className="px-4 py-2 bg-white text-black rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
                  >
                    Download
                  </button>
                  <a
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-abstrakt-orange text-white rounded-lg font-medium text-sm hover:bg-abstrakt-orange-dark transition-colors"
                  >
                    Open Full Size
                  </a>
                </div>
                <div className="absolute bottom-2 left-2 flex gap-2">
                  <span className="px-2 py-1 bg-black/70 rounded text-xs text-white">
                    {img.provider}
                  </span>
                  <span className="px-2 py-1 bg-black/70 rounded text-xs text-white capitalize">
                    {img.style}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Usage tip */}
      <div className="bg-abstrakt-card/50 border border-abstrakt-card-border rounded-lg p-4">
        <p className="text-sm text-abstrakt-text-dim">
          <span className="text-abstrakt-orange font-medium">Pro tip:</span> Use the AI-generated images as backgrounds, 
          then overlay your ad copy using Canva, Figma, or your preferred design tool. For complete ad mockups with 
          text already placed, use Pomelli.
        </p>
      </div>
    </div>
  );
}
