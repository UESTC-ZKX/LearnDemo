export const timelineItems = [
  {
    id: 'pretrain',
    label: '预训练扩展',
    year: '2018-2020',
    solved: '把多种 NLP 能力收敛到统一预训练范式。',
    limitation: '能力强但交互方式仍偏“续写”，可控性不足。',
    next: '需要更符合人类意图的指令跟随能力。',
  },
  {
    id: 'attention',
    label: 'Transformer',
    year: '2017+',
    solved: '缩短信号路径，让 token（词元）之间可以全局关联。',
    limitation: '上下文变长后，成本和记忆管理仍然困难。',
    next: '需要工程层面的上下文组织和压缩。',
  },
  {
    id: 'instruction',
    label: '指令对齐',
    year: '2021+',
    solved: '让模型输出更可控，更适合作为产品能力调用。',
    limitation: '复杂任务仍需要工具、状态和边界约束。',
    next: '更可控的能力需要被智能体（Agent）/ 工作流（Workflow）组织起来。',
  },
];

export const sequenceTokens = ['用户', '很早', '提出', '一个', '关键', '限制', '到最后', '还要记住'];

export const attentionTokens = [
  { token: '用户', weights: [1, 0.42, 0.52, 0.36, 0.7, 0.56] },
  { token: '提出', weights: [0.38, 1, 0.54, 0.48, 0.5, 0.42] },
  { token: '问题', weights: [0.5, 0.72, 1, 0.66, 0.72, 0.8] },
  { token: '模型', weights: [0.78, 0.44, 0.64, 1, 0.82, 0.54] },
  { token: '关注', weights: [0.66, 0.48, 0.78, 0.84, 1, 0.62] },
  { token: '线索', weights: [0.36, 0.64, 0.7, 0.55, 0.6, 1] },
];

export const toolFlowSteps = [
  { label: '用户（User）', detail: '提出目标、约束和上下文。' },
  { label: '大语言模型（LLM）', detail: '理解意图，判断是否需要外部工具。' },
  { label: '工具选择（Tool Selection）', detail: '选择工具并组织参数。' },
  { label: '工具结果（Tool Result）', detail: '执行确定性动作，返回结构化结果。' },
  { label: '大语言模型整合', detail: '整合工具结果，决定下一步或最终回答。' },
  { label: '回答（Answer）', detail: '输出带有依据的结果。' },
];

export const contextEvents = [
  { label: '需求', tokens: 800 },
  { label: '代码阅读', tokens: 1600 },
  { label: '实现', tokens: 2300 },
  { label: '测试输出', tokens: 1800 },
  { label: '总结压缩', tokens: -3000 },
  { label: '后续修复', tokens: 1500 },
];

export const agentLoopSteps = [
  { label: '思考（Thought）', detail: '判断当前目标和缺口。' },
  { label: '行动（Action）', detail: '选择一次工具调用或代码修改。' },
  { label: '观察（Observation）', detail: '读取执行结果和新状态。' },
  { label: '反思（Reflect）', detail: '决定继续、修正或停止。' },
];
