import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// GET - Fetch results by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch from KV
    const data = await kv.get(`result:${id}`);

    if (!data) {
      return NextResponse.json(
        { error: 'Results not found or expired' },
        { status: 404 }
      );
    }

    // Parse if it's a string
    const resultData = typeof data === 'string' ? JSON.parse(data) : data;

    return NextResponse.json(resultData);
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}
