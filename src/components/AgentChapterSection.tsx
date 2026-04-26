import type { ReactNode } from 'react';
import type { Chapter, Stage } from '../data/chapters';
import { buildAgentEvolutionDemoUrl } from '../utils/perceptronDemoMode';

interface AgentChapterSectionProps {
  chapter: Chapter;
}

const stageAccentStyles = [
  'border-emerald-400/30 bg-emerald-400/10 text-emerald-100',
  'border-sky-400/30 bg-sky-400/10 text-sky-100',
  'border-amber-400/30 bg-amber-400/10 text-amber-100',
];

function DecisionSlopeGraphic() {
  const levels = [
    {
      title: 'Workflow',
      note: '流程稳定、结果可枚举',
      chips: ['步骤固定', '审计简单'],
      style: 'border-emerald-400/35 bg-emerald-400/12',
    },
    {
      title: 'Single Agent',
      note: '路径不固定，但目标清晰',
      chips: ['工具调用', '状态闭环'],
      style: 'border-sky-400/35 bg-sky-400/12',
    },
    {
      title: 'Multi-Agent',
      note: '模块并行、角色分工明确',
      chips: ['并行推进', '交叉评审'],
      style: 'border-amber-400/35 bg-amber-400/12',
    },
  ];

  return (
    <div className="agent-slope">
      <div className="agent-slope-track" aria-hidden="true" />
      {levels.map((level, index) => (
        <article key={level.title} className={`agent-slope-stop ${level.style}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/65">
            0{index + 1}
          </p>
          <h4 className="mt-3 text-2xl font-semibold text-white">{level.title}</h4>
          <p className="mt-2 text-sm leading-6 text-zinc-200">{level.note}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {level.chips.map((chip) => (
              <span key={chip} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80">
                {chip}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function StageBlock({
  stage,
  eyebrow,
  heading,
  lead,
  accent,
  visual,
}: {
  stage: Stage;
  eyebrow: string;
  heading: string;
  lead: string;
  accent: string;
  visual: ReactNode;
}) {
  return (
    <section id={stage.id} className="agent-stage">
      <div className="agent-stage-copy">
        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${accent}`}>
          {eyebrow}
        </span>
        <h3 className="mt-5 text-4xl font-semibold leading-tight text-white lg:text-5xl">{heading}</h3>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300">{lead}</p>
        <p className="mt-6 border-l-2 border-signal/70 pl-4 text-base leading-7 text-zinc-100">{stage.keyPoint}</p>
        <ul className="mt-6 grid gap-3 text-base leading-7 text-zinc-300">
          {stage.talkingPoints.map((point) => (
            <li key={point} className="flex gap-3">
              <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-signal" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 rounded-2xl border border-line bg-black/20 p-4 text-sm leading-6 text-zinc-300">
          <span className="font-semibold text-white">讲解提示：</span>
          {stage.demoHint}
        </div>
      </div>
      <div className="agent-stage-visual">{visual}</div>
    </section>
  );
}

function NoAgentVisual() {
  return (
    <div className="agent-visual-card">
      <div className="agent-status-banner border-emerald-400/35 bg-emerald-400/12 text-emerald-100">
        优先结论：不用 Agent
      </div>
      <div className="mt-6 grid gap-4">
        {[
          ['任务路径', '固定，能写成清晰流程'],
          ['失败代价', '高，优先可审计和可回放'],
          ['工具协同', '少，调用边界明确'],
          ['最佳形态', 'Workflow / 普通后端逻辑'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
            <p className="mt-2 text-xl font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-zinc-300">
        只要流程稳定、规则能枚举，就先把系统做成可控工作流，而不是把不确定性提前引进来。
      </div>
    </div>
  );
}

function SingleAgentVisual() {
  const satellites = [
    ['检索', '查资料、查文档'],
    ['执行', '调 API / 跑脚本'],
    ['记录', '维护任务状态'],
    ['总结', '整合结果并输出'],
  ];

  return (
    <div className="agent-visual-card">
      <div className="agent-orbit">
        <div className="agent-orbit-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-100/80">Single Agent</p>
          <h4 className="mt-2 text-3xl font-semibold text-white">一个大脑</h4>
          <p className="mt-2 text-sm leading-6 text-zinc-200">负责规划、调用工具、读取结果、决定继续还是停止。</p>
        </div>
        {satellites.map(([label, detail], index) => (
          <div key={label} className={`agent-orbit-node agent-orbit-node-${index + 1}`}>
            <p className="text-sm font-semibold text-white">{label}</p>
            <p className="mt-1 text-xs leading-5 text-zinc-300">{detail}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {['目标明确', '步骤不固定', '需要工具', '需要短闭环纠错'].map((item) => (
          <div key={item} className="rounded-2xl border border-sky-400/20 bg-sky-400/10 px-4 py-3 text-sm text-sky-50">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function MultiAgentVisual() {
  const lanes = [
    { title: 'Planner', text: '拆任务、派发子目标' },
    { title: 'Researcher', text: '并行检索与归档' },
    { title: 'Builder', text: '实现或执行主动作' },
    { title: 'Reviewer', text: '复核结果、挑错和收束' },
  ];

  return (
    <div className="agent-visual-card">
      <div className="grid gap-4">
        {lanes.map((lane, index) => (
          <div key={lane.title} className="agent-lane">
            <div className="agent-lane-index">{index + 1}</div>
            <div className="agent-lane-card">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200/80">Role</p>
                <h4 className="mt-1 text-2xl font-semibold text-white">{lane.title}</h4>
              </div>
              <p className="max-w-xs text-sm leading-6 text-zinc-300">{lane.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-50">
        多 Agent 的收益来自分工隔离、并行推进和交叉复核；如果任务强串行、上下文高度耦合，这层协调成本往往不划算。
      </div>
    </div>
  );
}

function AgentDecisionMap() {
  const cells = [
    ['Workflow', '低开放度 / 低协作负荷'],
    ['Single Agent', '中高开放度 / 中协作负荷'],
    ['Multi-Agent', '高开放度 / 高协作负荷'],
  ];

  return (
    <section className="agent-map">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber">第二章总图</p>
        <h3 className="mt-3 text-3xl font-semibold text-white lg:text-4xl">先看任务开放度，再看协作负荷</h3>
        <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300">
          这张图不是为了把所有系统都往右上角推，而是提醒观众：复杂架构只在复杂任务中成立。
        </p>
      </div>
      <div className="agent-map-grid agent-map-grid-linear" aria-label="第二章总图">
        {cells.map(([title, detail], index) => (
          <div key={title} className={`agent-map-cell agent-map-cell-${index + 1}`}>
            <h4 className="text-2xl font-semibold text-white">{title}</h4>
            <p className="mt-2 text-sm leading-6 text-zinc-200">{detail}</p>
          </div>
        ))}
        <div className="agent-map-x-scale" aria-hidden="true">
          <span>
            <strong>低</strong>
            <em>目标清楚，流程基本固定</em>
          </span>
          <span>
            <strong>中</strong>
            <em>目标清楚，但路径需要判断</em>
          </span>
          <span>
            <strong>高</strong>
            <em>边做边探索，允许修正与回退</em>
          </span>
        </div>
        <div className="agent-map-y-scale" aria-hidden="true">
          <span>
            <strong>高</strong>
            <em>多角色分工、并行推进、交叉复核</em>
          </span>
          <span>
            <strong>中</strong>
            <em>有阶段切换与状态传递</em>
          </span>
          <span>
            <strong>低</strong>
            <em>一个执行单元基本可完成</em>
          </span>
        </div>
        <div className="agent-map-x-label">任务开放度</div>
        <div className="agent-map-y-label">协作负荷</div>
      </div>
    </section>
  );
}

export function AgentChapterSection({ chapter }: AgentChapterSectionProps) {
  const [fitStage, toolsStage, loopStage] = chapter.stages;

  function handleOpenDemo() {
    window.open(buildAgentEvolutionDemoUrl(window.location), '_blank', 'noopener,noreferrer');
  }

  return (
    <section className="chapter-section chapter-section-agents scroll-mt-8" id={chapter.id}>
      <div className="agent-chapter-hero">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber">
            {chapter.order} / {chapter.subtitle}
          </p>
          <h2 className="mt-4 max-w-4xl text-5xl font-semibold leading-tight text-white lg:text-6xl">{chapter.title}</h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">{chapter.overview}</p>
        </div>
        <div className="agent-hero-callout">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-100/80">先判断，后升级</p>
          <p className="mt-3 text-2xl font-semibold leading-tight text-white">
            不要把所有任务都包装成 Agent 系统。
          </p>
          <p className="mt-3 text-base leading-7 text-zinc-200">
            真正该上的，是那些路径不确定、需要工具协同、还能从反馈闭环中持续获益的任务。
          </p>
          <button
            data-testid="open-agent-evolution-demo"
            type="button"
            className="mt-5 rounded-2xl border border-amber/50 bg-amber/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber/20"
            onClick={handleOpenDemo}
          >
            打开“企业知识助手演进”Demo
          </button>
        </div>
      </div>

      <DecisionSlopeGraphic />

      <div className="mt-10 grid gap-8">
        <StageBlock
          stage={fitStage}
          eyebrow="Step 1"
          heading="先别急着上 Agent"
          lead="如果流程稳定、步骤能枚举、失败代价高，那最优解往往是 Workflow，而不是更强的自治。"
          accent={stageAccentStyles[0]}
          visual={<NoAgentVisual />}
        />
        <StageBlock
          stage={toolsStage}
          eyebrow="Step 2"
          heading="单 Agent 已经够用"
          lead="当任务目标明确但路径不固定，一个会调工具、能读结果、会停止的单 Agent，通常就能把收益吃满。"
          accent={stageAccentStyles[1]}
          visual={<SingleAgentVisual />}
        />
        <StageBlock
          stage={loopStage}
          eyebrow="Step 3"
          heading="多 Agent 只在分工明确时出现"
          lead="只有当任务天然可并行、角色边界清晰、单 Agent 已经被上下文和认知负荷拖慢时，多 Agent 才值得引入。"
          accent={stageAccentStyles[2]}
          visual={<MultiAgentVisual />}
        />
      </div>

      <AgentDecisionMap />

      <div className="mt-8 rounded-3xl border border-line bg-black/20 p-6 text-base leading-7 text-zinc-300">
        <span className="font-semibold text-white">承接：</span>
        {chapter.handoff}
      </div>
      <div className="mt-5 rounded-3xl border border-line bg-white/[0.03] p-6">
        <h3 className="text-xl font-semibold text-white">章节 Summary</h3>
        <ul className="mt-4 grid gap-3 text-base leading-7 text-zinc-300">
          {chapter.summary.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-amber" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
