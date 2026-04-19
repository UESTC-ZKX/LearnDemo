import { useEffect, useMemo, useState } from 'react';
import { DemoFrame } from './DemoFrame';

type FitMode = 'underfit' | 'balanced' | 'overfit';

interface FitConfig {
  label: string;
  trainError: string;
  testError: string;
  note: string;
  curve: (x: number) => number;
  emphasis: string;
}

const modes: Record<FitMode, FitConfig> = {
  underfit: {
    label: '欠拟合',
    trainError: '0.41',
    testError: '0.44',
    note: '模型太简单，只能学到大致趋势，抓不住目标函数的弯曲变化。',
    curve: (x) => 0.28 + 0.12 * x,
    emphasis: '偏差过高',
  },
  balanced: {
    label: '平衡拟合',
    trainError: '0.09',
    testError: '0.11',
    note: '曲线跟随真实规律，但不会追着每个噪声点乱摆。',
    curve: (x) => 0.5 + 0.18 * Math.sin(x * 1.2) - 0.09 * Math.cos(x * 0.6),
    emphasis: '泛化较好',
  },
  overfit: {
    label: '高方差拟合',
    trainError: '0.02',
    testError: '0.31',
    note: '模型记住了训练样本，在样本之间出现不必要的剧烈摆动。',
    curve: (x) => 0.5 + 0.22 * Math.sin(x * 1.2) - 0.1 * Math.cos(x * 0.6) + 0.12 * Math.sin(x * 5.5),
    emphasis: '方差过高',
  },
};

const points = [
  { x: 0.7, y: 0.69 },
  { x: 1.6, y: 0.77 },
  { x: 2.4, y: 0.58 },
  { x: 3.4, y: 0.46 },
  { x: 4.3, y: 0.31 },
  { x: 5.1, y: 0.38 },
  { x: 6.1, y: 0.56 },
  { x: 7, y: 0.74 },
];

const targetFunction = (x: number) => 0.52 + 0.18 * Math.sin(x * 1.1) - 0.08 * Math.cos(x * 0.45);

function buildPath(fn: (x: number) => number, width = 380, height = 180) {
  const segments: string[] = [];
  const samples = 80;

  for (let i = 0; i <= samples; i += 1) {
    const x = (i / samples) * 7.6;
    const px = 20 + (x / 7.6) * width;
    const py = 18 + (1 - fn(x)) * height;
    segments.push(`${i === 0 ? 'M' : 'L'} ${px.toFixed(2)} ${py.toFixed(2)}`);
  }

  return segments.join(' ');
}

function toPoint(x: number, y: number, width = 380, height = 180) {
  return {
    cx: 20 + (x / 7.6) * width,
    cy: 18 + (1 - y) * height,
  };
}

interface FunctionFittingDemoProps {
  focus?: FitMode;
}

export function FunctionFittingDemo({ focus = 'balanced' }: FunctionFittingDemoProps) {
  const [mode, setMode] = useState<FitMode>(focus);
  const [noise, setNoise] = useState(3);
  const [complexity, setComplexity] = useState(4);
  const config = modes[mode];

  useEffect(() => {
    setMode(focus);
  }, [focus]);

  const chart = useMemo(() => {
    const adjustedCurve = (x: number) => {
      const complexityWave = mode === 'underfit' ? 0 : Math.sin(x * (complexity * 0.7)) * complexity * 0.008;
      const overfitWave = mode === 'overfit' ? Math.sin(x * (complexity + 2)) * complexity * 0.015 : 0;
      return config.curve(x) + complexityWave + overfitWave;
    };
    const targetPath = buildPath(targetFunction);
    const fitPath = buildPath(adjustedCurve);
    const sampleDots = points.map((point, index) => {
      const jitter = Math.sin(index * 1.9) * noise * 0.012;
      const y = Math.max(0.12, Math.min(0.9, point.y + jitter));
      return { ...point, y, ...toPoint(point.x, y) };
    });

    return { targetPath, fitPath, sampleDots };
  }, [complexity, config, mode, noise]);

  return (
    <DemoFrame
      title="函数拟合（Function Fitting）"
      hint="切换拟合方式，对比同一批样本如何得到欠拟合、平衡拟合和过拟合三种结果。"
      testId="demo-function-fitting"
    >
      <div className="flex flex-wrap gap-2">
        {(Object.keys(modes) as FitMode[]).map((item) => (
          <button
            key={item}
            type="button"
            className={`demo-button ${item === mode ? 'demo-button-active' : ''}`}
            aria-pressed={item === mode}
            onClick={() => setMode(item)}
          >
            {item === 'overfit' ? '过拟合' : modes[item].label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 rounded border border-line bg-white/[0.035] p-3 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-zinc-300">
          <span className="font-semibold text-zinc-100">噪声强度</span>
          <input
            aria-label="噪声强度"
            type="range"
            min="0"
            max="8"
            value={noise}
            onChange={(event) => setNoise(Number(event.target.value))}
            className="accent-signal"
          />
          <span className="text-xs text-zinc-500">当前噪声：{noise}</span>
        </label>
        <label className="grid gap-2 text-sm text-zinc-300">
          <span className="font-semibold text-zinc-100">模型复杂度</span>
          <input
            aria-label="模型复杂度"
            type="number"
            min="1"
            max="10"
            value={complexity}
            onChange={(event) => {
              const rawValue = event.target.value;
              const numericValue = Number(rawValue.length > 1 ? rawValue.slice(-1) : rawValue);
              setComplexity(Math.max(1, Math.min(10, numericValue || 1)));
            }}
            className="rounded border border-line bg-black/30 px-3 py-2 text-white outline-none focus:border-signal"
          />
          <span className="text-xs text-zinc-500">当前复杂度：{complexity}</span>
        </label>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_0.9fr]">
        <div
          data-testid="function-fitting-chart"
          className="rounded border border-line bg-black/20 p-3"
        >
            <svg viewBox="0 0 420 220" className="block h-auto w-full" role="img" aria-label="函数拟合图表">
            <defs>
              <linearGradient id="fitGrid" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="rgba(255,255,255,0.04)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
              </linearGradient>
            </defs>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((tick) => (
              <g key={tick}>
                <line x1={20 + tick * 50} y1="18" x2={20 + tick * 50} y2="198" stroke="url(#fitGrid)" strokeWidth="1" />
                <line x1="20" y1={18 + tick * 30} x2="400" y2={18 + tick * 30} stroke="url(#fitGrid)" strokeWidth="1" />
              </g>
            ))}
            <line x1="20" y1="198" x2="400" y2="198" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
            <line x1="20" y1="18" x2="20" y2="198" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
            <path d={chart.targetPath} fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="7 6" />
            <path d={chart.fitPath} fill="none" stroke="#3dd6c6" strokeWidth="3.5" />
            {chart.sampleDots.map((point, index) => (
              <circle key={`${point.cx}-${index}`} cx={point.cx} cy={point.cy} r="4.5" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.2" />
            ))}
          </svg>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber" />
              目标函数
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-signal" />
              拟合曲线
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white" />
              采样点
            </span>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="rounded border border-line bg-white/[0.035] p-4">
            <p className="text-sm font-semibold text-white">{config.label}</p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">{config.note}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-zinc-400">{config.emphasis}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded border border-line bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">训练误差</div>
              <div className="mt-2 text-3xl font-semibold text-white">{config.trainError}</div>
            </div>
            <div className="rounded border border-line bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">测试误差</div>
              <div className="mt-2 text-3xl font-semibold text-white">{config.testError}</div>
            </div>
          </div>

          <div className="rounded border border-line bg-black/20 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">泛化提示</div>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              {mode === 'overfit'
                ? '训练误差很低看起来很好，但曲线偏离真实函数，导致测试误差变差。'
                : '目标曲线保持平滑，拟合也受控制，模型没有对样本噪声过度反应。'}
            </p>
          </div>
        </div>
      </div>
    </DemoFrame>
  );
}
