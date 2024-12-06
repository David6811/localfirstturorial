// app/auth/token/route.js
import { NextResponse } from 'next/server';
import { getAccessToken } from '@auth0/nextjs-auth0';

export async function GET() {
  const { accessToken } = await getAccessToken();
  return NextResponse.json({ foo: accessToken});
}