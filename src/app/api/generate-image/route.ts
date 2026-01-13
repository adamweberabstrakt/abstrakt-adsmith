import { NextRequest, NextResponse } from 'next/server';
import { FormData, AnalysisResult, AdAngle } from '@/lib/types';

export type ImageProvider = 'dalle3' | 'flux' | 'imagen';

interface GenerateImageRequest {
  formData: FormData;
  analysis: AnalysisResult;
  adAngle: AdAngle;
  style: 'professional' | 'bold' | 'minimal' | 'tech';
  provider?: ImageProvider; // Optional - will auto-select if not specified
}

// Build a prompt for ad creative generation
function buildImagePrompt(
  formData: FormData,
  adAngle: AdAngle,
  style: string
): string {
  const { businessContext } = formData;
  
  const styleGuides: Record<string, string> = {
    professional: 'Clean, corporate aesthetic with subtle gradients. Navy blue, white, and gold accents. Professional photography style. Sophisticated and trustworthy.',
    bold: 'High contrast, vibrant colors. Dynamic angles and bold typography spaces. Energetic and attention-grabbing. Modern startup aesthetic.',
    minimal: 'Lots of white space, simple geometric shapes. Muted color palette. Elegant and refined. Apple-inspired minimalism.',
    tech: 'Dark mode aesthetic with glowing accents. Circuit patterns or data visualization elements. Futuristic and innovative. Tech company style.',
  };

  return `Create a professional B2B digital advertisement image for a ${businessContext.industry} company.

AD CONCEPT:
- Headline: "${adAngle.headline}"
- Message: "${adAngle.valueProposition}"
- Target audience: B2B decision makers and executives
- Funnel stage: ${adAngle.targetFunnelStage}

STYLE DIRECTION:
${styleGuides[style]}

REQUIREMENTS:
- 1200x628 pixels (LinkedIn/Facebook ad format)
- Leave clear space for text overlay (headline area at top or center)
- No text in the image itself - just visual elements and photography
- Professional, high-end quality suitable for LinkedIn advertising
- Should evoke trust, authority, and business growth
- Abstract or conceptual imagery preferred over literal representations

DO NOT include:
- Any text, letters, or words in the image
- Faces of specific people
- Company logos
- Cluttered or busy compositions`;
}

export async function POST(request: NextRequest) {
  try {
    const { formData, analysis, adAngle, style, provider }: GenerateImageRequest = await request.json();

    const prompt = buildImagePrompt(formData, adAngle, style);

    // Check which API keys are available
    const openaiKey = process.env.OPENAI_API_KEY;
    // Support both naming conventions for Replicate
    const replicateKey = process.env.REPLICATE_API_TOKEN || 
                         process.env.REPLICATEFLUX_API_KEY || 
                         process.env.REPLICATEIMAGEN_API_KEY;

    // Determine which provider to use
    let selectedProvider = provider;
    if (!selectedProvider) {
      // Auto-select based on available keys
      if (openaiKey) selectedProvider = 'dalle3';
      else if (replicateKey) selectedProvider = 'flux';
      else {
        return NextResponse.json(
          { error: 'No image generation API configured. Add OPENAI_API_KEY or REPLICATE_API_TOKEN.' },
          { status: 400 }
        );
      }
    }

    // Validate the selected provider has required keys
    if (selectedProvider === 'dalle3' && !openaiKey) {
      return NextResponse.json(
        { error: 'DALL-E 3 selected but OPENAI_API_KEY is not configured.' },
        { status: 400 }
      );
    }
    if ((selectedProvider === 'flux' || selectedProvider === 'imagen') && !replicateKey) {
      return NextResponse.json(
        { error: `${selectedProvider} selected but Replicate API key is not configured.` },
        { status: 400 }
      );
    }

    // Generate based on provider
    switch (selectedProvider) {
      case 'dalle3':
        return await generateWithDalle(prompt, style, openaiKey!);
      case 'flux':
        return await generateWithFlux(prompt, replicateKey!);
      case 'imagen':
        return await generateWithImagen(prompt, replicateKey!);
      default:
        return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}

// DALL-E 3 Generation
async function generateWithDalle(prompt: string, style: string, apiKey: string) {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1792x1024',
      quality: 'standard',
      style: style === 'bold' ? 'vivid' : 'natural',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'DALL-E generation failed');
  }

  const data = await response.json();
  return NextResponse.json({
    imageUrl: data.data[0].url,
    revisedPrompt: data.data[0].revised_prompt,
    provider: 'dalle3',
  });
}

// Flux Generation (via Replicate)
async function generateWithFlux(prompt: string, apiKey: string) {
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'black-forest-labs/flux-schnell',
      input: {
        prompt,
        aspect_ratio: '16:9',
        output_format: 'webp',
        output_quality: 90,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Flux generation failed');
  }

  const prediction = await response.json();
  const result = await pollReplicateResult(prediction, apiKey);

  return NextResponse.json({
    imageUrl: result.output[0],
    provider: 'flux',
  });
}

// Google Imagen 3 Generation (via Replicate)
async function generateWithImagen(prompt: string, apiKey: string) {
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // Imagen 3 model on Replicate
      version: 'google/imagen-3',
      input: {
        prompt,
        aspect_ratio: '16:9',
        safety_filter_level: 'block_medium_and_above',
        output_format: 'png',
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Imagen generation failed');
  }

  const prediction = await response.json();
  const result = await pollReplicateResult(prediction, apiKey);

  return NextResponse.json({
    imageUrl: Array.isArray(result.output) ? result.output[0] : result.output,
    provider: 'imagen',
  });
}

// Helper to poll Replicate for completion
async function pollReplicateResult(prediction: any, apiKey: string, maxAttempts = 60) {
  let result = prediction;
  let attempts = 0;
  
  while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const pollResponse = await fetch(result.urls.get, {
      headers: { 'Authorization': `Token ${apiKey}` },
    });
    result = await pollResponse.json();
    attempts++;
  }

  if (result.status === 'failed') {
    throw new Error(result.error || 'Image generation failed');
  }
  
  if (result.status !== 'succeeded') {
    throw new Error('Image generation timed out');
  }

  return result;
}

export async function GET() {
  // Check which providers are configured
  const providers: ImageProvider[] = [];
  
  if (process.env.OPENAI_API_KEY) {
    providers.push('dalle3');
  }
  
  // Check for any Replicate key (supports both Flux and Imagen)
  const hasReplicate = process.env.REPLICATE_API_TOKEN || 
                       process.env.REPLICATEFLUX_API_KEY || 
                       process.env.REPLICATEIMAGEN_API_KEY;
  
  if (hasReplicate) {
    providers.push('flux', 'imagen');
  }
  
  return NextResponse.json({ 
    status: 'Image generation API is running',
    availableProviders: providers,
    providerDetails: {
      dalle3: { name: 'DALL-E 3', source: 'OpenAI', cost: '~$0.04/image' },
      flux: { name: 'Flux Schnell', source: 'Replicate', cost: '~$0.003/image' },
      imagen: { name: 'Google Imagen 3', source: 'Replicate', cost: '~$0.03/image' },
    }
  });
}
