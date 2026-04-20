interface PerceptronControlPanelProps {
  autoRunning: boolean;
  learningRate: number;
  speed: number;
  onLearningRateChange: (value: number) => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (value: number) => void;
  onStartAuto: () => void;
  onStep: () => void;
}

export function PerceptronControlPanel(props: PerceptronControlPanelProps) {
  const {
    autoRunning,
    learningRate,
    speed,
    onLearningRateChange,
    onPause,
    onReset,
    onSpeedChange,
    onStartAuto,
    onStep,
  } = props;

  return (
    <section className="rounded-3xl border border-line bg-black/20 p-5 shadow-projection">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="rounded-full border border-signal/60 bg-signal/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-signal/20"
          onClick={onStep}
        >
          单步训练
        </button>
        <button
          type="button"
          className="rounded-full border border-amber/60 bg-amber/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber/20"
          onClick={onStartAuto}
        >
          自动训练
        </button>
        <button
          type="button"
          className="rounded-full border border-line bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-white/30 hover:text-white"
          onClick={onPause}
        >
          暂停
        </button>
        <button
          type="button"
          className="rounded-full border border-line bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-white/30 hover:text-white"
          onClick={onReset}
        >
          重置
        </button>
        <span className="rounded-full border border-line px-3 py-2 text-xs uppercase tracking-[0.18em] text-zinc-400">
          {autoRunning ? 'auto running' : 'manual mode'}
        </span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <label className="rounded-2xl border border-line bg-zinc-950/60 p-4 text-sm text-zinc-300">
          <div className="flex items-center justify-between">
            <span>学习率</span>
            <span className="font-semibold text-white">{learningRate.toFixed(2)}</span>
          </div>
          <input
            aria-label="学习率"
            className="mt-3 w-full accent-[#3dd6c6]"
            max="1"
            min="0.05"
            step="0.05"
            type="range"
            value={learningRate}
            onChange={(event) => onLearningRateChange(Number(event.target.value))}
          />
        </label>

        <label className="rounded-2xl border border-line bg-zinc-950/60 p-4 text-sm text-zinc-300">
          <div className="flex items-center justify-between">
            <span>自动训练速度</span>
            <span className="font-semibold text-white">{speed} ms</span>
          </div>
          <input
            aria-label="自动训练速度"
            className="mt-3 w-full accent-[#f59e0b]"
            max="800"
            min="80"
            step="40"
            type="range"
            value={speed}
            onChange={(event) => onSpeedChange(Number(event.target.value))}
          />
        </label>
      </div>
    </section>
  );
}
