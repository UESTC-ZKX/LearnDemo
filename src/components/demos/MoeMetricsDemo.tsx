import { useMemo, useState } from 'react';
import { DemoFrame } from './DemoFrame';

type Mode = 'dense' | 'moe';
type SampleId = 'alpha' | 'beta' | 'gamma';

interface SampleConfig {
  label: string;
  prompt: string;
  activeExperts: number[];
}

const expertCount = 4;

const sampleConfigs: Record<SampleId, SampleConfig> = {
  alpha: { label: '样例 A', prompt: '通用推理与摘要', activeExperts: [1, 3] },
  beta: { label: '样例 B', prompt: '代码风格与路由判断', activeExperts: [2, 4] },
  gamma: { label: '样例 C', prompt: '数学与规划', activeExperts: [1, 4] },
};

const expertNames = ['专家 1', '专家 2', '专家 3', '专家 4'];

export function MoeMetricsDemo() {
  const [mode, setMode] = useState<Mode>('moe');
  const [sampleId, setSampleId] = useState<SampleId>('alpha');

  const sample = sampleConfigs[sampleId];

  const activeExperts = useMemo(() => {
    if (mode === 'dense') {
      return [1, 2, 3, 4];
    }

    return sample.activeExperts;
  }, [mode, sample]);

  const inactiveExperts = expertNames.filter((_, index) => !activeExperts.includes(index + 1));

  const metrics = useMemo(() => {
    if (mode === 'dense') {
      return {
        activeParameters: '全部参数参与计算',
        estimatedLatency: '耗时较高',
        memory: '完整显存占用',
        throughput: '吞吐较低 / 成本较高',
      };
    }

    return {
      activeParameters: `${activeExperts.length * 10}M 参数参与计算`,
      estimatedLatency: '稀疏路由降低耗时',
      memory: '显存占用更低',
      throughput: '吞吐更高 / 成本更低',
    };
  }, [activeExperts.length, mode]);

  return (
    <DemoFrame title="稠密模型 vs MoE（Mixture of Experts，混合专家）指标" hint="切换稠密模型和 MoE（Mixture of Experts，混合专家），再换不同输入，观察哪些专家被激活，以及参数、耗时、显存和吞吐如何变化。" testId="demo-moe-metrics">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={`demo-button ${mode === 'dense' ? 'demo-button-active' : ''}`}
          onClick={() => setMode('dense')}
        >
          稠密模型
        </button>
        <button
          type="button"
          className={`demo-button ${mode === 'moe' ? 'demo-button-active' : ''}`}
          onClick={() => setMode('moe')}
        >
          MoE（Mixture of Experts，混合专家）
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {Object.entries(sampleConfigs).map(([id, config]) => (
          <button
            key={id}
            type="button"
            className={`demo-button ${sampleId === id ? 'demo-button-active' : ''}`}
            onClick={() => setSampleId(id as SampleId)}
          >
            {config.label}
          </button>
        ))}
      </div>

      <div data-testid="moe-metrics-panel" className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded border border-line bg-black/20 p-4">
          <div className="flex items-center justify-between gap-3">
            <h5 className="text-sm font-semibold text-white">{mode === 'dense' ? '稠密模型' : 'MoE（Mixture of Experts，混合专家）'}</h5>
            <span className="rounded border border-line px-2 py-1 text-[11px] uppercase tracking-wide text-zinc-400">{sample.label}</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-300">输入：{sample.prompt}</p>

          <div className="mt-4 grid gap-2">
            <div className="rounded border border-line bg-zinc-950/70 p-3 text-sm text-zinc-200">
              <span className="font-semibold text-signal">被激活专家：</span>
              {activeExperts.map((index) => `专家 ${index}`).join('，')}
            </div>
            <div className="rounded border border-line bg-zinc-950/70 p-3 text-sm text-zinc-200">
              <span className="font-semibold text-amber">未激活专家：</span>
              {mode === 'dense' ? '无' : inactiveExperts.join('，')}
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {expertNames.map((expert, index) => {
              const active = activeExperts.includes(index + 1);

              return (
                <div
                  key={expert}
                  className="rounded border border-line px-3 py-3 text-sm text-white"
                  style={{ backgroundColor: active ? 'rgba(61, 214, 198, 0.18)' : 'rgba(255, 255, 255, 0.03)' }}
                >
                  <div className="font-semibold">专家 {index + 1}</div>
                  <div className="mt-1 text-zinc-400">{active ? '已激活路径' : '未激活专家'}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 rounded border border-line bg-zinc-950/70 p-3">
            <div className="text-sm font-semibold text-white">路由负载</div>
            <div className="mt-3 grid gap-2">
              {expertNames.map((expert, index) => {
                const load = activeExperts.includes(index + 1) ? (mode === 'dense' ? 100 : 72 + index * 4) : 18 + index * 3;

                return (
                  <div key={`${expert}-load`} className="grid grid-cols-[4.5rem_1fr_3rem] items-center gap-2 text-xs text-zinc-400">
                    <span>{expert}</span>
                    <div className="h-2 rounded bg-zinc-800">
                      <div
                        className={`h-2 rounded ${activeExperts.includes(index + 1) ? 'bg-signal' : 'bg-zinc-600'}`}
                        style={{ width: `${load}%` }}
                      />
                    </div>
                    <span className="text-right">{load}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded border border-line bg-black/20 p-4">
          <h5 className="text-sm font-semibold text-white">统计指标</h5>
          <div className="mt-3 grid gap-3 text-sm leading-6 text-zinc-300">
            <div className="flex items-center justify-between gap-3 rounded border border-line bg-zinc-950/70 px-3 py-2">
              <span>激活参数：{metrics.activeParameters}</span>
              <span className="text-white">{metrics.activeParameters}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded border border-line bg-zinc-950/70 px-3 py-2">
              <span>估算耗时</span>
              <span className="text-white">{metrics.estimatedLatency}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded border border-line bg-zinc-950/70 px-3 py-2">
              <span>显存占用（VRAM）</span>
              <span className="text-white">{metrics.memory}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded border border-line bg-zinc-950/70 px-3 py-2">
              <span>吞吐与成本</span>
              <span className="text-white">{metrics.throughput}</span>
            </div>
          </div>

          <div className="mt-4 rounded border border-line bg-zinc-950/70 p-3 text-sm leading-6 text-zinc-300">
            {mode === 'dense'
              ? '稠密模型会让每次输入都经过全部参数，路由简单，但计算和成本更高。'
              : 'MoE（Mixture of Experts，混合专家）每次只激活部分专家，减少实际参与计算的参数量，并提升吞吐。'}
          </div>
          <div className="mt-3 text-sm leading-6 text-zinc-400">
            当前样例路由到 {activeExperts.length} / {expertCount} 个专家。
          </div>
        </div>
      </div>
    </DemoFrame>
  );
}
