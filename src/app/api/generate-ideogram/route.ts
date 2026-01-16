import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body as { prompt: string };

    if (!process.env.IDEOGRAM_API_KEY) {
      return NextResponse.json(
        { error: 'Ideogram API not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.ideogram.ai/generate', {
      method: 'POST',
      headers: {
        'Api-Key': process.env.IDEOGRAM_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_request: {
          prompt,
          aspect_ratio: 'ASPECT_1_1',
          model: 'V_2',
          magic_prompt_option: 'AUTO',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ideogram API error:', errorText);
      throw new Error('Ideogram API request failed');
    }

    const data = await response.json();
    
    // Ideogram returns an array of images in data.data
    const imageUrl = data.data?.[0]?.url;
    
    if (!imageUrl) {
      throw new Error('No image URL in response');
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Ideogram generation error:', error);
    return NextResponse.json(
      { error: 'Ideogram generation failed' },
      { status: 500 }
    );
  }
}
