import React from 'react';
import { EditorialArticle } from '@/types/cricket';
import { DemoDataBadge } from '@/components/ui/DemoDataBadge';
import { BookOpen, Clock } from 'lucide-react';

interface EditorialNewsSectionProps {
  editorials: EditorialArticle[];
}

export function EditorialNewsSection({ editorials }: EditorialNewsSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-400" />
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
              Cricket Intelligence &amp; Editorial Desk
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tactical breakdowns, surface reports, and match analysis from the CricLive data desk.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DemoDataBadge />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {editorials.map((article) => {
          const date = new Date(article.publishedAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          });

          return (
            <article
              key={article.id}
              className="group rounded-2xl border border-white/8 bg-[#0B111E] p-6 hover:border-emerald-500/40 hover:bg-[#0D1527] transition-all flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400 uppercase">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                    <Clock className="h-3 w-3" />
                    <span>{article.readingTimeMinutes} min read</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {article.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{article.author}</span>
                  <span className="font-mono text-[11px]">{date}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
