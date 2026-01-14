import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

type ImageModel = 'imagen' | 'dalle' | 'flux';

const MODEL_IDS: Record<ImageModel, string> = {
  imagen: 'google-deepmind/imagen-3',
  dalle: 'black-forest-labs/flux-1.1-pro', // Using Flux Pro as DALL-E alternative
  flux: 'black-forest-labs/flux-schnell',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, model = 'imagen' } = body as { 
      prompt: string; 
      model: ImageModel;
    };

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: 'Image generation not configured' },
        { status: 500 }
      );
    }

    const modelId = MODEL_IDS[model] || MODEL_IDS.imagen;

    const output = await replicate.run(modelId, {
      input: {
        prompt,
        aspect_ratio: '1:1',
        output_format: 'webp',
        output_quality: 90,
      },
    });

    // Handle different output formats from Replicate
    let imageUrl: string;
    if (Array.isArray(output)) {
      imageUrl = output[0];
    } else if (typeof output === 'string') {
      imageUrl = output;
    } else {
      throw new Error('Unexpected output format');
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Image generation failed' },
      { status: 500 }
    );
  }
}
