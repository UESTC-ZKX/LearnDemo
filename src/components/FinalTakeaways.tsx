interface FinalTakeawaysProps {
  items: string[];
}

export function FinalTakeaways({ items }: FinalTakeawaysProps) {
  return (
    <section className="final-section scroll-mt-8" id="final-takeaways" aria-labelledby="final-title">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-signal">收束</p>
      <h2 id="final-title" className="mt-3 text-4xl font-semibold text-white">最终要点</h2>
      <div className="mt-6 grid gap-4">
        {items.map((item, index) => (
          <article key={item} className="rounded border border-line bg-white/[0.035] p-5">
            <p className="text-sm font-semibold text-amber">0{index + 1}</p>
            <p className="mt-2 text-lg leading-8 text-zinc-200">{item}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
