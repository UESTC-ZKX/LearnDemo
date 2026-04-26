import { useState } from 'react';

type StageId = 'workflow' | 'single-agent' | 'multi-agent';

interface StageStory {
  id: StageId;
  stageLabel: string;
  request: string;
  systemShape: string;
  flow: string[];
  output: string;
  whyUpgrade: string;
  gains: string[];
}

const stories: StageStory[] = [
  {
    id: 'workflow',
    stageLabel: 'Workflow',
    request: '公司报销高铁和酒店分别怎么报？',
    systemShape: '固定分类 + 固定知识库检索 + 固定模板回复',
    flow: ['识别问题属于“报销制度”', '查询制度 FAQ', '按模板返回标准答案'],
    output: '高铁按交通报销规则提交，酒店按住宿标准执行，超标部分不报销。',
    whyUpgrade: '当用户开始问“这个复杂场景是否适用某条政策”时，固定流程很快不够用。',
    gains: ['最稳', '最容易审计', '成本最低'],
  },
  {
    id: 'single-agent',
    stageLabel: 'Single Agent',
    request: '我下周去客户现场三天，两地往返高铁和酒店能不能一起报？有没有金额限制？',
    systemShape: '一个 Agent 理解问题、调用多个知识源、整合结果、必要时追问',
    flow: ['理解用户场景', '检索差旅制度、报销标准、住宿限额', '整合规则并生成解释', '如信息缺失再追问'],
    output: '可以一起报，但交通与住宿要分别归类；酒店按城市标准限额执行，超标部分需说明或自付。',
    whyUpgrade: '当系统目标从“回答问题”升级成“直接帮我完成一次事务”时，一个 Agent 的上下文就开始变重。',
    gains: ['路径更灵活', '支持跨知识源整合', '仍然保持单线程可控'],
  },
  {
    id: 'multi-agent',
    stageLabel: 'Multi-Agent',
    request: '直接帮我完成一次出差申请，并检查预算风险，最后生成审批说明。',
    systemShape: 'Planner / Policy / Finance / Reviewer 分角色协作，完成复杂事务',
    flow: ['Planner 拆任务', 'Policy Agent 查差旅制度', 'Finance Agent 核预算与历史数据', 'Reviewer Agent 检查遗漏和冲突'],
    output: '生成完整出差申请单、预算风险提示和审批说明，并给出超标时的替代方案。',
    whyUpgrade: '不是因为多 Agent 更高级，而是因为任务已经天然分工、可并行、还需要交叉复核。',
    gains: ['适合复杂事务', '支持角色隔离', '更容易做复核链路'],
  },
];

export function AgentEvolutionDemoPage() {
  const [activeId, setActiveId] = useState<StageId>('workflow');
  const activeStory = stories.find((story) => story.id === activeId) ?? stories[0];

  return (
    <main className="min-h-screen bg-[#050608] text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col px-6 py-6 lg:px-10">
        <header className="rounded-[2rem] border border-line bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_34%),rgba(255,255,255,0.03)] p-6 shadow-projection">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber">standalone demo</p>
              <h1 className="mt-3 text-4xl font-semibold text-white lg:text-5xl">企业知识助手的三阶段演进</h1>
              <p className="mt-4 max-w-4xl text-base leading-8 text-zinc-300 lg:text-lg">
                用同一个产品讲清为什么架构不会一步走到 Multi-Agent：需求先从固定问答升级到开放问答，最后才走向复杂事务协作。
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {stories.map((story) => (
                <button
                  key={story.id}
                  type="button"
                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                    activeId === story.id
                      ? 'border-amber/70 bg-amber/10 text-white'
                      : 'border-line bg-white/[0.03] text-zinc-300 hover:border-amber/40 hover:text-white'
                  }`}
                  onClick={() => setActiveId(story.id)}
                >
                  {story.stageLabel}
                </button>
              ))}
            </div>
          </div>
        </header>

        <section className="mt-6 rounded-[2rem] border border-line bg-white/[0.03] p-6 shadow-projection">
          <div className="grid gap-4 xl:grid-cols-3">
            {stories.map((story, index) => (
              <article
                key={story.id}
                className={`rounded-[1.75rem] border p-5 transition ${
                  activeId === story.id
                    ? 'border-amber/60 bg-amber/10 shadow-[0_0_0_1px_rgba(245,158,11,0.18)]'
                    : 'border-line bg-black/20'
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">0{index + 1}</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">{story.stageLabel}</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-300">{story.systemShape}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {story.gains.map((gain) => (
                    <span key={gain} className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-200">
                      {gain}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-6 grid flex-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-line bg-white/[0.03] p-6 shadow-projection">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber">当前用户请求</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">{activeStory.request}</h2>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[1.5rem] border border-line bg-black/20 p-4">
                <h3 className="text-lg font-semibold text-white">系统处理方式</h3>
                <ul className="mt-4 grid gap-3 text-sm leading-6 text-zinc-300">
                  {activeStory.flow.map((step) => (
                    <li key={step} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[1.5rem] border border-line bg-black/20 p-4">
                <h3 className="text-lg font-semibold text-white">系统输出</h3>
                <p className="mt-4 text-sm leading-7 text-zinc-300">{activeStory.output}</p>
              </div>
            </div>
          </section>

          <aside className="grid gap-6">
            <section className="rounded-[2rem] border border-line bg-white/[0.03] p-6 shadow-projection">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber">为什么上一阶段不够</p>
              <p className="mt-4 text-base leading-7 text-zinc-300">{activeStory.whyUpgrade}</p>
            </section>

            <section className="rounded-[2rem] border border-line bg-white/[0.03] p-6 shadow-projection">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber">讲解抓手</p>
              <div className="mt-4 rounded-[1.5rem] border border-amber/30 bg-amber/10 p-4 text-sm leading-7 text-zinc-200">
                同一个产品没有变，变的是任务复杂度。
                <br />
                先是固定问答，所以用 Workflow。
                <br />
                再是开放问答，所以升级成 Single Agent。
                <br />
                最后是复杂事务办理，才值得引入 Multi-Agent。
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
