import { motion } from 'framer-motion';
import type { Stage } from '../data/chapters';
import { DemoRenderer } from './demos/DemoRenderer';

interface StageCardProps {
  stage: Stage;
}

export function StageCard({ stage }: StageCardProps) {
  return (
    <motion.article
      className="stage-card"
      id={stage.id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{stage.eyebrow}</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">{stage.title}</h3>
        <p className="mt-4 text-base leading-7 text-zinc-300">{stage.description}</p>
        <p className="mt-5 border-l-2 border-signal/70 pl-4 text-sm leading-6 text-zinc-200">{stage.keyPoint}</p>
        <ul className="mt-5 grid gap-2 text-sm leading-6 text-zinc-400">
          {stage.talkingPoints.map((point) => (
            <li key={point} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded bg-amber" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
      <DemoRenderer type={stage.demoType} />
      <div className="lg:col-span-2 rounded border border-line bg-black/20 px-4 py-3 text-sm leading-6 text-zinc-400">
        <span className="font-semibold text-zinc-200">讲解提示：</span>
        {stage.demoHint}
      </div>
    </motion.article>
  );
}
