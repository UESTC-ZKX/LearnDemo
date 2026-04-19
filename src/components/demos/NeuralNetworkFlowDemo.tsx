import { useEffect, useMemo, useState } from 'react';
import { DemoFrame } from './DemoFrame';

type FlowMode = 'forward' | 'backprop' | 'vanishing' | 'exploding';

interface FlowConfig {
  label: string;
  direction: string;
  gradientScale: string;
  activationScale: string;
  sampleTask: string;
  equationHint: string;
  stroke: string;
  pulse: string;
  reverse: boolean;
}

interface NetworkNode {
  id: string;
  label: string;
  x: number;
  y: number;
  layerIndex: number;
}

interface SignalDot {
  cx: number;
  cy: number;
  r: number;
  opacity: number;
}

const flowModes: Record<FlowMode, FlowConfig> = {
  forward: {
    label: '前向传播',
    direction: '从左到右',
    gradientScale: '稳定',
    activationScale: '均衡',
    sampleTask: '输入特征 -> 预测输出（分类示例）',
    equationHint: 'y = f(Wx + b)',
    stroke: '#3dd6c6',
    pulse: '#f59e0b',
    reverse: false,
  },
  backprop: {
    label: '反向传播',
    direction: '从右到左',
    gradientScale: '较强',
    activationScale: '用于修正',
    sampleTask: '损失误差 -> 参数更新（反向链路）',
    equationHint: 'W <- W - eta * dL/dW',
    stroke: '#f59e0b',
    pulse: '#f97316',
    reverse: true,
  },
  vanishing: {
    label: '梯度消失',
    direction: '从右到左',
    gradientScale: '很小',
    activationScale: '逐层衰减',
    sampleTask: '长序列中，早期层几乎收不到有效梯度',
    equationHint: '||dL/dh_t|| -> 0',
    stroke: '#64748b',
    pulse: '#94a3b8',
    reverse: true,
  },
  exploding: {
    label: '梯度爆炸',
    direction: '从右到左',
    gradientScale: '过大',
    activationScale: '不稳定',
    sampleTask: '更新幅度过大，训练过程产生震荡',
    equationHint: '||dL/dh_t|| -> infinity',
    stroke: '#ef4444',
    pulse: '#fb7185',
    reverse: true,
  },
};

const layerSpecs = [
  { label: '输入层', nodes: ['x1', 'x2', 'x3'], x: 72 },
  { label: '隐藏层', nodes: ['h1', 'h2', 'h3', 'h4'], x: 220 },
  { label: '输出层', nodes: ['y1', 'y2'], x: 368 },
];

function buildNetworkNodes(): NetworkNode[][] {
  const centerY = 138;

  return layerSpecs.map((layer, layerIndex) => {
    const gap = layer.nodes.length === 4 ? 34 : 42;
    const firstY = centerY - ((layer.nodes.length - 1) * gap) / 2;

    return layer.nodes.map((label, nodeIndex) => ({
      id: `${layer.label}-${label}`,
      label,
      x: layer.x,
      y: firstY + nodeIndex * gap,
      layerIndex,
    }));
  });
}

function lerp(start: number, end: number, ratio: number) {
  return start + (end - start) * ratio;
}

function buildSignalDots(mode: FlowMode, phase: number): SignalDot[] {
  const startX = mode === 'forward' ? 72 : 368;
  const endX = mode === 'forward' ? 368 : 72;
  const baseY = mode === 'forward' ? 118 : 158;

  return [0, 0.28, 0.56].map((offset, index) => {
    const t = (phase + offset) % 1;
    const distanceRatio = mode === 'forward' ? t : 1 - t;
    const cx = lerp(startX, endX, t);
    const cy = baseY + Math.sin((t + index * 0.3) * Math.PI * 2) * 16;
    const rBase = mode === 'exploding' ? 4 + distanceRatio * 7 : 5 - (mode === 'vanishing' ? distanceRatio * 2.6 : 0);
    const opacityBase = mode === 'vanishing' ? Math.max(0.18, 1 - distanceRatio * 0.72) : Math.min(1, 0.42 + distanceRatio * 0.58);

    return {
      cx,
      cy,
      r: Math.max(2.1, rBase),
      opacity: opacityBase,
    };
  });
}

function getConnectionEndpoints(source: NetworkNode, target: NetworkNode, reverse: boolean) {
  return reverse
    ? { x1: target.x - 16, y1: target.y, x2: source.x + 16, y2: source.y }
    : { x1: source.x + 16, y1: source.y, x2: target.x - 16, y2: target.y };
}

interface NeuralNetworkFlowDemoProps {
  focus?: FlowMode;
}

export function NeuralNetworkFlowDemo({ focus = 'forward' }: NeuralNetworkFlowDemoProps) {
  const [mode, setMode] = useState<FlowMode>(focus);
  const [isPlaying, setIsPlaying] = useState(true);
  const [tick, setTick] = useState(0);
  const config = flowModes[mode];

  useEffect(() => {
    setMode(focus);
  }, [focus]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timer = window.setInterval(() => {
      setTick((current) => (current + 1) % 1200);
    }, 80);

    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const layers = useMemo(() => buildNetworkNodes(), []);
  const phase = (tick % 100) / 100;
  const signalDots = buildSignalDots(mode, phase);
  const strokeOpacity = mode === 'vanishing' ? 0.28 : mode === 'exploding' ? 0.95 : 0.78;
  const strokeWidth = mode === 'exploding' ? 3 : mode === 'vanishing' ? 1.1 : 2;
  const nodeScale = mode === 'vanishing' ? 0.92 : mode === 'exploding' ? 1.08 : 1;
  const phaseLabel =
    mode === 'forward'
      ? '激活值向前计算'
      : mode === 'backprop'
        ? '误差向前层回传'
        : mode === 'vanishing'
          ? '梯度逐层变弱'
          : '梯度逐层放大';

  return (
    <DemoFrame
      title="神经网络传播（Neural Network Flow）"
      hint="切换学习过程，观察信号方向、梯度尺度和节点状态如何变化。"
      testId="demo-neural-network-flow"
    >
      <div className="flex flex-wrap gap-2" data-testid="nn-mode-controls">
        {(Object.keys(flowModes) as FlowMode[]).map((item) => (
          <button
            key={item}
            type="button"
            className={`demo-button ${item === mode ? 'demo-button-active' : ''}`}
            aria-pressed={item === mode}
            onClick={() => setMode(item)}
          >
            {flowModes[item].label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.25fr_0.95fr]">
        <div data-testid="neural-network-flow-diagram" className="rounded border border-line bg-black/20 p-3">
          <svg viewBox="0 0 440 270" className="block h-auto w-full" role="img" aria-label="神经网络传播示意图">
            <defs>
              <marker id="nnArrow" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={config.stroke} />
              </marker>
              <filter id="nodeGlow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {layers.slice(0, -1).map((layer, layerIndex) => {
              const nextLayer = layers[layerIndex + 1];

              return layer.flatMap((source) =>
                nextLayer.map((target) => {
                  const endpoint = getConnectionEndpoints(source, target, config.reverse);

                  return (
                    <line
                      key={`${source.id}-${target.id}`}
                      {...endpoint}
                      stroke={config.stroke}
                      strokeOpacity={strokeOpacity}
                      strokeWidth={strokeWidth}
                      markerEnd="url(#nnArrow)"
                    />
                  );
                }),
              );
            })}

            {signalDots.map((dot, index) => (
              <circle
                key={`signal-dot-${index}`}
                cx={dot.cx}
                cy={dot.cy}
                r={isPlaying ? dot.r : dot.r * 0.75}
                fill={config.pulse}
                opacity={isPlaying ? dot.opacity : 0.35}
                filter="url(#nodeGlow)"
              />
            ))}

            {layers.map((layer, layerIndex) => (
              <g key={layerSpecs[layerIndex].label}>
                <text x={layerSpecs[layerIndex].x} y="30" textAnchor="middle" fill="#cbd5e1" fontSize="12" fontWeight="700">
                  {layerSpecs[layerIndex].label}
                </text>
                {layer.map((node) => (
                  <g key={node.id}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={15 * nodeScale}
                      fill={node.layerIndex === 1 ? 'rgba(255,255,255,0.075)' : 'rgba(255,255,255,0.11)'}
                      stroke={node.layerIndex === 1 ? config.pulse : '#94a3b8'}
                      strokeWidth={mode === 'vanishing' ? 1.2 : 2}
                    />
                    <text x={node.x} y={node.y + 4} textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="700">
                      {node.label}
                    </text>
                  </g>
                ))}
              </g>
            ))}
          </svg>

          <div className="mt-3 flex items-center justify-between rounded border border-line bg-zinc-950/70 px-3 py-2 text-xs text-zinc-400">
            <span>动画状态</span>
            <span className={isPlaying ? 'text-signal' : 'text-amber'}>{isPlaying ? '播放中' : '已暂停'}</span>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="rounded border border-line bg-white/[0.035] p-4">
            <p className="text-sm font-semibold text-white">{config.label}</p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">信号方向：{config.label}，{config.direction}</p>
            <p className="mt-1 text-sm leading-6 text-zinc-300">梯度尺度：{config.gradientScale}</p>
            <p className="mt-1 text-sm leading-6 text-zinc-300">当前阶段：{phaseLabel}</p>
          </div>

          <div className="rounded border border-line bg-black/20 p-4">
            <div className="mb-3 text-xs uppercase tracking-[0.18em] text-zinc-400">动画控制</div>
            <button
              type="button"
              className="control-button w-full"
              data-testid="nn-playback-control"
              onClick={() => setIsPlaying((current) => !current)}
            >
              {isPlaying ? '暂停动画' : '播放动画'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded border border-line bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">激活尺度</div>
              <div className="mt-2 text-2xl font-semibold text-white">{config.activationScale}</div>
            </div>
            <div className="rounded border border-line bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">流动类型</div>
              <div className="mt-2 text-2xl font-semibold text-white">{config.reverse ? '反向' : '正向'}</div>
            </div>
          </div>

          <div className="rounded border border-line bg-black/20 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">信号解读</div>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              {mode === 'vanishing' && '梯度在回传过程中逐层变小，早期层几乎收不到有效学习信号。'}
              {mode === 'exploding' && '梯度在回传过程中增长过快，参数更新会变得不稳定。'}
              {mode === 'backprop' && '误差信号从输出层回传到隐藏层和输入层，让每一层根据损失调整权重。'}
              {mode === 'forward' && '输入特征沿网络向前计算，经过隐藏层组合后在输出层形成预测结果。'}
            </p>
            <div className="mt-3 rounded border border-line bg-zinc-950/70 p-3 text-sm text-zinc-300">
              <p>
                <span className="font-semibold text-signal">示例：</span>
                {config.sampleTask}
              </p>
              <p className="mt-2">
                <span className="font-semibold text-amber">公式：</span>
                {config.equationHint}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DemoFrame>
  );
}
