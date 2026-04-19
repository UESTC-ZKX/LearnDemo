import { useMemo, useState } from 'react';
import {
  getTimelineItems,
  modelEvolutionDemos,
  modelEvolutionTimeline,
  type DemoKey,
  type TimelineSpacingMode,
} from '../data/modelEvolution';
import { AttentionDemo } from './demos/AttentionDemo';
import { CnnRnnDemo } from './demos/CnnRnnDemo';
import { DemoFrame } from './demos/DemoFrame';
import { FunctionFittingDemo } from './demos/FunctionFittingDemo';
import { MoeMetricsDemo } from './demos/MoeMetricsDemo';
import { NeuralNetworkFlowDemo } from './demos/NeuralNetworkFlowDemo';
import { TechnicalEvolutionLabs } from './TechnicalEvolutionLabs';

const modeLabels: Record<TimelineSpacingMode, string> = {
  equal: '大事件等间隔',
  chronological: '按时间跨度',
};

const modeDescriptions: Record<TimelineSpacingMode, string> = {
  equal: '每个大事件占据相近的讲解节奏，适合现场逐点推进。',
  chronological: '按真实时间跨度排布，近期节点会被压缩在右侧，直观看到 2017 之后的快速爆发。',
};

type TimelineEventId = (typeof modelEvolutionTimeline)[number]['id'];

const historyTalkById: Partial<
  Record<TimelineEventId, { science: string; plain: string; transition: string }>
> = {
  'mcculloch-pitts': {
    science: '它把神经元抽象成二值阈值函数，说明逻辑命题可以被网络化表达。',
    plain: '可以把它理解成一个会做开关判断的小门：信号够强就开，不够强就关。',
    transition: '过渡句：能用公式表达逻辑之后，下一步自然是问机器行为能否被观察和检验。',
  },
  perceptron: {
    science: '感知机在阈值模型上加入可学习权重，用错分样本推动决策边界移动。',
    plain: '它不是每次都照着手写规则判断，而是答错后改一下自己的打分标准。',
    transition: '过渡句：单个可学习神经元很重要，但它只能画线，复杂问题需要多层结构。',
  },
  backpropagation: {
    science: '反向传播用链式法则计算损失对每层参数的梯度，使多层网络训练变得可操作。',
    plain: '像把最后的错题分数一层层追责回去，让每一层都知道自己该往哪儿改。',
    transition: '过渡句：当多层网络能训练后，问题从能不能学，变成什么结构最适合什么数据。',
  },
  transformer: {
    science: 'Transformer 用自注意力建立 token 之间的直接依赖，缩短长距离信号路径并提升并行训练效率。',
    plain: '它不再让信息排队一个个传，而是让句子里的词彼此直接“看见”相关线索。',
    transition: '过渡句：有了可扩展架构，大规模预训练就能把结构优势转成通用语言能力。',
  },
  'gpt-5': {
    science: '这一节点强调前沿模型从单纯扩参转向能力整合、路由效率和系统可控性的共同优化。',
    plain: '模型不只是更大，还要更会分配计算、更稳定地被产品和工程系统调用。',
    transition: '过渡句：历史讲到这里，就可以切入稠密计算和专家路由的技术取舍。',
  },
};

function getHistoryTalk(event: (typeof modelEvolutionTimeline)[number]) {
  return (
    historyTalkById[event.id] ?? {
      science: `${event.title}的关键意义是：${event.solvedProblem}`,
      plain: `通俗讲，它把上一阶段的局限往前推进了一步：${event.limitation}`,
      transition: `过渡句：${event.nextTransition}`,
    }
  );
}

function FoundationDemo({ activeEventId }: { activeEventId: TimelineEventId }) {
  const isTuring = activeEventId === 'turing-test';

  return (
    <DemoFrame title="早期基础" hint="用两个早期问题开场：智能能否被数学建模，机器智能能否被外部行为检验。" testId="demo-foundation">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className={`rounded border p-4 ${isTuring ? 'border-line bg-black/20' : 'border-signal/60 bg-signal/10'}`}>
          <p className="text-sm font-semibold text-white">1943 / 神经元模型</p>
          <p className="mt-2 text-sm leading-6 text-zinc-300">输入信号经过权重和阈值，输出一个简单的逻辑判断。</p>
          <div className="mt-4 flex items-center gap-2 text-sm text-zinc-200">
            <span className="rounded border border-line px-3 py-2">x1</span>
            <span className="rounded border border-line px-3 py-2">x2</span>
            <span className="text-zinc-500">-&gt;</span>
            <span className="rounded border border-signal/60 bg-signal/10 px-3 py-2">阈值（Threshold）</span>
            <span className="text-zinc-500">-&gt;</span>
            <span className="rounded border border-line px-3 py-2">0 / 1</span>
          </div>
        </div>
        <div className={`rounded border p-4 ${isTuring ? 'border-signal/60 bg-signal/10' : 'border-line bg-black/20'}`}>
          <p className="text-sm font-semibold text-white">1950 / 图灵测试</p>
          <p className="mt-2 text-sm leading-6 text-zinc-300">把“智能是什么”转成可观察的互动结果：机器是否能表现得像人。</p>
          <div className="mt-4 grid gap-2 text-sm text-zinc-300">
            <span className="rounded border border-line bg-white/[0.035] px-3 py-2">提问者：你如何解释一个笑话？</span>
            <span className="rounded border border-line bg-white/[0.035] px-3 py-2">候选者：用语言、语境和推理回答。</span>
          </div>
        </div>
      </div>
    </DemoFrame>
  );
}

function AlignmentDemo({ activeEventId }: { activeEventId: TimelineEventId }) {
  const activeStep = activeEventId === 'gpt-3' ? '预训练' : activeEventId === 'chatgpt' ? '反馈对齐' : '产品调用';

  return (
    <DemoFrame title="指令对齐（Instruction Alignment）" hint="把模型从“续写文本”讲到“可被产品调用的能力模块”。" testId="demo-alignment">
      <div className="grid gap-3">
        {[
          ['预训练', '压缩互联网上的大量语言模式，得到通用生成能力。'],
          ['指令微调', '把输入从补全文本变成按任务要求响应。'],
          ['反馈对齐', '用偏好反馈约束输出风格、边界和安全性。'],
          ['产品调用', '模型开始被工具、工作流和智能体（Agent）系统组织起来。'],
        ].map(([title, body], index) => (
          <div
            key={title}
            className={`grid grid-cols-[2rem_1fr] gap-3 rounded border p-3 ${
              title === activeStep ? 'border-signal/60 bg-signal/10' : 'border-line bg-black/20'
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded border border-signal/50 bg-signal/10 text-sm font-semibold text-white">
              {index + 1}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="mt-1 text-sm leading-6 text-zinc-300">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </DemoFrame>
  );
}

function getCnnRnnFocus(activeEventId: TimelineEventId) {
  if (activeEventId === 'seq2seq') {
    return 'rnn' as const;
  }

  return 'cnn' as const;
}

function getNeuralNetworkFocus(activeEventId: TimelineEventId) {
  if (activeEventId === 'backpropagation') {
    return 'backprop' as const;
  }

  if (activeEventId === 'lstm') {
    return 'vanishing' as const;
  }

  return 'forward' as const;
}

function getFittingFocus(activeEventId: TimelineEventId) {
  if (activeEventId === 'perceptron') {
    return 'underfit' as const;
  }

  return 'balanced' as const;
}

function getAttentionFocus(activeEventId: TimelineEventId) {
  if (activeEventId === 'bert-gpt1') {
    return 'pretraining-transfer' as const;
  }

  return 'direct-attention' as const;
}

function renderDemo(key: DemoKey, activeEventId: TimelineEventId) {
  if (key === 'foundation') {
    return <FoundationDemo activeEventId={activeEventId} />;
  }

  if (key === 'fitting') {
    return <FunctionFittingDemo focus={getFittingFocus(activeEventId)} />;
  }

  if (key === 'neural-network') {
    return <NeuralNetworkFlowDemo focus={getNeuralNetworkFocus(activeEventId)} />;
  }

  if (key === 'cnn-rnn') {
    return <CnnRnnDemo focus={getCnnRnnFocus(activeEventId)} />;
  }

  if (key === 'transformer') {
    return <AttentionDemo focus={getAttentionFocus(activeEventId)} />;
  }

  if (key === 'alignment') {
    return <AlignmentDemo activeEventId={activeEventId} />;
  }

  return <MoeMetricsDemo />;
}

export function ModelEvolutionLab() {
  const [mode, setMode] = useState<TimelineSpacingMode>('equal');
  const [activeId, setActiveId] = useState(modelEvolutionTimeline[0].id);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHistoryTalkOpen, setIsHistoryTalkOpen] = useState(false);
  const items = useMemo(() => getTimelineItems(mode), [mode]);
  const active = items.find((item) => item.id === activeId) ?? items[0];
  const demo = modelEvolutionDemos.find((item) => item.key === active.demoKey);
  const historyTalk = getHistoryTalk(active);

  return (
    <div className="grid gap-5" data-testid="model-evolution-lab">
      <div className="rounded border border-line bg-black/20 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-signal">第 01 章实验台</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">模型发展互动实验台</h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">
              先按时间线从历史角度介绍重要事件，再进入专题实验卡，从实际技术演进视角讲清具体机制。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['equal', 'chronological'] as TimelineSpacingMode[]).map((item) => (
              <button
                key={item}
                type="button"
                className={`demo-button ${mode === item ? 'demo-button-active' : ''}`}
                onClick={() => setMode(item)}
              >
                {modeLabels[item]}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-4 rounded border border-line bg-white/[0.035] px-3 py-2 text-sm leading-6 text-zinc-300">
          {modeDescriptions[mode]}
        </p>
      </div>

      <section className="rounded border border-line bg-white/[0.035] p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-signal">第一段</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">第一段：时间线</h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">
              这一段只讲历史脉络：发生了什么、解决了什么时代问题、留下什么局限，以及为什么进入下一阶段。
            </p>
          </div>
          <button type="button" className="control-button" onClick={() => setIsHistoryTalkOpen((current) => !current)}>
            {isHistoryTalkOpen ? '收起历史讲述' : '展开历史讲述'}
          </button>
        </div>

        {isHistoryTalkOpen ? (
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            <div className="rounded border border-line bg-black/20 p-4 text-sm leading-6 text-zinc-300">
              <div className="font-semibold text-white">历史讲述提案</div>
              <p className="mt-2">{historyTalk.science}</p>
            </div>
            <div className="rounded border border-line bg-black/20 p-4 text-sm leading-6 text-zinc-300">
              <div className="font-semibold text-white">通俗解释</div>
              <p className="mt-2">{historyTalk.plain}</p>
            </div>
            <div className="rounded border border-line bg-black/20 p-4 text-sm leading-6 text-zinc-300">
              <div className="font-semibold text-white">过渡句</div>
              <p className="mt-2">{historyTalk.transition}</p>
            </div>
          </div>
        ) : null}
      </section>

      <div className="grid gap-5 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <div className="rounded border border-line bg-white/[0.035] p-4">
          <div className="relative h-[58rem]">
            <div className="absolute bottom-[6%] left-4 top-[6%] w-px bg-line" />
            {items.map((item) => {
              return (
                <div key={item.id}>
                  <div
                    className="group absolute left-0 z-20 h-8 w-8"
                    style={{ top: `${item.position}%`, transform: 'translateY(-50%)' }}
                  >
                    <button
                      type="button"
                      aria-label={`${item.dateLabel} ${item.title}`}
                      aria-describedby={`timeline-tooltip-${item.id}`}
                      className={`h-8 w-8 rounded border transition ${
                        item.id === active.id ? 'border-signal bg-signal/20' : 'border-line bg-ink hover:border-signal/60'
                      }`}
                      onClick={() => setActiveId(item.id)}
                    />
                    <div
                      id={`timeline-tooltip-${item.id}`}
                      role="tooltip"
                      data-testid={`timeline-tooltip-${item.id}`}
                      className="pointer-events-none absolute left-9 top-0 z-40 w-72 -translate-y-[calc(100%+0.35rem)] rounded border border-signal/50 bg-ink/95 p-3 text-left text-xs leading-5 text-zinc-300 opacity-0 shadow-projection transition duration-150 group-hover:-translate-y-[calc(100%+0.75rem)] group-hover:opacity-100 group-focus-within:-translate-y-[calc(100%+0.75rem)] group-focus-within:opacity-100"
                    >
                      <span className="block font-semibold text-signal">{item.dateLabel} / {item.eraLabel}</span>
                      <span className="mt-1 block text-sm font-semibold text-white">{item.title}</span>
                      <span className="mt-2 block">{item.narration}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`absolute left-12 right-0 text-left transition ${
                      item.id === active.id ? 'text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                    style={{ top: `${item.labelPosition}%`, transform: 'translateY(-50%)' }}
                    onClick={() => setActiveId(item.id)}
                  >
                    <span className="block rounded border border-line bg-ink/90 px-3 py-2">
                      <span className="block text-xs font-semibold text-signal">{item.dateLabel}</span>
                      <span className="mt-1 block text-sm font-semibold">{item.title}</span>
                      <span className="mt-1 block text-xs text-zinc-500">{item.eraLabel}</span>
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-5">
          <div className="rounded border border-line bg-white/[0.035] p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-signal">{active.dateLabel} / {active.eraLabel}</p>
                <h4 className="mt-2 text-2xl font-semibold text-white">{active.title}</h4>
                <p className="mt-3 text-sm leading-6 text-zinc-300">{active.narration}</p>
              </div>
              {demo ? (
                <div className="rounded border border-line bg-black/20 px-3 py-2 text-sm text-zinc-300">
                  {demo.title}
                </div>
              ) : null}
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <p className="rounded border border-line bg-black/20 p-3 text-sm leading-6 text-zinc-300">
                <span className="font-semibold text-signal">解决：</span>
                {active.demoKey === 'transformer' ? '缩短信号路径，' : ''}
                {active.solvedProblem}
              </p>
              <p className="rounded border border-line bg-black/20 p-3 text-sm leading-6 text-zinc-300">
                <span className="font-semibold text-amber">局限：</span>{active.limitation}
              </p>
              <p className="rounded border border-line bg-black/20 p-3 text-sm leading-6 text-zinc-300">
                <span className="font-semibold text-rose">过渡：</span>{active.nextTransition}
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              className="absolute right-4 top-4 z-10 rounded border border-signal/50 bg-ink/90 px-3 py-2 text-sm font-semibold text-white shadow-projection transition hover:bg-signal/20"
              onClick={() => setIsExpanded(true)}
            >
              放大演示
            </button>
            {renderDemo(active.demoKey, active.id)}
          </div>
        </div>
      </div>

      {isExpanded ? (
        <div className="fixed inset-0 z-50 bg-black/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="放大演示">
          <div className="mx-auto flex h-full max-w-7xl flex-col rounded border border-line bg-ink shadow-projection">
            <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-signal">放大演示</p>
                <h3 className="mt-1 text-xl font-semibold text-white">{active.title}</h3>
              </div>
              <button type="button" className="control-button" onClick={() => setIsExpanded(false)}>
                关闭浮窗
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto p-5">
              {renderDemo(active.demoKey, active.id)}
            </div>
          </div>
        </div>
      ) : null}

      <TechnicalEvolutionLabs />
    </div>
  );
}
