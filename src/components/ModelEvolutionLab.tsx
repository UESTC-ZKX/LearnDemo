import { useMemo, useState } from 'react';
import { chapters } from '../data/chapters';
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
  chronological: '按真实时间跨度排布，更容易看出 2017 之后能力跃迁明显加速。',
};

type TimelineEventId = (typeof modelEvolutionTimeline)[number]['id'];

const historyTalkById: Partial<Record<TimelineEventId, { science: string; plain: string; transition: string }>> = {
  'mcculloch-pitts': {
    science: '神经元模型第一次把“智能能否被数学表达”落成了公式与阈值判断。',
    plain: '你可以把它理解成一个只会做开关判断的小门：输入够强就开，不够强就关。',
    transition: '下一步自然会追问：机器如果不靠手写规则，能不能自己从数据里学？',
  },
  perceptron: {
    science: '感知机在阈值模型上加入了可学习权重，让分类边界可以被样本推动。',
    plain: '它不再完全依赖人手写规则，而是答错之后自己改一点判断标准。',
    transition: '一旦开始“会学”，问题就会变成：单层结构够不够表达复杂任务？',
  },
  backpropagation: {
    science: '反向传播把输出误差沿链式法则逐层拆回参数，让多层网络真正可训练。',
    plain: '就像把最后一道题的扣分，一层层追责回前面每一步。',
    transition: '网络能训起来以后，下一步就不是“能不能学”，而是“什么结构最适合什么任务”。',
  },
  transformer: {
    science: 'Transformer 用自注意力替代链式传递，让 token 之间直接建立关系，并提高并行训练效率。',
    plain: '句子里的词不用排队传话了，而是可以直接看见跟自己最相关的那些词。',
    transition: '结构一旦足够可扩展，规模化预训练就会把它推成通用能力底座。',
  },
  'gpt-5': {
    science: '前沿模型不再只追求更大参数量，而是同时优化能力整合、路由效率和系统可用性。',
    plain: '模型不只是更大，还得更会分配算力，更适合被真实系统稳定调用。',
    transition: '接下来要讨论的就不只是模型，而是系统如何组织这些能力去完成任务。',
  },
};

const modelChapter = chapters.find((chapter) => chapter.id === 'chapter-models') ?? chapters[0];

const stageToTimeline: Record<string, TimelineEventId> = {
  'models-rules': 'perceptron',
  'models-rnn': 'lstm',
  'models-transformer': 'transformer',
  'models-gpt': 'gpt-3',
  'models-tools-agent': 'gpt-5',
};

function getHistoryTalk(event: (typeof modelEvolutionTimeline)[number]) {
  return (
    historyTalkById[event.id] ?? {
      science: `关键变化：${event.solvedProblem}`,
      plain: `通俗解释：${event.limitation}`,
      transition: `过渡句：${event.nextTransition}`,
    }
  );
}

function FoundationDemo({ activeEventId }: { activeEventId: TimelineEventId }) {
  const isTuring = activeEventId === 'turing-test';

  return (
    <DemoFrame title="早期基础" hint="用“神经元模型”和“图灵测试”讲清：早期 AI 先定义问题，再寻找可学习方法。" testId="demo-foundation">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className={`rounded border p-4 ${isTuring ? 'border-line bg-black/20' : 'border-signal/60 bg-signal/10'}`}>
          <p className="text-sm font-semibold text-white">1943 / 神经元模型</p>
          <p className="mt-2 text-sm leading-6 text-zinc-300">输入经过加权和阈值判断，输出一个最简逻辑结果。</p>
          <div className="mt-4 flex items-center gap-2 text-sm text-zinc-200">
            <span className="rounded border border-line px-3 py-2">x1</span>
            <span className="rounded border border-line px-3 py-2">x2</span>
            <span className="text-zinc-500">-&gt;</span>
            <span className="rounded border border-signal/60 bg-signal/10 px-3 py-2">阈值判断</span>
            <span className="text-zinc-500">-&gt;</span>
            <span className="rounded border border-line px-3 py-2">0 / 1</span>
          </div>
        </div>
        <div className={`rounded border p-4 ${isTuring ? 'border-signal/60 bg-signal/10' : 'border-line bg-black/20'}`}>
          <p className="text-sm font-semibold text-white">1950 / 图灵测试</p>
          <p className="mt-2 text-sm leading-6 text-zinc-300">把“机器是否智能”转成可观察的对话行为，而不是只讨论内部机理。</p>
          <div className="mt-4 grid gap-2 text-sm text-zinc-300">
            <span className="rounded border border-line bg-white/[0.035] px-3 py-2">提问者：你如何解释一个笑话？</span>
            <span className="rounded border border-line bg-white/[0.035] px-3 py-2">候选者：用语言、语境和推理作答。</span>
          </div>
        </div>
      </div>
    </DemoFrame>
  );
}

function AlignmentDemo({ activeEventId }: { activeEventId: TimelineEventId }) {
  const activeStep = activeEventId === 'gpt-3' ? '预训练' : activeEventId === 'chatgpt' ? '反馈对齐' : '产品调用';

  return (
    <DemoFrame title="指令对齐（Instruction Alignment）" hint="把模型从“会续写文本”讲到“能被产品稳定调用”。" testId="demo-alignment">
      <div className="grid gap-3">
        {[
          ['预训练', '压缩大规模语言模式，形成通用生成能力。'],
          ['指令微调', '把输入从续写文本转成按任务要求响应。'],
          ['反馈对齐', '用偏好反馈约束风格、边界和安全性。'],
          ['产品调用', '模型开始被工具、工作流和 Agent 系统组织起来。'],
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
  const [activeStageId, setActiveStageId] = useState(modelChapter.stages[0]?.id ?? '');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHistoryTalkOpen, setIsHistoryTalkOpen] = useState(false);
  const items = useMemo(() => getTimelineItems(mode), [mode]);
  const active = items.find((item) => item.id === activeId) ?? items[0];
  const demo = modelEvolutionDemos.find((item) => item.key === active.demoKey);
  const historyTalk = getHistoryTalk(active);
  const activeStage = modelChapter.stages.find((stage) => stage.id === activeStageId) ?? modelChapter.stages[0];

  function handleStageSelect(stageId: string) {
    setActiveStageId(stageId);
    const mappedTimeline = stageToTimeline[stageId];
    if (mappedTimeline) {
      setActiveId(mappedTimeline);
    }
  }

  return (
    <div className="grid gap-5" data-testid="model-evolution-lab">
      <div className="rounded border border-line bg-black/20 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-signal">第 01 章实验台</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">模型发展互动实验台</h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">
              先按时间线建立共同历史语境，再进入“五阶段拆解”，最后把关键公式、函数和结构落到可讲解的专题实验里。
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
            {items.map((item) => (
              <div key={item.id}>
                <div className="group absolute left-0 z-20 h-8 w-8" style={{ top: `${item.position}%`, transform: 'translateY(-50%)' }}>
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
                    <span className="block font-semibold text-signal">
                      {item.dateLabel} / {item.eraLabel}
                    </span>
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
            ))}
          </div>
        </div>

        <div className="grid gap-5">
          <div className="rounded border border-line bg-white/[0.035] p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-signal">
                  {active.dateLabel} / {active.eraLabel}
                </p>
                <h4 className="mt-2 text-2xl font-semibold text-white">{active.title}</h4>
                <p className="mt-3 text-sm leading-6 text-zinc-300">{active.narration}</p>
              </div>
              {demo ? <div className="rounded border border-line bg-black/20 px-3 py-2 text-sm text-zinc-300">{demo.title}</div> : null}
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <p className="rounded border border-line bg-black/20 p-3 text-sm leading-6 text-zinc-300">
                <span className="font-semibold text-signal">解决：</span>
                {active.solvedProblem}
              </p>
              <p className="rounded border border-line bg-black/20 p-3 text-sm leading-6 text-zinc-300">
                <span className="font-semibold text-amber">局限：</span>
                {active.limitation}
              </p>
              <p className="rounded border border-line bg-black/20 p-3 text-sm leading-6 text-zinc-300">
                <span className="font-semibold text-rose">过渡：</span>
                {active.nextTransition}
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

      <section className="rounded border border-line bg-white/[0.035] p-5" data-testid="model-stage-overview">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-signal">第二段</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">第二段：五阶段拆解</h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">
              用统一模板讲第一章：核心瓶颈、关键改进、解决的问题、遗留限制，以及问题如何从模型层推向系统层。
            </p>
          </div>
          <div className="rounded border border-line bg-black/20 px-3 py-2 text-sm text-zinc-300">叙事主链</div>
        </div>

        <div className="mt-5 grid gap-3 xl:grid-cols-5">
          {modelChapter.stages.map((stage) => (
            <button
              key={stage.id}
              type="button"
              className={`rounded border p-4 text-left transition ${
                stage.id === activeStage.id ? 'border-signal/70 bg-signal/10' : 'border-line bg-black/20 hover:border-signal/50'
              }`}
              onClick={() => handleStageSelect(stage.id)}
            >
              <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">{stage.eyebrow}</span>
              <span className="mt-2 block text-base font-semibold text-white">{stage.title}</span>
              <span className="mt-2 block text-sm leading-6 text-zinc-400">{stage.analysis?.coreProblem}</span>
              {stage.formulaSpotlight ? (
                <span className="mt-3 block rounded border border-line bg-zinc-950/70 px-3 py-2 text-xs text-zinc-300">
                  {stage.formulaSpotlight.expression}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.25fr_0.95fr]">
          <div className="rounded border border-line bg-black/20 p-4" data-testid="model-stage-analysis">
            <p className="text-sm font-semibold text-signal">{activeStage.eyebrow}</p>
            <h4 className="mt-2 text-xl font-semibold text-white">{activeStage.title}</h4>
            <p className="mt-3 text-sm leading-6 text-zinc-300">{activeStage.description}</p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {[
                ['核心瓶颈', activeStage.analysis?.coreProblem],
                ['关键改进', activeStage.analysis?.majorUpgrade],
                ['解决了什么', activeStage.analysis?.solvedWhat],
                ['遗留限制', activeStage.analysis?.remainingLimits],
              ].map(([label, value]) => (
                <div key={label} className="rounded border border-line bg-zinc-950/70 p-3 text-sm leading-6 text-zinc-300">
                  <span className="font-semibold text-white">{label}：</span>
                  {value}
                </div>
              ))}
            </div>

            <div className="mt-4 rounded border border-line bg-zinc-950/70 p-4 text-sm leading-6 text-zinc-300">
              <span className="font-semibold text-amber">问题迁移：</span>
              {activeStage.analysis?.systemShift}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded border border-line bg-black/20 p-4" data-testid="model-formula-spotlight">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">公式 / 函数聚焦</div>
              <h4 className="mt-2 text-lg font-semibold text-white">{activeStage.formulaSpotlight?.title}</h4>
              <div className="mt-3 rounded border border-signal/50 bg-signal/10 px-4 py-3 font-mono text-sm text-white">
                {activeStage.formulaSpotlight?.expression}
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{activeStage.formulaSpotlight?.explanation}</p>
              <div className="mt-4 grid gap-2">
                {activeStage.formulaSpotlight?.variables.map((variable) => (
                  <div key={variable} className="rounded border border-line bg-zinc-950/70 px-3 py-2 text-sm text-zinc-300">
                    {variable}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded border border-line bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">可视化讲解建议</div>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{activeStage.formulaSpotlight?.visualizationLabel}</p>
              <div className="mt-4 rounded border border-amber/50 bg-amber/10 p-4 text-sm leading-6 text-zinc-200">
                <span className="font-semibold">讲解串联：</span>
                先讲公式如何刻画当前阶段的核心机制，再切到下方专题实验，用图形、状态流或权重变化把抽象公式变成可观察过程。
              </div>
            </div>
          </div>
        </div>
      </section>

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
            <div className="min-h-0 flex-1 overflow-auto p-5">{renderDemo(active.demoKey, active.id)}</div>
          </div>
        </div>
      ) : null}

      <TechnicalEvolutionLabs highlightedLabId={activeStage.formulaSpotlight?.labTarget} />
    </div>
  );
}
