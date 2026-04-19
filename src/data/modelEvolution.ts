export type TimelineSpacingMode = 'equal' | 'chronological';

export const timelineModes: TimelineSpacingMode[] = ['equal', 'chronological'];

export const demoKeys = [
  'foundation',
  'fitting',
  'neural-network',
  'cnn-rnn',
  'transformer',
  'alignment',
  'moe',
] as const;

export type DemoKey = (typeof demoKeys)[number];

export interface ModelEvolutionTimelineItem {
  id: string;
  date: string;
  dateLabel: string;
  title: string;
  eraLabel: string;
  narration: string;
  demoKey: DemoKey;
  solvedProblem: string;
  limitation: string;
  nextTransition: string;
}

export interface ModelEvolutionDemo {
  key: DemoKey;
  title: string;
  summary: string;
  anchorIds: string[];
}

export interface PositionedTimelineItem extends ModelEvolutionTimelineItem {
  position: number;
  labelPosition: number;
}

export const modelEvolutionTimeline: ModelEvolutionTimelineItem[] = [
  {
    id: 'mcculloch-pitts',
    date: '1943-01-01',
    dateLabel: '1943',
    title: '麦卡洛克-皮茨神经元模型（McCulloch-Pitts Neuron）',
    eraLabel: '早期基础',
    narration: '二值神经元抽象把“智能如何推理”转成可以写成公式的数学模型。',
    demoKey: 'foundation',
    solvedProblem: '证明简单逻辑可以用神经元和阈值表达。',
    limitation: '它仍是固定规则推理，不会从数据中学习。',
    nextTransition: '下一步是追问：机器能否在行为上表现出智能。',
  },
  {
    id: 'turing-test',
    date: '1950-01-01',
    dateLabel: '1950',
    title: '图灵测试（Turing Test）',
    eraLabel: '早期基础',
    narration: '图灵把“机器是否智能”转化为可观察的对话表现。',
    demoKey: 'foundation',
    solvedProblem: '给机器智能提供了一个可讨论、可检验的外部标准。',
    limitation: '它评估行为结果，并不解释系统内部如何产生能力。',
    nextTransition: '接下来需要真正能从样本中学习的模型。',
  },
  {
    id: 'perceptron',
    date: '1958-01-01',
    dateLabel: '1958',
    title: '感知机（Perceptron）',
    eraLabel: '学习机制',
    narration: '可学习神经元开始通过样本更新权重。',
    demoKey: 'fitting',
    solvedProblem: '让模型能从数据中拟合简单决策边界。',
    limitation: '单层结构难以处理复杂非线性问题。',
    nextTransition: '更深的网络需要有效训练多层参数的方法。',
  },
  {
    id: 'backpropagation',
    date: '1986-01-01',
    dateLabel: '1986',
    title: '反向传播（Backpropagation）',
    eraLabel: '学习机制',
    narration: '梯度信号可以穿过多层网络，让深层网络变得可训练。',
    demoKey: 'neural-network',
    solvedProblem: '让多层神经网络在实践中可训练。',
    limitation: '训练仍依赖数据、算力和稳定架构。',
    nextTransition: '当训练可行后，关键问题变成：什么架构最适合不同数据结构。',
  },
  {
    id: 'lstm',
    date: '1997-01-01',
    dateLabel: '1997',
    title: '长短期记忆网络（LSTM）',
    eraLabel: '深度网络',
    narration: '门控机制帮助循环网络在更长序列中保留有用信息。',
    demoKey: 'neural-network',
    solvedProblem: '缓解梯度消失，并提升序列长程记忆能力。',
    limitation: '循环结构仍要逐步处理 token（词元），扩展效率有限。',
    nextTransition: '下一阶段会把视觉网络和序列模型推向更大规模。',
  },
  {
    id: 'cnn-lenet',
    date: '1998-01-01',
    dateLabel: '1998',
    title: '卷积神经网络 / LeNet（CNN / LeNet）',
    eraLabel: '深度网络',
    narration: '卷积让模型高效学习局部空间模式。',
    demoKey: 'neural-network',
    solvedProblem: '通过局部结构和权重共享提升视觉任务效率。',
    limitation: '它擅长图像，不天然解决所有序列问题。',
    nextTransition: '序列任务继续推动循环模型和后续注意力机制发展。',
  },
  {
    id: 'alexnet',
    date: '2012-01-01',
    dateLabel: '2012',
    title: 'AlexNet',
    eraLabel: '深度学习爆发',
    narration: '大规模深度 CNN 证明数据和算力可以带来能力跃迁。',
    demoKey: 'cnn-rnn',
    solvedProblem: '在图像基准上打开深度学习时代，让扩展收益变得具体。',
    limitation: '这种成功仍偏任务专用，不能直接处理序列生成。',
    nextTransition: '同一时期开始探索从一个序列映射到另一个序列的架构。',
  },
  {
    id: 'seq2seq',
    date: '2014-01-01',
    dateLabel: '2014',
    title: '序列到序列（Seq2Seq）',
    eraLabel: '深度学习爆发',
    narration: '编码器-解码器结构让一个序列自然映射到另一个序列。',
    demoKey: 'cnn-rnn',
    solvedProblem: '让机器翻译等输入到输出任务更自然。',
    limitation: '长序列仍会受循环状态瓶颈限制。',
    nextTransition: '注意力机制和自注意力会进一步移除这个瓶颈。',
  },
  {
    id: 'transformer',
    date: '2017-01-01',
    dateLabel: '2017',
    title: 'Transformer',
    eraLabel: '注意力机制',
    narration: '自注意力用 token（词元）之间的直接连接替代循环传递。',
    demoKey: 'transformer',
    solvedProblem: '缩短信号路径，并显著提升序列建模的可扩展性。',
    limitation: '它本身仍是通用架构，还不是可直接产品化的助手。',
    nextTransition: '大规模预训练会把架构变成语言能力平台。',
  },
  {
    id: 'bert-gpt1',
    date: '2018-06-01',
    dateLabel: '2018',
    title: 'BERT / GPT-1',
    eraLabel: '注意力机制',
    narration: '预训练证明一个通用基座模型可以迁移到许多任务。',
    demoKey: 'transformer',
    solvedProblem: '把许多自然语言处理任务统一到可复用表示上。',
    limitation: '模型能力增强了，但交互方式仍偏任务化，尚未形成产品级助手体验。',
    nextTransition: '规模化和指令微调会改变人类使用模型的方式。',
  },
  {
    id: 'gpt-3',
    date: '2020-05-28',
    dateLabel: '2020',
    title: 'GPT-3',
    eraLabel: '对齐与聊天',
    narration: '规模化让通用生成能力开始显得广泛可用。',
    demoKey: 'alignment',
    solvedProblem: '证明单个大规模预训练模型可以覆盖多类任务。',
    limitation: '原始提示不稳定，也不容易可靠控制。',
    nextTransition: '指令微调和聊天界面让模型更容易被人使用。',
  },
  {
    id: 'chatgpt',
    date: '2022-11-30',
    dateLabel: '2022-11-30',
    title: 'ChatGPT',
    eraLabel: '对齐与聊天',
    narration: '指令微调和反馈对齐让模型更像一个可对话、可使用的助手。',
    demoKey: 'alignment',
    solvedProblem: '把强生成器变成人类可以用自然语言驱动的产品能力。',
    limitation: '推理、可靠性和能力整合仍需要继续增强。',
    nextTransition: '下一阶段会走向更强推理和更广泛泛化。',
  },
  {
    id: 'gpt-4',
    date: '2023-03-14',
    dateLabel: '2023-03-14',
    title: 'GPT-4',
    eraLabel: '对齐与聊天',
    narration: '前沿能力转向更强推理、更高鲁棒性和多模态能力。',
    demoKey: 'alignment',
    solvedProblem: '提升可靠性，让高级模型行为更适合真实应用。',
    limitation: '能力增强并不会消除规模、成本和编排问题。',
    nextTransition: '效率技术和稀疏专家路由变得更重要。',
  },
  {
    id: 'gpt-5',
    date: '2025-08-07',
    dateLabel: '2025-08-07',
    title: 'GPT-5',
    eraLabel: '稀疏扩展',
    narration: '时间线终点强调能力整合、路由效率和系统可用性共同演进。',
    demoKey: 'moe',
    solvedProblem: '在推进前沿能力的同时，让大模型部署更可控。',
    limitation: '即使有更强路由，系统仍要管理成本、延迟和控制边界。',
    nextTransition: '下一个设计问题是：稀疏专家如何改变成本曲线。',
  },
];

export const modelEvolutionDemos: ModelEvolutionDemo[] = [
  {
    key: 'foundation',
    title: '早期基础',
    summary: '从逻辑神经元到机器能否对话的问题。',
    anchorIds: ['mcculloch-pitts', 'turing-test'],
  },
  {
    key: 'fitting',
    title: '通过拟合学习',
    summary: '权重更新让模型学习规律，而不是只执行固定规则。',
    anchorIds: ['perceptron'],
  },
  {
    key: 'neural-network',
    title: '神经网络实践',
    summary: '卷积和循环结构展示了架构如何影响可学习内容。',
    anchorIds: ['backpropagation', 'cnn-lenet', 'lstm'],
  },
  {
    key: 'cnn-rnn',
    title: 'CNN / RNN 过渡',
    summary: '深度视觉和序列到序列模型把架构演进推向规模化叙事。',
    anchorIds: ['alexnet', 'seq2seq'],
  },
  {
    key: 'transformer',
    title: '注意力时代',
    summary: '自注意力移除循环瓶颈，打开现代大语言模型路径。',
    anchorIds: ['transformer', 'bert-gpt1'],
  },
  {
    key: 'alignment',
    title: '对齐与聊天',
    summary: '指令微调和反馈让预训练模型更可控、更适合产品调用。',
    anchorIds: ['gpt-3', 'chatgpt', 'gpt-4'],
  },
  {
    key: 'moe',
    title: '稀疏扩展',
    summary: 'MoE（Mixture of Experts，混合专家）式路由让能力和效率一起推进。',
    anchorIds: ['gpt-5'],
  },
];

function toTimeValue(date: string): number {
  return new Date(date).getTime();
}

function roundPosition(value: number): number {
  return Math.round(value * 100) / 100;
}

const timelineRailMin = 8;
const timelineRailMax = 92;
const timelineRailSpan = timelineRailMax - timelineRailMin;

function getEqualPosition(index: number, total: number): number {
  if (total <= 1) {
    return timelineRailMin;
  }

  return roundPosition(timelineRailMin + (index / (total - 1)) * timelineRailSpan);
}

function getChronologicalPosition(event: ModelEvolutionTimelineItem, first: number, last: number): number {
  if (last <= first) {
    return timelineRailMin;
  }

  return roundPosition(timelineRailMin + ((toTimeValue(event.date) - first) / (last - first)) * timelineRailSpan);
}

export function getTimelineItems(mode: TimelineSpacingMode = 'equal'): PositionedTimelineItem[] {
  const total = modelEvolutionTimeline.length;
  const firstDate = toTimeValue(modelEvolutionTimeline[0].date);
  const lastDate = toTimeValue(modelEvolutionTimeline[total - 1].date);
  const chronologicalPositions =
    mode === 'chronological'
      ? modelEvolutionTimeline.map((event) => getChronologicalPosition(event, firstDate, lastDate))
      : [];

  return modelEvolutionTimeline.map((event, index) => ({
    ...event,
    position: mode === 'chronological' ? chronologicalPositions[index] : getEqualPosition(index, total),
    labelPosition: mode === 'chronological' ? chronologicalPositions[index] : getEqualPosition(index, total),
  }));
}
