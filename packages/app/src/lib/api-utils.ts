import { NextResponse } from 'next/server';
import { rateLimit, getRateLimitHeaders } from './rate-limit';

/**
 * Check rate limit for an API request.
 * Returns a 429 response if limit exceeded, or null if OK.
 */
export function checkRateLimit(request: Request, options?: { limit?: number; windowMs?: number }): NextResponse | null {
  // Use IP or a fallback identifier
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  const url = new URL(request.url);
  const identifier = `${ip}:${url.pathname}`;

  const result = rateLimit(identifier, options);

  if (!result.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: getRateLimitHeaders(result) }
    );
  }

  return null;
}
