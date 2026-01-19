import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { nanoid } from 'nanoid';

// POST - Save new results
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formData, leadData, analysisResult } = body;

    // Generate unique ID (10 characters)
    const id = nanoid(10);

    // Data to store
    const resultData = {
      id,
      formData,
      leadData,
      analysisResult,
      createdAt: new Date().toISOString(),
    };

    // Store in KV with 90-day expiration (in seconds)
    const expirationSeconds = 90 * 24 * 60 * 60; // 90 days
    await kv.set(`result:${id}`, JSON.stringify(resultData), { ex: expirationSeconds });

    return NextResponse.json({ id, url: `/results/${id}` });
  } catch (error) {
    console.error('Error saving results:', error);
    return NextResponse.json(
      { error: 'Failed to save results' },
      { status: 500 }
    );
  }
}
