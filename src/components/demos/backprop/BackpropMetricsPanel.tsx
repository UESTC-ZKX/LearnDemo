interface BackpropMetricsPanelProps {
  activeSampleLine: string;
  currentStepLine: string;
  logs: string[];
  lossLabel: string;
  metricLines: string[];
}

export function BackpropMetricsPanel(props: BackpropMetricsPanelProps) {
  const { activeSampleLine, currentStepLine, logs, lossLabel, metricLines } = props;

  return (
    <aside className="grid gap-6">
      <section className="rounded-[2rem] border border-line bg-black/20 p-6 shadow-projection">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">当前步骤</p>
        <div className="mt-4 rounded-2xl border border-amber/40 bg-amber/10 p-4 text-sm leading-7 text-white">
          {currentStepLine}
        </div>
      </section>

      <section className="rounded-[2rem] border border-line bg-black/20 p-6 shadow-projection">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">当前样本</p>
        <div className="mt-4 rounded-2xl border border-line bg-zinc-950/70 px-4 py-3 text-sm leading-7 text-zinc-200">
          {activeSampleLine}
        </div>
        <div className="mt-4 rounded-2xl border border-line bg-zinc-950/70 px-4 py-3 text-sm leading-7 text-zinc-200">
          {lossLabel}
        </div>
      </section>

      <section className="rounded-[2rem] border border-line bg-black/20 p-6 shadow-projection">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">关键数值</p>
        <div className="mt-4 space-y-3">
          {metricLines.map((line) => (
            <div key={line} className="rounded-2xl border border-line bg-zinc-950/70 px-4 py-3 text-sm leading-7 text-zinc-300">
              {line}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-line bg-black/20 p-6 shadow-projection">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">训练日志</p>
        <div data-testid="backprop-log-list" className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-2">
          {logs.map((line) => (
            <div key={line} className="rounded-2xl border border-line bg-zinc-950/70 px-4 py-3 text-sm leading-7 text-zinc-300">
              {line}
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
