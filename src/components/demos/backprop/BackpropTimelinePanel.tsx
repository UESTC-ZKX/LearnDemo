interface BackpropTimelinePanelProps {
  currentLabel: string;
  history: number[];
  mode: 'sample' | 'epoch';
  stepLabels: string[];
  activeStepIndex: number;
}

export function BackpropTimelinePanel(props: BackpropTimelinePanelProps) {
  const { activeStepIndex, currentLabel, history, mode, stepLabels } = props;
  const sparklinePoints = history
    .map((value, index) => {
      const x = history.length === 1 ? 140 : (index / (history.length - 1)) * 140;
      const y = 40 - value * 80;
      return `${x},${Math.max(0, Math.min(40, y))}`;
    })
    .join(' ');

  return (
    <section className="rounded-[2rem] border border-line bg-black/20 p-6 shadow-projection">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          {mode === 'sample' ? '步骤时间线' : '训练趋势'}
        </p>
        <span className="text-xs text-zinc-400">{currentLabel}</span>
      </div>

      {mode === 'sample' ? (
        <div className="mt-4 grid gap-3">
          {stepLabels.map((label, index) => (
            <div
              key={label}
              className={`rounded-2xl border px-4 py-3 text-sm leading-7 ${
                index === activeStepIndex
                  ? 'border-amber/60 bg-amber/10 text-white'
                  : 'border-line bg-zinc-950/70 text-zinc-300'
              }`}
            >
              第 {index + 1} 步：{label}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-line bg-zinc-950/70 p-4">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>loss 趋势</span>
            <span>右侧越新</span>
          </div>
          <svg className="mt-3 h-14 w-full" viewBox="0 0 140 40" preserveAspectRatio="none" aria-label="反向传播 loss 趋势图">
            <path d="M0 40 H140" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <polyline
              fill="none"
              points={sparklinePoints}
              stroke="#f59e0b"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </div>
      )}
    </section>
  );
}
