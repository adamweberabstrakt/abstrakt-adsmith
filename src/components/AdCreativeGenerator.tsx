'use client';

import { useState } from 'react';
import { AnalysisResult, FormData } from '@/lib/types';

interface AdCreativeGeneratorProps {
  result: AnalysisResult;
  formData: FormData;
}

type ImageModel = 'flux-pro' | 'flux-schnell';

interface GeneratedImage {
  url: string;
  prompt: string;
  source: 'ideogram' | 'replicate';
  timestamp: number;
}

export function AdCreativeGenerator({ result, formData }: AdCreativeGeneratorProps) {
  const [selectedAngleIndex, setSelectedAngleIndex] = useState(0);
  const [selectedModel, setSelectedModel] = useState<ImageModel>('flux-schnell');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingIdeogram, setIsGeneratingIdeogram] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modelConfig: Record<ImageModel, { name: string; description: string }> = {
    'flux-pro': { name: 'Flux Pro', description: 'Higher quality, detailed imagery' },
    'flux-schnell': { name: 'Flux Schnell', description: 'Fast generation, great results' },
  };

  const selectedAngle = result.messagingRecommendation.adAngles[selectedAngleIndex];

  const buildDefaultPrompt = () => {
    return `Professional B2B advertisement image for ${formData.businessContext.companyName}, a ${formData.businessContext.industry} company. Theme: ${selectedAngle.headline}. Style: Clean, modern, corporate. No text overlay needed. High quality, professional photography style.`;
  };

  const buildIdeogramPrompt = () => {
    const base = customPrompt || `Professional advertisement with text "${selectedAngle.headline}" for ${formData.businessContext.companyName}. Clean modern design, orange accent color, corporate style.`;
    return base;
  };

  const getActivePrompt = () => {
    return customPrompt || buildDefaultPrompt();
  };

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: getActivePrompt(),
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error('Image generation failed');
      }

      const data = await response.json();
      
      setGeneratedImages(prev => [{
        url: data.imageUrl,
        prompt: getActivePrompt(),
        source: 'replicate',
        timestamp: Date.now(),
      }, ...prev]);
    } catch (err) {
      setError('Failed to generate image. Please try again.');
      console.error('Image generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateIdeogram = async () => {
    setIsGeneratingIdeogram(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-ideogram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: buildIdeogramPrompt(),
        }),
      });

      if (!response.ok) {
        throw new Error('Ideogram generation failed');
      }

      const data = await response.json();
      
      setGeneratedImages(prev => [{
        url: data.imageUrl,
        prompt: buildIdeogramPrompt(),
        source: 'ideogram',
        timestamp: Date.now(),
      }, ...prev]);
    } catch (err) {
      setError('Failed to generate Ideogram image. Please try again.');
      console.error('Ideogram generation error:', err);
    } finally {
      setIsGeneratingIdeogram(false);
    }
  };

  const handleDownload = async (image: GeneratedImage) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.businessContext.companyName.replace(/\s+/g, '-')}-ad-${image.source}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleOpenPomelli = () => {
    window.open('https://labs.google.com/pomelli/', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      {/* Angle Selector */}
      <div className="abstrakt-card p-6">
        <h3 className="section-header mb-4">Select Ad Angle</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {result.messagingRecommendation.adAngles.map((angle, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedAngleIndex(idx)}
              className={`p-4 rounded-lg text-left transition-all ${
                selectedAngleIndex === idx
                  ? 'bg-abstrakt-orange text-white'
                  : 'bg-abstrakt-input text-abstrakt-text-muted hover:border-abstrakt-orange border border-abstrakt-input-border'
              }`}
            >
              <div className="text-xs uppercase tracking-wider mb-1 opacity-75">
                {angle.type.replace('-', ' ')}
              </div>
              <div className="font-semibold text-sm line-clamp-2">
                {angle.headline}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Prompt Input */}
      <div className="abstrakt-card p-6">
        <h3 className="section-header mb-4">Custom Prompt (Optional)</h3>
        <p className="text-sm text-abstrakt-text-muted mb-3">
          Override the auto-generated prompt with your own. Leave empty to use the default prompt based on your selected ad angle.
        </p>
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder={buildDefaultPrompt()}
          className="w-full h-24 px-4 py-3 bg-abstrakt-input border border-abstrakt-input-border rounded-lg text-white placeholder-abstrakt-text-dim focus:border-abstrakt-orange focus:outline-none resize-none"
        />
        {customPrompt && (
          <button
            onClick={() => setCustomPrompt('')}
            className="mt-2 text-sm text-abstrakt-text-muted hover:text-white"
          >
            Clear custom prompt
          </button>
        )}
      </div>

      {/* Two Column Layout: Ideogram (left) | Model Selector (right) */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* LEFT: Ideogram - Text-Driven Designs */}
        <div className="image-gen-card text-focused p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-400 text-lg">✍️</span>
            <h4 className="font-semibold text-white">Text-Driven Designs (Ideogram)</h4>
          </div>
          <p className="text-sm text-abstrakt-text-muted mb-4">
            Best for ads that include text overlays, headlines, or typography-heavy designs.
          </p>

          <div className="bg-abstrakt-input rounded-lg p-4 mb-4">
            <p className="text-xs text-abstrakt-text-dim mb-2">Preview headline:</p>
            <p className="text-white font-semibold">&ldquo;{selectedAngle.headline}&rdquo;</p>
          </div>

          <button
            onClick={handleGenerateIdeogram}
            disabled={isGeneratingIdeogram}
            className="w-full py-3 px-4 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-semibold transition-all flex items-center justify-center gap-2"
          >
            {isGeneratingIdeogram ? (
              <>
                <span className="spinner w-5 h-5" />
                Generating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Generate with Ideogram
              </>
            )}
          </button>
        </div>

        {/* RIGHT: AI Model Selector */}
        <div className="image-gen-card default p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-abstrakt-orange text-lg">🖼️</span>
            <h4 className="font-semibold text-white">AI Image Generation (Flux)</h4>
          </div>
          <p className="text-sm text-abstrakt-text-muted mb-4">
            Generate imagery without text overlays using Flux models.
          </p>

          {/* Model Selector */}
          <div className="space-y-2 mb-4">
            {(Object.keys(modelConfig) as ImageModel[]).map((model) => (
              <label
                key={model}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                  selectedModel === model
                    ? 'bg-abstrakt-orange/20 border border-abstrakt-orange'
                    : 'bg-abstrakt-input border border-abstrakt-input-border hover:border-abstrakt-orange/50'
                }`}
              >
                <input
                  type="radio"
                  name="imageModel"
                  value={model}
                  checked={selectedModel === model}
                  onChange={() => setSelectedModel(model)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedModel === model
                      ? 'border-abstrakt-orange bg-abstrakt-orange'
                      : 'border-abstrakt-input-border'
                  }`}
                >
                  {selectedModel === model && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className={`font-medium ${selectedModel === model ? 'text-white' : 'text-abstrakt-text-muted'}`}>
                    {modelConfig[model].name}
                  </div>
                  <div className="text-xs text-abstrakt-text-dim">
                    {modelConfig[model].description}
                  </div>
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={handleGenerateImage}
            disabled={isGenerating}
            className="w-full abstrakt-button flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <span className="spinner w-5 h-5" />
                Generating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Generate Image
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Generated Images Gallery */}
      {generatedImages.length > 0 && (
        <div className="abstrakt-card p-6">
          <h3 className="section-header mb-4">Generated Creatives ({generatedImages.length})</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedImages.map((image, idx) => (
              <div key={image.timestamp} className="relative group">
                <div className="relative rounded-lg overflow-hidden bg-abstrakt-input aspect-square">
                  <img
                    src={image.url}
                    alt={`Generated ad creative ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleDownload(image)}
                      className="p-3 bg-abstrakt-orange rounded-full hover:bg-abstrakt-orange-dark transition-colors"
                      title="Download"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    <a
                      href={image.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                      title="View full size"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
                {/* Source badge */}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    image.source === 'ideogram' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-abstrakt-orange text-white'
                  }`}>
                    {image.source === 'ideogram' ? 'Ideogram' : 'Flux'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pomelli CTA */}
      <div className="abstrakt-card p-6 border-2 border-purple-500/50 bg-gradient-to-r from-purple-900/20 to-transparent">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-heading font-bold text-white">Try Pomelli by Google Labs</h4>
              <p className="text-sm text-abstrakt-text-muted">
                AI-powered ad creative generation (requires Google sign-in)
              </p>
            </div>
          </div>
          <button
            onClick={handleOpenPomelli}
            className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open Pomelli
          </button>
        </div>
      </div>
    </div>
  );
}
