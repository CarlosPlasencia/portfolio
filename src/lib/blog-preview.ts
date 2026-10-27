import { BLOG_ARTICLE } from './blog';

export interface BlogDraft { title: string; slug: string; path: string; }

export const BLOG_DRAFT = {
  ...BLOG_ARTICLE,
  path: '/blog/vista-previa/corregir-bug-con-ia/',
} as const satisfies BlogDraft;

export function getBlogDraftPaths(development = false) {
  return development ? [{ params: { slug: BLOG_DRAFT.slug } }] : [];
}
