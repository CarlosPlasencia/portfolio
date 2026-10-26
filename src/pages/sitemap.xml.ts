import { buildSitemap } from '../lib/seo';

export function GET(): Response {
  return new Response(buildSitemap(), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
