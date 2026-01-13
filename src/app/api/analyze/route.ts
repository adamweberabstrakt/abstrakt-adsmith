import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { FormData, AnalysisResult } from '@/lib/types';
import { buildAnalysisPrompt, generateFallbackAnalysis } from '@/lib/prompts';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const data: FormData = await request.json();
    
    // Validate required fields
    if (!data.businessContext?.companyName || !data.businessContext?.industry) {
      return NextResponse.json(
        { error: 'Missing required business context fields' },
        { status: 400 }
      );
    }

    const prompt = buildAnalysisPrompt(data);

    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      // Extract the text content
      const textContent = response.content.find(block => block.type === 'text');
      if (!textContent || textContent.type !== 'text') {
        throw new Error('No text response from Claude');
      }

      // Parse the JSON response
      let analysisResult: AnalysisResult;
      try {
        analysisResult = JSON.parse(textContent.text);
      } catch (parseError) {
        // Try to extract JSON from the response
        const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysisResult = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Could not parse Claude response as JSON');
        }
      }

      return NextResponse.json(analysisResult);

    } catch (claudeError: any) {
      console.error('Claude API error:', claudeError);
      
      // Check for specific error types
      if (claudeError?.status === 400 || claudeError?.message?.includes('billing')) {
        // Use fallback analysis when API credits are depleted
        console.log('Using fallback analysis due to API error');
        const fallbackResult = JSON.parse(generateFallbackAnalysis(data));
        return NextResponse.json({
          ...fallbackResult,
          _notice: 'Analysis generated using simplified model due to high demand'
        });
      }
      
      throw claudeError;
    }

  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze data' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Analysis API is running' });
}
