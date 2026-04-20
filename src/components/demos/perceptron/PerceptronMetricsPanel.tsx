interface PerceptronMetricsPanelProps {
  accuracy: number;
  activeExplanation: string;
  activeSampleLine?: string;
  epoch: number;
  errorCount: number;
  history: number[];
  parameterLines: string[];
  sceneSummary: string;
  trainingLogs: string[];
}

export function PerceptronMetricsPanel(props: PerceptronMetricsPanelProps) {
  const { accuracy, activeExplanation, activeSampleLine, epoch, errorCount, history, parameterLines, sceneSummary, trainingLogs } = props;
  const sparklinePoints = history
    .map((value, index) => {
      const x = history.length === 1 ? 120 : (index / (history.length - 1)) * 120;
      const y = 40 - value * 40;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <aside className="grid gap-4">
      <section className="rounded-3xl border border-line bg-black/20 p-5 shadow-projection">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">场景讲解</p>
        <p className="mt-3 text-sm leading-7 text-zinc-300">{sceneSummary}</p>
        <p className="mt-4 rounded-2xl border border-signal/50 bg-signal/10 p-4 text-sm leading-7 text-white">
          {activeExplanation}
        </p>
      </section>

      <section className="rounded-3xl border border-line bg-black/20 p-5 shadow-projection">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">训练状态</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-line bg-zinc-950/70 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">当前轮次</div>
            <div className="mt-2 text-2xl font-semibold text-white">{epoch}</div>
          </div>
          <div className="rounded-2xl border border-line bg-zinc-950/70 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">准确率</div>
            <div className="mt-2 text-2xl font-semibold text-white">{Math.round(accuracy * 100)}%</div>
          </div>
          <div className="rounded-2xl border border-line bg-zinc-950/70 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">误分类</div>
            <div className="mt-2 text-2xl font-semibold text-white">{errorCount}</div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-line bg-zinc-950/70 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">训练趋势</span>
            <span className="text-xs text-zinc-500">右侧越新</span>
          </div>
          <svg className="mt-3 h-14 w-full" viewBox="0 0 120 40" preserveAspectRatio="none" aria-label="训练趋势图">
            <path d="M0 40 H120" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <polyline
              fill="none"
              points={sparklinePoints}
              stroke="#3dd6c6"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </div>
      </section>

      <section className="rounded-3xl border border-line bg-black/20 p-5 shadow-projection">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">当前参数</p>
        <div className="mt-3 space-y-2 text-sm leading-7 text-zinc-300">
          {parameterLines.map((line) => (
            <div key={line} className="rounded-2xl border border-line bg-zinc-950/70 px-4 py-3">
              {line}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-line bg-black/20 p-5 shadow-projection">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">当前处理样本</p>
        <div className="mt-3 rounded-2xl border border-signal/40 bg-zinc-950/70 px-4 py-3 text-sm leading-7 text-zinc-200">
          {activeSampleLine ?? '还没有开始训练，点击“单步训练”或“自动训练”后，这里会显示当前处理的样本。'}
        </div>
      </section>

      <section className="rounded-3xl border border-line bg-black/20 p-5 shadow-projection">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">训练日志</p>
        <div className="mt-3 space-y-2">
          {trainingLogs.length > 0 ? (
            trainingLogs.map((line) => (
              <div key={line} className="rounded-2xl border border-line bg-zinc-950/70 px-4 py-3 text-sm leading-7 text-zinc-300">
                {line}
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-line bg-zinc-950/70 px-4 py-3 text-sm leading-7 text-zinc-400">
              训练开始后，这里会滚动记录每一步拿到的样本、预测结果和参数更新情况。
            </div>
          )}
        </div>
      </section>
    </aside>
  );
}
