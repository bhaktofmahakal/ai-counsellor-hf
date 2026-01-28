import { Redis } from '@upstash/redis';
import { Index } from '@upstash/vector';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const vectorIndex = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
});

export const CACHE_TTL = {
  USER_PROFILE: 3600,
  UNIVERSITY_SEARCH: 86400,
  CONVERSATION: 604800,
  RATE_LIMIT: 300,
  MATCH_SCORES: 7200,
} as const;

export async function getCachedUser(email: string) {
  const cached = await redis.get(`user:${email}`);
  return cached;
}

export async function cacheUser(email: string, userData: any) {
  await redis.setex(`user:${email}`, CACHE_TTL.USER_PROFILE, JSON.stringify(userData));
}

export async function invalidateUserCache(email: string) {
  await redis.del(`user:${email}`);
}

export async function getCachedUniversities(cacheKey: string) {
  const cached = await redis.get(`universities:${cacheKey}`);
  if (cached && typeof cached === 'string') {
    return JSON.parse(cached);
  }
  return cached;
}

export async function cacheUniversities(cacheKey: string, data: any) {
  await redis.setex(`universities:${cacheKey}`, CACHE_TTL.UNIVERSITY_SEARCH, JSON.stringify(data));
}

export async function checkRateLimit(userId: string, action: string, limit: number = 10): Promise<boolean> {
  const key = `ratelimit:${userId}:${action}`;
  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.expire(key, CACHE_TTL.RATE_LIMIT);
  }
  
  return current <= limit;
}
