import { NextRequest, NextResponse } from 'next/server';

const ZAPIER_WEBHOOK_URL = process.env.ZAPIER_WEBHOOK_URL || 'https://hooks.zapier.com/hooks/catch/26047972/ugzsmru/';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { feedback, companyName, email } = body as {
      feedback: string;
      companyName: string;
      email?: string;
    };

    if (!feedback || !feedback.trim()) {
      return NextResponse.json(
        { error: 'Feedback is required' },
        { status: 400 }
      );
    }

    // Build Zapier payload for feedback
    const payload = {
      type: 'feedback',
      timestamp: new Date().toISOString(),
      feedback: feedback.trim(),
      companyName: companyName || 'Unknown',
      email: email || '',
      source: 'AdSmith Suggestion Box',
    };

    // Send to Zapier
    const response = await fetch(ZAPIER_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Zapier feedback webhook failed:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to submit feedback' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
