import type { Chapter } from '../data/chapters';
import { StageCard } from './StageCard';
import { ModelEvolutionLab } from './ModelEvolutionLab';

interface ChapterSectionProps {
  chapter: Chapter;
}

const accentClassNames: Record<Chapter['accent'], string> = {
  signal: 'text-signal',
  amber: 'text-amber',
  rose: 'text-rose',
};

export function ChapterSection({ chapter }: ChapterSectionProps) {
  return (
    <section className="chapter-section scroll-mt-8" id={chapter.id}>
      <div className="mb-8 flex flex-col gap-5 border-b border-line pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className={`text-sm font-semibold ${accentClassNames[chapter.accent]}`}>
            {chapter.order} / {chapter.subtitle}
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-white">{chapter.title}</h2>
        </div>
        <p className="max-w-2xl text-base leading-7 text-zinc-300">{chapter.overview}</p>
      </div>

      {chapter.id === 'chapter-models' ? (
        <ModelEvolutionLab />
      ) : (
        <div className="grid gap-5">
          {chapter.stages.map((stage) => (
            <StageCard key={stage.id} stage={stage} />
          ))}
        </div>
      )}

      <div className="mt-6 rounded border border-line bg-white/[0.03] p-5 text-sm leading-6 text-zinc-300">
        <span className="font-semibold text-white">承接：</span>
        {chapter.handoff}
      </div>
      <div className="mt-4 rounded border border-line bg-black/20 p-5">
        <h3 className="text-lg font-semibold text-white">章节 Summary</h3>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-zinc-300">
          {chapter.summary.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded bg-signal" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
