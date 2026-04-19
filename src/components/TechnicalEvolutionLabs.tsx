import { useMemo, useState } from 'react';
import { MoeMetricsDemo } from './demos/MoeMetricsDemo';

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
  return (
    <div data-testid="perceptron-classification-lab" className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded border border-line bg-black/20 p-4">
        <h4 className="text-base font-semibold text-white">二维分类样本</h4>
        <p className="mt-2 text-sm leading-6 text-zinc-300">目标：学出一条直线，把正样本和负样本分开。</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {perceptronSamples.map((sample) => (
            <div key={sample.name} className="rounded border border-line bg-zinc-950/70 p-3 text-sm leading-6 text-zinc-300">
              <div className="font-semibold text-white">{sample.name}</div>
              <div>输入：({sample.x1}, {sample.x2})</div>
              <div>目标：{sample.label}，预测：{sample.prediction}</div>
              <div className="text-signal">更新：{sample.update}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded border border-line bg-black/20 p-4">
        <h4 className="text-base font-semibold text-white">梯度下降怎么落地</h4>
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
      </div>
    </div>
  );
}

function MultilayerBackpropLab() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {[
        ['单层', '只能形成一条线性决策边界，遇到 XOR 这类线性不可分问题会失败。'],
        ['多层', '隐藏层可以组合特征，表达曲线、区域和更复杂的模式。'],
        ['反向传播', '用链式法则把损失对每个参数的影响算出来，再逐层更新。'],
      ].map(([title, body], index) => (
        <div key={title} className="rounded border border-line bg-black/20 p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded border border-signal/60 bg-signal/10 text-sm font-semibold text-white">
            {index + 1}
          </div>
          <h4 className="mt-3 text-base font-semibold text-white">{title}</h4>
          <p className="mt-2 text-sm leading-6 text-zinc-300">{body}</p>
        </div>
      ))}
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
  return (
    <div data-testid="transformer-architecture-lab" className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
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

export function TechnicalEvolutionLabs() {
  const [activeId, setActiveId] = useState<LabId>('neuron-perceptron');
  const active = useMemo(() => labs.find((lab) => lab.id === activeId) ?? labs[0], [activeId]);

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
