import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const response = await fetch('http://backend:5001/get-endpoints', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Failed to fetch endpoints' }, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Get endpoints error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 