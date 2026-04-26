import { useEffect, useMemo, useState } from 'react';
import { MoeMetricsDemo } from './demos/MoeMetricsDemo';
import { buildBackpropDemoUrl, buildPerceptronDemoUrl, buildTransformerDemoUrl } from '../utils/perceptronDemoMode';

type LabId =
  | 'neuron-perceptron'
  | 'perceptron-classification'
  | 'multilayer-backprop'
  | 'cnn-patches'
  | 'rnn-generation'
  | 'transformer-architecture'
  | 'dense-moe';

interface TechnicalLab {
  id: LabId;
  title: string;
  eyebrow: string;
  summary: string;
  talk: string;
}

const labs: TechnicalLab[] = [
  {
    id: 'neuron-perceptron',
    title: '神经元模型 vs 感知机',
    eyebrow: '从固定逻辑到可学习权重',
    summary: '二者都把输入加权后做阈值判断，但感知机的关键进步是能用样本修正权重。',
    talk: '讲述时先承认它们“长得像”：输入、权重、阈值、输出。再强调差异：麦卡洛克-皮茨神经元更像手写逻辑门，感知机开始把权重交给数据来决定。',
  },
  {
    id: 'perceptron-classification',
    title: '感知机分类实验',
    eyebrow: '样本、目标与更新',
    summary: '用二维样本展示分类目标，说明拟合是学习视角，感知机是具体建模方式。',
    talk: '这里不要只说“拟合函数”，而是给观众一批点：横轴是特征 1，纵轴是特征 2，目标是学出一条能分开两类样本的直线。',
  },
  {
    id: 'multilayer-backprop',
    title: '单层到多层，再到反向传播',
    eyebrow: '表达力与训练信号',
    summary: '单层模型受线性边界限制，多层网络表达力更强，但需要把误差信号分配回每层参数。',
    talk: '过渡重点是：加层不难，训练才难。反向传播的意义不是“网络会学习”的口号，而是把输出误差沿链式法则传回前面每一层。',
  },
  {
    id: 'cnn-patches',
    title: 'CNN：乱序切块识别',
    eyebrow: '局部模式与权重共享',
    summary: '即使图像块顺序被打乱，CNN 仍能先识别边缘、纹理和局部部件，再组合成更高层语义。',
    talk: '把图像看成拼图：切块顺序乱了，全局形状会受影响，但局部边缘和纹理仍然可被卷积核扫描到。',
  },
  {
    id: 'rnn-generation',
    title: 'RNN：逐 token 循环生成',
    eyebrow: '状态链与长程依赖',
    summary: 'RNN 每一步读入当前 token 和上一时刻状态，再产生新状态与下一个 token 的预测。',
    talk: '用“我 / 喜欢 / 学习 / AI”这样的短序列演示，每一步都依赖前一步状态。然后自然引出：序列变长后，早期信息路径太长。',
  },
  {
    id: 'transformer-architecture',
    title: 'Transformer：编码器与解码器',
    eyebrow: '论文经典结构的教学重绘',
    summary: '重绘 Attention Is All You Need 的编码器-解码器结构，并解释每个模块如何协作。',
    talk: '先让观众看到整体：左边编码输入，右边逐步生成输出。再拆开讲 self-attention、cross-attention、feed-forward、残差和 softmax。',
  },
  {
    id: 'dense-moe',
    title: '稠密模型 vs MoE',
    eyebrow: '全量激活与专家路由',
    summary: '稠密模型通常没有专家路由概念，MoE 才会为不同输入选择部分专家参与计算。',
    talk: '回答要干脆：稠密模型不是“所有专家都激活”，而是本来没有专家划分；MoE 引入专家和路由器，才有“选哪些专家”的问题。',
  },
];

const perceptronSamples = [
  { name: '样本 A', x1: 1, x2: 2, label: '+1', prediction: '-1', update: '+eta * [1, 2]' },
  { name: '样本 B', x1: 2, x2: 1, label: '+1', prediction: '+1', update: '不更新' },
  { name: '样本 C', x1: -1, x2: -2, label: '-1', prediction: '+1', update: '-eta * [-1, -2]' },
  { name: '样本 D', x1: -2, x2: -1, label: '-1', prediction: '-1', update: '不更新' },
];

const transformerBlocks = [
  ['Input Embedding', '把 token 变成向量'],
  ['Positional Encoding', '加入顺序信息'],
  ['Encoder Self-Attention', '输入 token 彼此关注'],
  ['Feed Forward', '逐位置非线性变换'],
  ['Decoder Masked Self-Attention', '生成时只能看已生成 token'],
  ['Encoder-Decoder Attention', '输出端回看输入语义'],
  ['Linear + Softmax', '得到下一个 token 概率'],
];

function PerceptronMiniPlane() {
  const minCoordinate = -2.8;
  const maxCoordinate = 2.8;

  function mapX(value: number) {
    return 24 + ((value - minCoordinate) / (maxCoordinate - minCoordinate)) * 232;
  }

  function mapY(value: number) {
    return 256 - 24 - ((value - minCoordinate) / (maxCoordinate - minCoordinate)) * 232;
  }

  return (
    <svg className="mt-4 w-full rounded-2xl border border-line bg-zinc-950/70 p-3" viewBox="0 0 280 280" aria-label="感知机二维平面示意图">
      <rect fill="rgba(255,255,255,0.02)" height="280" rx="20" width="280" />
      {[0, 1, 2, 3, 4].map((index) => {
        const offset = 24 + index * 58;
        return (
          <g key={index}>
            <line
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="4 8"
              strokeWidth="1"
              x1={offset}
              x2={offset}
              y1="24"
              y2="256"
            />
            <line
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="4 8"
              strokeWidth="1"
              x1="24"
              x2="256"
              y1={offset}
              y2={offset}
            />
          </g>
        );
      })}

      <line stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" x1="24" x2="256" y1={mapY(0)} y2={mapY(0)} />
      <line stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" x1={mapX(0)} x2={mapX(0)} y1="24" y2="256" />
      <path d={`M ${mapX(-2.4)} ${mapY(-0.6)} L ${mapX(2.4)} ${mapY(0.8)}`} fill="none" stroke="#ffffff" strokeWidth="3" />

      {perceptronSamples.map((sample) => (
        <g key={sample.name}>
          <circle
            cx={mapX(sample.x1)}
            cy={mapY(sample.x2)}
            fill={sample.label === '+1' ? '#3dd6c6' : '#f59e0b'}
            r="12"
            stroke="rgba(8,9,11,0.9)"
            strokeWidth="2"
          />
          <text
            fill="#ffffff"
            fontSize="11"
            fontWeight="700"
            textAnchor="middle"
            x={mapX(sample.x1)}
            y={mapY(sample.x2) + 4}
          >
            {sample.name.split(' ')[1]}
          </text>
        </g>
      ))}

      <text fill="rgba(255,255,255,0.54)" fontSize="12" x="260" y={mapY(0) + 4}>
        x1
      </text>
      <text fill="rgba(255,255,255,0.54)" fontSize="12" x={mapX(0) - 5} y="18">
        x2
      </text>
    </svg>
  );
}

function NeuronPerceptronLab() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded border border-line bg-black/20 p-4">
        <h4 className="text-base font-semibold text-white">麦卡洛克-皮茨神经元</h4>
        <p className="mt-2 text-sm leading-6 text-zinc-300">人工设定权重和阈值，用来表达 AND、OR 这类二值逻辑。</p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-zinc-200">
          <span className="rounded border border-line px-3 py-2">x1</span>
          <span className="rounded border border-line px-3 py-2">x2</span>
          <span className="text-zinc-500">-&gt;</span>
          <span className="rounded border border-signal/60 bg-signal/10 px-3 py-2">固定阈值</span>
          <span className="text-zinc-500">-&gt;</span>
          <span className="rounded border border-line px-3 py-2">0 / 1</span>
        </div>
      </div>
      <div className="rounded border border-line bg-black/20 p-4">
        <h4 className="text-base font-semibold text-white">感知机</h4>
        <p className="mt-2 text-sm leading-6 text-zinc-300">结构很像，但权重不再完全手写，而是根据分类错误持续更新。</p>
        <div className="mt-4 rounded border border-line bg-zinc-950/70 p-3 text-sm leading-6 text-zinc-300">
          y = sign(w1*x1 + w2*x2 + b)
          <br />
          预测错时：w &lt;- w + eta * y * x
        </div>
      </div>
    </div>
  );
}

function PerceptronClassificationLab() {
  const [isPopupBlocked, setIsPopupBlocked] = useState(false);

  function handleOpenDemo() {
    const nextWindow = window.open(buildPerceptronDemoUrl(window.location), '_blank', 'noopener,noreferrer');
    setIsPopupBlocked(nextWindow === null);
  }

  return (
    <div data-testid="perceptron-classification-lab" className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded border border-line bg-black/20 p-4">
        <h4 className="text-base font-semibold text-white">二维平面分类</h4>
        <p className="mt-2 text-sm leading-6 text-zinc-300">
          先把样本点放到平面上看。感知机做的事并不神秘，本质就是学一条直线，把正负样本推到边界两侧。
        </p>
        <PerceptronMiniPlane />
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {perceptronSamples.map((sample) => (
            <div key={sample.name} className="rounded border border-line bg-zinc-950/70 p-3 text-sm leading-6 text-zinc-300">
              <div className="font-semibold text-white">{sample.name}</div>
              <div>坐标：({sample.x1}, {sample.x2})</div>
              <div>目标：{sample.label}，预测：{sample.prediction}</div>
              <div className="text-signal">更新：{sample.update}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded border border-line bg-black/20 p-4">
        <h4 className="text-base font-semibold text-white">从一条线讲到 XOR</h4>
        <p className="mt-2 text-sm leading-6 text-zinc-300">
          感知机的经典更新可看作错分样本推动决策边界移动：预测错了，就沿着让目标类别得分变高的方向修正权重。
        </p>
        <div className="mt-4 rounded border border-line bg-zinc-950/70 p-3 text-sm leading-6 text-zinc-300">
          score = w*x + b
          <br />
          y_hat = sign(score)
          <br />
          若 y_hat != y：
          <br />
          w &lt;- w + eta * y * x
          <br />
          b &lt;- b + eta * y
        </div>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          “拟合”是算法层面在调参数，“感知机”是建模层面的一个具体可学习分类器。
        </p>
        <div className="mt-4 rounded border border-amber/50 bg-amber/10 p-4 text-sm leading-6 text-zinc-200">
          XOR 是单层感知机的经典能力边界。因为它只能形成一条线性边界，所以无论怎么训练，都不可能把对角线上同类的点同时分开。
        </div>
        <button
          data-testid="open-perceptron-demo"
          type="button"
          className="mt-4 rounded border border-signal/60 bg-signal/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-signal/20"
          onClick={handleOpenDemo}
        >
          打开完整 Demo
        </button>
        {isPopupBlocked ? (
          <p className="mt-3 text-sm leading-6 text-amber">
            浏览器阻止了新窗口，请允许弹窗后再次点击。
          </p>
        ) : null}
      </div>
    </div>
  );
}

function MultilayerBackpropLab() {
  const [isPopupBlocked, setIsPopupBlocked] = useState(false);

  function handleOpenBackpropDemo() {
    const nextWindow = window.open(buildBackpropDemoUrl(window.location), '_blank', 'noopener,noreferrer');
    setIsPopupBlocked(nextWindow === null);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded border border-line bg-black/20 p-4">
        <h4 className="text-base font-semibold text-white">前向、损失、反向、更新</h4>
        <p className="mt-2 text-sm leading-6 text-zinc-300">
          多层网络真正难的不是“加层”，而是怎么把输出端的损失拆回到每一层参数上。反向传播就是把这条因果链算清楚。
        </p>
        <svg className="mt-4 w-full rounded-2xl border border-line bg-zinc-950/70 p-3" viewBox="0 0 320 180" aria-label="反向传播轻讲解示意图">
          <rect width="320" height="180" rx="18" fill="rgba(255,255,255,0.02)" />
          <line x1="72" y1="72" x2="160" y2="88" stroke="rgba(61,214,198,0.85)" strokeWidth="3" />
          <line x1="72" y1="124" x2="160" y2="102" stroke="rgba(61,214,198,0.85)" strokeWidth="3" />
          <line x1="160" y1="88" x2="248" y2="96" stroke="rgba(245,158,11,0.9)" strokeWidth="3" />
          <line x1="160" y1="102" x2="248" y2="96" stroke="rgba(245,158,11,0.9)" strokeWidth="3" />
          {[['x1', 56, 72], ['x2', 56, 124], ['h1', 160, 88], ['h2', 160, 102], ['y', 264, 96]].map(([label, x, y]) => (
            <g key={label}>
              <circle cx={x} cy={y} r="16" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.42)" strokeWidth="2" />
              <text x={x} y={Number(y) + 4} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700">
                {label}
              </text>
            </g>
          ))}
          <text x="22" y="32" fill="rgba(255,255,255,0.52)" fontSize="11">前向算预测</text>
          <text x="214" y="32" fill="rgba(255,255,255,0.52)" fontSize="11">loss 反向拆梯度</text>
        </svg>
      </div>

      <div className="rounded border border-line bg-black/20 p-4">
        <h4 className="text-base font-semibold text-white">把误差拆回每一层</h4>
        <div className="mt-4 grid gap-3">
          {[
            ['前向传播', '先算出隐藏层激活值、输出值和当前损失。'],
            ['链式法则', '从输出端开始，逐层乘上上游误差和本层局部导数。'],
            ['参数更新', '用梯度修正权重和偏置，让下一次预测更接近目标。'],
          ].map(([title, body]) => (
            <div key={title} className="rounded border border-line bg-zinc-950/70 p-3 text-sm leading-6 text-zinc-300">
              <span className="font-semibold text-white">{title}：</span>
              {body}
            </div>
          ))}
        </div>
        <button
          data-testid="open-backprop-demo"
          type="button"
          className="mt-4 rounded border border-amber/60 bg-amber/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber/20"
          onClick={handleOpenBackpropDemo}
        >
          打开完整 Demo
        </button>
        {isPopupBlocked ? (
          <p className="mt-3 text-sm leading-6 text-amber">浏览器阻止了新窗口，请允许弹窗后再次点击。</p>
        ) : null}
      </div>
    </div>
  );
}

function ShuffledPatchLab() {
  const patches = ['边缘', '纹理', '角点', '轮廓', '局部部件', '背景'];

  return (
    <div data-testid="shuffled-patch-lab" className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
      <div className="rounded border border-line bg-black/20 p-4">
        <h4 className="text-base font-semibold text-white">乱序切块识别</h4>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {patches.map((patch, index) => (
            <div
              key={patch}
              className="flex aspect-square items-center justify-center rounded border border-line text-sm font-semibold text-white"
              style={{ backgroundColor: index % 2 === 0 ? 'rgba(61, 214, 198, 0.16)' : 'rgba(245, 158, 11, 0.18)' }}
            >
              {patch}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded border border-line bg-black/20 p-4">
        <h4 className="text-base font-semibold text-white">讲述重点</h4>
        <p className="mt-2 text-sm leading-6 text-zinc-300">
          CNN 的卷积核像一个小窗口，在不同位置复用同一组参数。乱序会破坏整体布局，但局部纹理和边缘仍能被扫描出来。
        </p>
        <p className="mt-3 rounded border border-line bg-zinc-950/70 p-3 text-sm leading-6 text-zinc-300">
          局部识别 {'->'} 特征组合 {'->'} 高层语义，这是 CNN 从像素到对象的典型解释路径。
        </p>
      </div>
    </div>
  );
}

function TokenGenerationLab() {
  const steps = [
    ['输入', '我', 'h1'],
    ['输入', '喜欢', 'h2'],
    ['输入', '学习', 'h3'],
    ['生成', 'AI', 'h4'],
  ];

  return (
    <div data-testid="token-generation-lab" className="rounded border border-line bg-black/20 p-4">
      <h4 className="text-base font-semibold text-white">逐 token 循环生成</h4>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        {steps.map(([kind, token, state], index) => (
          <div key={`${token}-${state}`} className="rounded border border-line bg-zinc-950/70 p-3">
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">step {index + 1}</div>
            <div className="mt-2 text-lg font-semibold text-white">{kind}：{token}</div>
            <div className="mt-2 text-sm text-signal">隐藏状态：{state}</div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm leading-6 text-zinc-300">
        每一步都依赖上一时刻状态，所以顺序建模自然，但并行效率有限，长距离信息也要穿过很长的状态链。
      </p>
    </div>
  );
}

function TransformerArchitectureLab() {
  const [isPopupBlocked, setIsPopupBlocked] = useState(false);

  function handleOpenTransformerDemo() {
    const nextWindow = window.open(buildTransformerDemoUrl(window.location), '_blank', 'noopener,noreferrer');
    setIsPopupBlocked(nextWindow === null);
  }

  return (
    <div data-testid="transformer-architecture-lab" className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded border border-signal/60 bg-signal/10 p-4 lg:col-span-2">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h4 className="text-base font-semibold text-white">Transformer 完整教学页</h4>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              从经典 Encoder-Decoder 架构图开始，拆解模块职责，最后演示 I love AI 到 我爱人工智能 的翻译全链路。
            </p>
          </div>
          <button
            data-testid="open-transformer-demo"
            type="button"
            className="rounded border border-signal/60 bg-signal/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-signal/20"
            onClick={handleOpenTransformerDemo}
          >
            打开完整 Demo
          </button>
        </div>
        {isPopupBlocked ? (
          <p className="mt-3 text-sm leading-6 text-amber">浏览器阻止了新窗口，请允许弹窗后再次点击。</p>
        ) : null}
      </div>
      <div className="rounded border border-line bg-black/20 p-4">
        <h4 className="text-base font-semibold text-white">Transformer 架构教学重绘</h4>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded border border-signal/60 bg-signal/10 p-3">
            <div className="text-sm font-semibold text-white">Encoder</div>
            <div className="mt-3 grid gap-2 text-sm text-zinc-200">
              <span className="rounded border border-line bg-black/20 px-3 py-2">Input Embedding</span>
              <span className="rounded border border-line bg-black/20 px-3 py-2">Positional Encoding</span>
              <span className="rounded border border-line bg-black/20 px-3 py-2">Multi-Head Self-Attention</span>
              <span className="rounded border border-line bg-black/20 px-3 py-2">Feed Forward</span>
            </div>
          </div>
          <div className="rounded border border-amber/60 bg-amber/10 p-3">
            <div className="text-sm font-semibold text-white">Decoder</div>
            <div className="mt-3 grid gap-2 text-sm text-zinc-200">
              <span className="rounded border border-line bg-black/20 px-3 py-2">Output Embedding</span>
              <span className="rounded border border-line bg-black/20 px-3 py-2">Masked Self-Attention</span>
              <span className="rounded border border-line bg-black/20 px-3 py-2">Encoder-Decoder Attention</span>
              <span className="rounded border border-line bg-black/20 px-3 py-2">Linear + Softmax</span>
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs leading-5 text-zinc-500">参考论文：Attention Is All You Need, Figure 1 的编码器-解码器结构。</p>
      </div>
      <div className="rounded border border-line bg-black/20 p-4">
        <h4 className="text-base font-semibold text-white">模块作用</h4>
        <div className="mt-3 grid gap-2">
          {transformerBlocks.map(([title, body]) => (
            <div key={title} className="rounded border border-line bg-zinc-950/70 p-3 text-sm leading-6 text-zinc-300">
              <span className="font-semibold text-signal">{title}：</span>
              {body}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DenseMoeLab() {
  return (
    <div className="grid gap-4">
      <div data-testid="dense-moe-explanation" className="rounded border border-line bg-black/20 p-4 text-sm leading-6 text-zinc-300">
        稠密模型通常没有专家路由的概念：一次推理会沿完整网络做计算。MoE（Mixture of Experts，混合专家）会把前馈层拆成多个专家，再由路由器为每个 token 选择少数专家。
      </div>
      <MoeMetricsDemo />
    </div>
  );
}

function renderLab(id: LabId) {
  if (id === 'neuron-perceptron') {
    return <NeuronPerceptronLab />;
  }

  if (id === 'perceptron-classification') {
    return <PerceptronClassificationLab />;
  }

  if (id === 'multilayer-backprop') {
    return <MultilayerBackpropLab />;
  }

  if (id === 'cnn-patches') {
    return <ShuffledPatchLab />;
  }

  if (id === 'rnn-generation') {
    return <TokenGenerationLab />;
  }

  if (id === 'transformer-architecture') {
    return <TransformerArchitectureLab />;
  }

  return <DenseMoeLab />;
}

interface TechnicalEvolutionLabsProps {
  highlightedLabId?: string;
}

export function TechnicalEvolutionLabs({ highlightedLabId }: TechnicalEvolutionLabsProps) {
  const [activeId, setActiveId] = useState<LabId>('neuron-perceptron');
  const active = useMemo(() => labs.find((lab) => lab.id === activeId) ?? labs[0], [activeId]);

  useEffect(() => {
    if (highlightedLabId && labs.some((lab) => lab.id === highlightedLabId)) {
      setActiveId(highlightedLabId as LabId);
    }
  }, [highlightedLabId]);

  return (
    <section className="rounded border border-line bg-white/[0.035] p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber">第二段</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">第二段：专题实验卡</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">
            从实际技术演进视角讲机制：先讲可学习权重，再讲多层训练、视觉、序列、注意力和稀疏扩展。
          </p>
        </div>
        <div className="rounded border border-line bg-black/20 px-3 py-2 text-sm text-zinc-300">技术细节区</div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {labs.map((lab) => (
          <button
            key={lab.id}
            type="button"
            data-testid={`tech-lab-trigger-${lab.id}`}
            className={`rounded border p-4 text-left transition ${
              activeId === lab.id ? 'border-signal/70 bg-signal/10' : 'border-line bg-black/20 hover:border-signal/50'
            }`}
            onClick={() => setActiveId(lab.id)}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{lab.eyebrow}</span>
            <span className="mt-2 block text-base font-semibold text-white">{lab.title}</span>
            <span className="mt-2 block text-sm leading-6 text-zinc-400">{lab.summary}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 rounded border border-line bg-black/20 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-signal">{active.eyebrow}</p>
            <h4 className="mt-1 text-xl font-semibold text-white">{active.title}</h4>
            <p className="mt-2 text-sm leading-6 text-zinc-300">{active.summary}</p>
          </div>
          <div className="rounded border border-line bg-zinc-950/70 px-3 py-2 text-sm leading-6 text-zinc-300">
            <span className="font-semibold text-amber">展开讲述：</span>
            {active.talk}
          </div>
        </div>
        <div className="mt-5">{renderLab(active.id)}</div>
      </div>
    </section>
  );
}
