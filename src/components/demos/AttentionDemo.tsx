import { useEffect, useMemo, useState } from 'react';
import { attentionTokens } from '../../data/demoContent';
import { DemoFrame } from './DemoFrame';

interface AttentionDemoProps {
  focus?: 'direct-attention' | 'pretraining-transfer';
}

function matrixCellColor(weight: number) {
  return `rgba(61, 214, 198, ${0.16 + weight * 0.78})`;
}

function buildHeadWeights(baseWeights: number[], headIndex: number) {
  return baseWeights.map((weight, index) => {
    const shifted = Math.sin((index + 1) * (headIndex + 1) * 0.7) * 0.08;
    return Math.max(0.05, Math.min(1, weight + shifted));
  });
}

const pipelineSteps = ['X -> Q,K,V', 'S = Q x K^T', 'A = Softmax(S)', 'O = A x V', 'Concat + Wo'];

export function AttentionDemo({ focus = 'direct-attention' }: AttentionDemoProps) {
  const [activeIndex, setActiveIndex] = useState(focus === 'pretraining-transfer' ? 2 : 0);
  const [headCount, setHeadCount] = useState(4);
  const [isPlaying, setIsPlaying] = useState(true);
  const [tick, setTick] = useState(0);
  const active = attentionTokens[activeIndex];

  useEffect(() => {
    setActiveIndex(focus === 'pretraining-transfer' ? 2 : 0);
  }, [focus]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timer = window.setInterval(() => {
      setTick((current) => (current + 1) % 2000);
    }, 120);

    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const heads = useMemo(() => {
    return Array.from({ length: headCount }, (_, headIndex) => ({
      id: headIndex + 1,
      weights: buildHeadWeights(active.weights, headIndex),
    }));
  }, [active.weights, headCount]);

  const compactTokens = attentionTokens.slice(0, 4);
  const cycle = tick % (pipelineSteps.length * 12);
  const activeStepIndex = Math.floor(cycle / 12);
  const phaseInStep = (cycle % 12) / 11;
  const sequentialMs = headCount * 9;
  const parallelMs = 9 + Math.floor(headCount / 2);

  return (
    <DemoFrame
      title="Transformer / 注意力（Attention）并行计算"
      hint="先看 Q、K、V 的矩阵链路，再观察多头注意力如何并行计算后再拼接输出。"
      testId="demo-attention"
    >
      <div className="flex flex-wrap gap-2">
        {attentionTokens.map((item, index) => (
          <button
            key={item.token}
            type="button"
            className={`demo-button w-auto ${index === activeIndex ? 'demo-button-active' : ''}`}
            onClick={() => setActiveIndex(index)}
          >
            {item.token}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
        <div className="rounded border border-line bg-white/[0.035] px-3 py-2 text-sm text-zinc-300">
          事件焦点：{focus === 'pretraining-transfer' ? '预训练迁移（共享表示）' : '自注意力并行矩阵运算'}
        </div>
        <button type="button" className="control-button" onClick={() => setIsPlaying((current) => !current)}>
          {isPlaying ? '暂停并行演示' : '播放并行演示'}
        </button>
      </div>
      <p className="mt-3 rounded border border-line bg-black/20 px-3 py-2 text-sm leading-6 text-zinc-300">
        示例句：用户提出问题，模型关注线索。点击任意 token（词元），下方矩阵会显示它对其他 token 的注意力权重。
      </p>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded border border-line bg-black/20 p-4">
          <h5 className="text-sm font-semibold text-white">矩阵链路</h5>
          <div className="mt-3 grid gap-2 text-sm text-zinc-300">
            {pipelineSteps.map((step, index) => {
              const isActive = index === activeStepIndex;
              const progress = isActive ? (isPlaying ? phaseInStep : 1) : index < activeStepIndex ? 1 : 0;
              return (
                <div key={step} className={`rounded border p-3 ${isActive ? 'border-signal/70 bg-signal/10' : 'border-line bg-zinc-950/70'}`}>
                  <div>{step}</div>
                  <div className="mt-2 h-1.5 rounded bg-zinc-800">
                    <div className="h-1.5 rounded bg-signal transition-all" style={{ width: `${Math.max(5, progress * 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid gap-2">
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">注意力权重矩阵（当前 token 行）</div>
            <div className="grid grid-cols-4 gap-2">
              {compactTokens.map((token, rowIndex) => (
                <div key={token.token} className="grid gap-1 rounded border border-line bg-zinc-950/60 p-2">
                  <div className="text-[11px] text-zinc-400">Query: {token.token}</div>
                  <div className="grid grid-cols-4 gap-1">
                    {compactTokens.map((_, colIndex) => {
                      const weight = heads[0].weights[(rowIndex + colIndex) % heads[0].weights.length];
                      return (
                        <div
                          key={`${token.token}-${colIndex}`}
                          className="h-5 rounded"
                          style={{ backgroundColor: matrixCellColor(weight) }}
                          title={`w=${weight.toFixed(2)}`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="rounded border border-line bg-black/20 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">并行头数</div>
            <div className="mt-3 flex gap-2">
              {[1, 2, 4].map((count) => (
                <button
                  key={count}
                  type="button"
                  className={`demo-button ${headCount === count ? 'demo-button-active' : ''}`}
                  onClick={() => setHeadCount(count)}
                >
                  {count} 头
                </button>
              ))}
            </div>
          </div>

          <div className="rounded border border-line bg-black/20 p-4">
            <h5 className="text-sm font-semibold text-white">并行头视图</h5>
            <div className="mt-3 grid gap-2">
              {heads.map((head, index) => {
                const syncProgress = isPlaying ? Math.max(0.08, (phaseInStep + index * 0.13) % 1) : 1;
                return (
                  <div key={head.id} className="rounded border border-line bg-zinc-950/70 p-3">
                    <div className="text-xs text-zinc-400">Head {head.id}</div>
                    <div className="mt-2 h-1.5 rounded bg-zinc-800">
                      <div className="h-1.5 rounded bg-amber transition-all" style={{ width: `${syncProgress * 100}%` }} />
                    </div>
                    <div className="mt-2 grid grid-cols-6 gap-1">
                      {head.weights.map((weight, weightIndex) => (
                        <div
                          key={`${head.id}-${weightIndex}`}
                          className="h-4 rounded"
                          style={{ backgroundColor: matrixCellColor(weight) }}
                          title={`head=${head.id}, w=${weight.toFixed(2)}`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded border border-line bg-black/20 p-4 text-sm leading-6 text-zinc-300">
            <p>
              串行估算：约 {sequentialMs}ms；并行估算：约 {parallelMs}ms。头数越多，并行收益越明显。
            </p>
            <p className="mt-2">
              {focus === 'pretraining-transfer'
                ? '预训练阶段，多个注意力头会学习可迁移的表示模式，不同任务可以复用同一套并行计算骨架。'
                : '并行多头把长距离依赖拆成多个子空间同时建模，这就是 Transformer 在训练和推理上能高效扩展的关键。'}
            </p>
          </div>
        </div>
      </div>
    </DemoFrame>
  );
}
