import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const body = await req.json();

    const response = await fetch('http://backend:5001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: body.username,
        password: body.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Login failed' },
        { status: response.status }
      );
    }

    const token = data.token;

    // Sync usage for route handler
    const cookieStore = cookies();
    cookieStore.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'lax',
    });

    return NextResponse.json({
      success: true,
      requiresCredentialChange: data.requiresCredentialChange || false,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}


