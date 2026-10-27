import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { BLOG_ARTICLE } from '../../lib/blog';
import type { BlogDraft } from '../../lib/blog-preview';

interface BlogProps { es: boolean; draft?: BlogDraft; children?: ReactNode; }

export default function BlogPage({ es, draft, children }: BlogProps) {
  if (children) return <section className="ws-document ws-blog-article" aria-labelledby="ws-main-title">{children}</section>;
  const post = draft ?? BLOG_ARTICLE;
  const topics = es
    ? ['Desarrollo web', 'IA aplicada', 'Pruebas y depuración']
    : ['Web development', 'Applied AI', 'Testing and debugging'];

  return <section className="ws-document ws-blog" aria-labelledby="ws-main-title">
    <span className="ws-comment">// blog.md / CaleduDev</span>
    <h1 id="ws-main-title">{es ? 'Desarrollo e IA, paso a paso.' : 'Development and AI, step by step.'}</h1>
    <p className="ws-doc-lead">{es
      ? 'Guías prácticas, ejemplos de código y aprendizajes para desarrolladores principiantes e intermedios.'
      : 'Practical guides, code examples and lessons for beginner and intermediate developers.'}</p>
    <ul className="ws-blog-topics" aria-label={es ? 'Temas del blog' : 'Blog topics'}>
      {topics.map(topic => <li key={topic}>{topic}</li>)}
    </ul>
    <a className="ws-blog-draft" href={post.path}>
      <span className="ws-section-caption">{draft
        ? (es ? 'Borrador · Solo en local' : 'Spanish draft · Local only')
        : (es ? 'Artículo · JavaScript e IA' : 'Spanish article · JavaScript & AI')}</span>
      <h2>{post.title}</h2>
      <p>{es ? 'Un ejemplo reproducible en JavaScript: del fallo a una corrección comprobada con pruebas.' : 'A reproducible JavaScript example: from a failing calculation to a fix verified with tests.'}</p>
      <span className="ws-text-link">{draft
        ? (es ? 'Leer la vista previa' : 'Read the Spanish preview')
        : (es ? 'Leer el artículo' : 'Read the Spanish article')}<ArrowUpRight size={15} /></span>
    </a>
  </section>;
}
