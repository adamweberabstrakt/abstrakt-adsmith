'use client';

import { useState } from 'react';
import { AnalysisResult, FormData } from '@/lib/types';

interface AdCreativeGeneratorProps {
  result: AnalysisResult;
  formData: FormData;
}

type ImageModel = 'imagen' | 'dalle' | 'flux';

export function AdCreativeGenerator({ result, formData }: AdCreativeGeneratorProps) {
  const [selectedAngleIndex, setSelectedAngleIndex] = useState(0);
  const [selectedModel, setSelectedModel] = useState<ImageModel>('imagen');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modelConfig: Record<ImageModel, { name: string; description: string }> = {
    imagen: { 
      name: 'Google Imagen 3', 
      description: 'Best for photorealistic imagery' 
    },
    dalle: { 
      name: 'DALL-E 3', 
      description: 'Great for creative concepts' 
    },
    flux: { 
      name: 'Flux Schnell', 
      description: 'Fast generation, artistic style' 
    },
  };

  const selectedAngle = result.messagingRecommendation.adAngles[selectedAngleIndex];

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: buildImagePrompt(),
          model: selectedModel,
          companyName: formData.businessContext.companyName,
          industry: formData.businessContext.industry,
        }),
      });

      if (!response.ok) {
        throw new Error('Image generation failed');
      }

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
    } catch (err) {
      setError('Failed to generate image. Please try again.');
      console.error('Image generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const buildImagePrompt = () => {
    return `Professional B2B advertisement image for ${formData.businessContext.companyName}, a ${formData.businessContext.industry} company. Theme: ${selectedAngle.headline}. Style: Clean, modern, corporate. No text overlay needed. High quality, professional photography style.`;
  };

  const handleOpenIdeogram = () => {
    const prompt = encodeURIComponent(
      `Professional advertisement with text "${selectedAngle.headline}" for ${formData.businessContext.companyName}. Clean modern design, orange accent color, corporate style.`
    );
    window.open(`https://ideogram.ai/g/${prompt}`, '_blank', 'noopener,noreferrer');
  };

  const handleOpenPomelli = () => {
    window.open('https://pomelli.ai', '_blank', 'noopener,noreferrer');
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

      {/* Two Column Layout: Ideogram (left) | Model Selector (right) */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* LEFT: Ideogram - Text-Driven Designs */}
        <div className="image-gen-card text-focused p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-400 text-lg">✍️</span>
            <h4 className="font-semibold text-white">Text-Driven Designs</h4>
          </div>
          <p className="text-sm text-abstrakt-text-muted mb-4">
            Use Ideogram for ads that include text overlays, headlines, or typography-heavy designs.
          </p>
          
          <div className="bg-abstrakt-input rounded-lg p-4 mb-4">
            <p className="text-xs text-abstrakt-text-dim mb-2">Preview headline:</p>
            <p className="text-white font-semibold">&ldquo;{selectedAngle.headline}&rdquo;</p>
          </div>
          
          <button
            onClick={handleOpenIdeogram}
            className="w-full py-3 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open Ideogram
          </button>
        </div>

        {/* RIGHT: AI Model Selector */}
        <div className="image-gen-card default p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-abstrakt-orange text-lg">🖼️</span>
            <h4 className="font-semibold text-white">AI Image Generation</h4>
          </div>
          <p className="text-sm text-abstrakt-text-muted mb-4">
            Generate imagery without text overlays using our AI models.
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
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedModel === model 
                    ? 'border-abstrakt-orange bg-abstrakt-orange' 
                    : 'border-abstrakt-input-border'
                }`}>
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

      {/* Generated Image Display */}
      {(generatedImage || error) && (
        <div className="abstrakt-card p-6">
          <h3 className="section-header mb-4">Generated Creative</h3>
          
          {error ? (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-400">
              {error}
            </div>
          ) : generatedImage ? (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-abstrakt-input">
                <img
                  src={generatedImage}
                  alt="Generated ad creative"
                  className="w-full h-auto"
                />
              </div>
              
              <div className="flex gap-3">
                <a
                  href={generatedImage}
                  download={`${formData.businessContext.companyName}-ad-creative.png`}
                  className="abstrakt-button-outline flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </a>
                <button
                  onClick={handleGenerateImage}
                  className="text-abstrakt-text-muted hover:text-white transition-colors"
                >
                  Regenerate
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Pomelli Link */}
      <div className="text-center py-4 border-t border-abstrakt-card-border">
        <p className="text-sm text-abstrakt-text-dim mb-2">
          Need more advanced AI image editing?
        </p>
        <button
          onClick={handleOpenPomelli}
          className="text-abstrakt-orange hover:text-abstrakt-orange-light transition-colors inline-flex items-center gap-2"
        >
          Try Pomelli AI
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
      </div>
    </div>
  );
}
