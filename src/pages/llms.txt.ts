import { buildLlms } from '../lib/seo';

export function GET(): Response {
  return new Response(buildLlms(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
