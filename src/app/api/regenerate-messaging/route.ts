import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { FormData, AdAngle } from '@/lib/types';
import { buildRegenerateMessagingPrompt, parseRegenerateMessagingResponse } from '@/lib/prompts';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formData, existingAngles } = body as { 
      formData: FormData; 
      existingAngles: string[];
    };

    const prompt = buildRegenerateMessagingPrompt(formData, existingAngles);

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract text content from response
    const textContent = message.content.find(block => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    const result = parseRegenerateMessagingResponse(textContent.text);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Regenerate messaging API error:', error);
    return NextResponse.json(
      { error: 'Regeneration failed' },
      { status: 500 }
    );
  }
}
