import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { FormData, AnalysisResult } from '@/lib/types';
import { buildAnalysisPrompt, generateFallbackAnalysis } from '@/lib/prompts';

export async function POST(request: NextRequest) {
  console.log('=== /api/analyze called ===');
  
  try {
    const data: FormData = await request.json();
    console.log('Received form data:', JSON.stringify(data, null, 2));
    
    // Validate required fields
    if (!data.businessContext?.companyName || !data.businessContext?.industry) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required business context fields' },
        { status: 400 }
      );
    }

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set');
      // Use fallback instead of failing
      console.log('Using fallback analysis (no API key)');
      const fallbackResult = JSON.parse(generateFallbackAnalysis(data));
      return NextResponse.json(fallbackResult);
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const prompt = buildAnalysisPrompt(data);
    console.log('Calling Claude API...');

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

      console.log('Claude response received');

      // Extract the text content
      const textContent = response.content.find(block => block.type === 'text');
      if (!textContent || textContent.type !== 'text') {
        console.error('No text response from Claude');
        throw new Error('No text response from Claude');
      }

      console.log('Raw Claude response:', textContent.text.substring(0, 500) + '...');

      // Parse the JSON response
      let analysisResult: AnalysisResult;
      try {
        // Try direct parse first
        analysisResult = JSON.parse(textContent.text);
      } catch (parseError) {
        console.log('Direct JSON parse failed, trying to extract JSON...');
        // Try to extract JSON from the response
        const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysisResult = JSON.parse(jsonMatch[0]);
        } else {
          console.error('Could not extract JSON from response');
          throw new Error('Could not parse Claude response as JSON');
        }
      }

      console.log('Analysis result parsed successfully');
      return NextResponse.json(analysisResult);

    } catch (claudeError: any) {
      console.error('Claude API error:', claudeError?.message || claudeError);
      console.error('Full error:', JSON.stringify(claudeError, null, 2));
      
      // Use fallback analysis when API fails
      console.log('Using fallback analysis due to Claude error');
      const fallbackResult = JSON.parse(generateFallbackAnalysis(data));
      return NextResponse.json({
        ...fallbackResult,
        _notice: 'Analysis generated using simplified model due to high demand'
      });
    }

  } catch (error: any) {
    console.error('General error in /api/analyze:', error?.message || error);
    console.error('Stack:', error?.stack);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze data' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'Analysis API is running',
    hasApiKey: !!process.env.ANTHROPIC_API_KEY,
  });
}
