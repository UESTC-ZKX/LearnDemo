import { useEffect, useState } from 'react';
import type { Chapter } from '../data/chapters';
import { useActiveSection } from '../hooks/useActiveSection';

interface ClaudeArchitectureChapterSectionProps {
  chapter: Chapter;
}

interface ArchitectureModule {
  id: string;
  step: string;
  phase: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  summary: string;
  overview: string;
  keyPoints: string[];
  whyItMatters: string[];
  handoff: string;
}

interface PreviewImage {
  src: string;
  alt: string;
  title: string;
}

const claudeArchitectureModules: ArchitectureModule[] = [
  {
    id: 'claude-entry',
    step: '01',
    phase: '思考',
    title: 'Conversation Engine / QueryEngine',
    imageSrc: '/claude-module-conversation-engine.png',
    imageAlt: '核心模块 1：Conversation Engine / QueryEngine',
    summary: '它定义了 Agent 一轮完整思考是怎么跑完的。',
    overview:
      '这一模块回答“Agent 为什么不是一次普通模型调用”。系统不是只拿用户一句话去问模型，而是先把历史消息、系统上下文、记忆、附件和模型配置组装成一次真正可执行的推理上下文。',
    keyPoints: [
      '输入不止来自用户，还包括历史、记忆、附件和运行时配置。',
      '中间的 QueryEngine 主循环是核心，重点是发起请求、接收流式输出、识别 tool_use、回写 tool_result、继续或停止、错误恢复、上下文压缩。',
      'Thinking、Streaming、Retry、Token Budget、Abort 说明它是一个带预算、可中断、可恢复的运行时循环。',
      '底部流程线适合收束：用户输入 -> 组装上下文 -> 模型输出 -> 工具调用 -> 继续推理 -> 最终回答。',
    ],
    whyItMatters: [
      '让观众看到 Agent 的“思考”其实是受控流程，而不是一次黑箱输出。',
      '把上下文管理、工具调用和停止条件放进同一条可解释链路。',
    ],
    handoff:
      '当一轮思考的执行链条明确之后，下一步自然要解释：其中产生的动作如何被系统安全执行。',
  },
  {
    id: 'claude-tools',
    step: '02',
    phase: '行动',
    title: 'Tool System + Tool Orchestration',
    imageSrc: '/claude-module-tool-system.png',
    imageAlt: '核心模块 2：Tool System + Tool Orchestration',
    summary: '它把“模型想做什么”变成“系统如何安全、可控地去做”。',
    overview:
      '这一模块回答“Agent 为什么能行动，而且行动不是混乱的”。工具不是随便调用几个函数，而是统一经过注册、权限校验、并发策略判断、执行、收集和会话回写。',
    keyPoints: [
      '工具来源是多路的：内置工具、插件工具、MCP / 远程工具、任务或 Agent 工具。',
      'Tool Registry 统一登记 schema、description、isEnabled、isConcurrencySafe、permission tags。',
      'Tool Orchestrator 的价值不只是“能执行”，而是“能调度”：接收、解析、校验、分组、执行、收集、汇总、回写。',
      '并发安全与非并发安全的分离，是工程治理里最关键的一层边界。',
    ],
    whyItMatters: [
      '避免模型意图直接穿透到环境侧造成失控副作用。',
      '把“模型决策”和“系统执行”之间的责任边界清晰拆开。',
    ],
    handoff:
      '工具能够被安全调度之后，接下来要回答的是：这些工具、会话和状态到底依托什么运行时骨架存在。',
  },
  {
    id: 'claude-context',
    step: '03',
    phase: '运行时',
    title: 'ToolUseContext + AppState',
    imageSrc: '/claude-module-runtime-context.png',
    imageAlt: '核心模块 3：ToolUseContext + AppState',
    summary: '它让工具、会话、任务、界面共享同一套运行时事实。',
    overview:
      '这一模块回答“Agent 的运行时骨架是什么”。ToolUseContext 像工具执行现场的上下文容器，AppState 像全局运行时状态树，而 Runtime Context Hub 把二者串成同一套共享事实层。',
    keyPoints: [
      'ToolUseContext 提供当前 tools、commands、MCP clients、AbortController、Permission Context、File Read State、UI Hooks。',
      'AppState 承载消息、界面、后台任务、插件状态、Agent 定义、通知队列和 Session Hooks。',
      '中间的双向关系很关键：读取共享状态、更新运行状态、驱动 UI 与 Runtime 协调。',
      'Conversation Engine、Tool Execution、UI / REPL 都消费同一套运行时骨架。',
    ],
    whyItMatters: [
      '避免系统变成“只有 Prompt、没有 Runtime”的脆弱拼装。',
      '让工具、任务、界面和会话状态在同一事实源上协同。',
    ],
    handoff:
      '当运行时事实已经统一之后，系统就可以从单个助手循环，扩展成真正的任务协作系统。',
  },
  {
    id: 'claude-agent-loop',
    step: '04',
    phase: '协作',
    title: 'Task / Subagent / Multi-Agent System',
    imageSrc: '/claude-module-task-system.png',
    imageAlt: '核心模块 4：Task / Subagent / Multi-Agent System',
    summary: '它让 Agent 不再只是单线程对话助手，而是可拆解、可协作、可长期运行的系统。',
    overview:
      '这一模块回答“Agent 如何从单体助手变成协作系统”。主 Agent 不再直接做完所有事情，而是创建任务、交给调度器拆解，再通过多种执行单元推进，并把进度和结果持续写回。',
    keyPoints: [
      '主 Agent 负责接收请求、理解与规划、创建任务、汇总结果、更新上下文。',
      'Task Scheduler / Coordinator 负责任务拆解、优先级与依赖管理、重试、超时和并发控制。',
      'Task Store / Status Tracking 让任务变成可持久化、可查询、可恢复的执行单元。',
      '状态机是讲解重点：pending -> running -> blocked -> completed / failed / cancelled，并支持 retry 回到 pending。',
    ],
    whyItMatters: [
      '让长时任务、后台执行和恢复能力成为可能。',
      '让不同执行单元并行推进时仍然可追踪、可回收、可审计。',
    ],
    handoff:
      '当系统已经具备任务拆解和协作能力，最后还要解决一个平台问题：外部能力如何接入而不把系统越扩越乱。',
  },
  {
    id: 'claude-extension',
    step: '05',
    phase: '扩展',
    title: 'Extension Layer（Skills / Plugins / MCP）',
    imageSrc: '/claude-module-extension-layer.png',
    imageAlt: '核心模块 5：Extension Layer（Skills / Plugins / MCP）',
    summary: '它让外部能力接入后仍然受统一治理，而不是把系统越扩越乱。',
    overview:
      '这一模块回答“Agent 为什么是平台，而不是写死的程序”。外部能力不能直接闯进主系统，而是必须先经过适配层，最终映射为统一抽象，再注册到同一个运行时里。',
    keyPoints: [
      '扩展来源有三类：Skills、Plugins、MCP / Protocols。',
      'Extension Adapter Layer 是吸收层：Skill Loader、Plugin Loader、Protocol Adapter 分别把外部能力转成平台可用对象。',
      'Runtime Integration 统一承接 Command Registry、Tool Registry、Agent Templates、Resource Access、Hooks / Lifecycle。',
      '最重要的一句话是：扩展不能绕开主系统，必须映射为统一抽象。',
    ],
    whyItMatters: [
      '保证能力扩展不会破坏系统的权限、治理和生命周期控制。',
      '让平台可以持续演进，而不是不断增加例外分支。',
    ],
    handoff:
      '到这里，第三章形成闭环：思考、行动、运行时、协作、扩展，全部被纳入同一套工程架构。',
  },
];

const overviewImage: PreviewImage = {
  src: '/claude-code-architecture.png',
  alt: 'Claude Code 全局架构总览图',
  title: '全局架构图',
};

export const claudeArchitectureModuleIds = claudeArchitectureModules.map((module) => module.id);

function ArchitectureModuleCard({
  module,
  isActive,
  onOpenImage,
}: {
  module: ArchitectureModule;
  isActive: boolean;
  onOpenImage: (image: PreviewImage) => void;
}) {
  return (
    <article
      id={module.id}
      className={`claude-module-card ${isActive ? 'claude-module-card-active' : ''}`}
    >
      <div className="claude-module-media">
        <div className="claude-module-heading">
          <span className="claude-module-step">{module.step}</span>
          <div>
            <p className="claude-module-phase">{module.phase}</p>
            <h3 className="claude-module-title">{module.title}</h3>
          </div>
        </div>

        <div className="claude-module-frame">
          <div className="claude-module-frame-bar">
            <span>{module.phase}</span>
            <span>核心模块 {module.step}</span>
          </div>

          <button
            type="button"
            className="claude-image-trigger"
            aria-label={`放大图片：${module.title}`}
            onClick={() =>
              onOpenImage({
                src: module.imageSrc,
                alt: module.imageAlt,
                title: module.title,
              })
            }
          >
            <img
              src={module.imageSrc}
              alt={module.imageAlt}
              className="claude-module-image"
              data-testid={`claude-image-${module.id}`}
            />
            <span className="claude-image-trigger-badge">点击放大</span>
          </button>
        </div>
      </div>

      <div className="claude-module-copy">
        <p className="claude-module-overview">{module.overview}</p>

        <div className="claude-module-section">
          <p className="claude-module-label">讲解重点</p>
          <ul className="claude-module-list">
            {module.keyPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>

        <div className="claude-module-summary">
          <p className="claude-module-label">一句话概括</p>
          <p>{module.summary}</p>
        </div>

        <div className="claude-module-grid">
          <div className="claude-module-section claude-module-panel">
            <p className="claude-module-label">为什么它重要</p>
            <ul className="claude-module-list claude-module-list-compact">
              {module.whyItMatters.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="claude-module-section claude-module-panel">
            <p className="claude-module-label">如何承接下一块</p>
            <p className="claude-module-handoff">{module.handoff}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

function ImagePreviewModal({
  image,
  onClose,
}: {
  image: PreviewImage;
  onClose: () => void;
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="claude-image-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="claude-image-modal"
        role="dialog"
        aria-modal="true"
        aria-label="图片放大预览"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="claude-image-modal-header">
          <div>
            <p className="claude-callout-label">图片放大预览</p>
            <h3 className="claude-image-modal-title">{image.title}</h3>
          </div>
          <button type="button" className="control-button" onClick={onClose}>
            关闭浮窗
          </button>
        </div>

        <div className="claude-image-modal-body">
          <img src={image.src} alt={image.alt} className="claude-image-modal-media" />
        </div>
      </div>
    </div>
  );
}

export function ClaudeArchitectureChapterSection({
  chapter,
}: ClaudeArchitectureChapterSectionProps) {
  const activeModuleId = useActiveSection(claudeArchitectureModuleIds);
  const [previewImage, setPreviewImage] = useState<PreviewImage | null>(null);

  return (
    <section className="chapter-section chapter-section-claude scroll-mt-8" id={chapter.id}>
      <div className="claude-architecture-hero">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-300">
            {chapter.order} / {chapter.subtitle}
          </p>
          <h2 className="mt-4 max-w-4xl text-5xl font-semibold leading-tight text-white lg:text-6xl">
            {chapter.title}
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">{chapter.overview}</p>
        </div>

        <div className="claude-architecture-callout">
          <p className="claude-callout-label">第三章主线</p>
          <p className="claude-callout-copy">思考 -&gt; 行动 -&gt; 运行时 -&gt; 协作 -&gt; 扩展</p>
          <p className="claude-callout-note">
            这一章不再是模块罗列，而是顺着系统真实运作路径，把 Claude 类系统讲成一条完整的工程叙事链。
          </p>
        </div>
      </div>

      <div className="claude-overview-panel">
        <figure className="claude-overview-figure">
          <button
            type="button"
            className="claude-image-trigger"
            aria-label="放大全局架构图"
            onClick={() => setPreviewImage(overviewImage)}
          >
            <img
              src={overviewImage.src}
              alt={overviewImage.alt}
              className="claude-overview-image"
            />
            <span className="claude-image-trigger-badge">点击放大</span>
          </button>
          <figcaption className="claude-overview-caption">
            先看全局架构总图，再沿着 5 个关键模块往下拆：Agent 如何思考、如何行动、依托什么运行时、如何协作、以及如何扩展成平台。
          </figcaption>
        </figure>

        <nav className="claude-module-nav" aria-label="第三章模块导航">
          {claudeArchitectureModules.map((module) => {
            const isActive = activeModuleId === module.id;

            return (
              <a
                key={module.id}
                href={`#${module.id}`}
                className={`claude-module-nav-link ${isActive ? 'claude-module-nav-link-active' : ''}`}
              >
                <span className="claude-module-nav-step">{module.step}</span>
                <span>
                  <strong>{module.phase}</strong>
                  <em>{module.title}</em>
                </span>
              </a>
            );
          })}
        </nav>
      </div>

      <div className="claude-module-stack">
        {claudeArchitectureModules.map((module) => (
          <ArchitectureModuleCard
            key={module.id}
            module={module}
            isActive={activeModuleId === module.id}
            onOpenImage={setPreviewImage}
          />
        ))}
      </div>

      <div className="claude-architecture-closing">
        <span className="font-semibold text-white">第三章承接：</span>
        {chapter.handoff}
      </div>

      <div className="claude-architecture-summary">
        <h3 className="text-xl font-semibold text-white">第三章总结</h3>
        <ul className="mt-4 grid gap-3 text-base leading-7 text-zinc-300">
          {chapter.summary.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-rose-300" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {previewImage ? (
        <ImagePreviewModal image={previewImage} onClose={() => setPreviewImage(null)} />
      ) : null}
    </section>
  );
}
