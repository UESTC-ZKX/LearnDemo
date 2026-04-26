export type DemoType =
  | 'timeline'
  | 'sequence-decay'
  | 'attention'
  | 'decision-matrix'
  | 'tool-call-flow'
  | 'context-compression'
  | 'agent-loop';

export interface FormulaSpotlight {
  title: string;
  expression: string;
  explanation: string;
  variables: string[];
  visualizationLabel: string;
  labTarget?: string;
}

export interface StageAnalysis {
  coreProblem: string;
  majorUpgrade: string;
  solvedWhat: string;
  remainingLimits: string;
  systemShift: string;
}

export interface Stage {
  id: string;
  title: string;
  eyebrow: string;
  keyPoint: string;
  description: string;
  demoType: DemoType;
  timeframe?: string;
  talkingPoints: string[];
  demoHint: string;
  analysis?: StageAnalysis;
  formulaSpotlight?: FormulaSpotlight;
}

export interface Chapter {
  id: string;
  order: string;
  title: string;
  subtitle: string;
  overview: string;
  accent: 'signal' | 'amber' | 'rose';
  stages: Stage[];
  handoff: string;
  summary: string[];
}

export const chapters: Chapter[] = [
  {
    id: 'chapter-models',
    order: '01',
    title: '大模型发展',
    subtitle: '从规则系统到可调用能力层',
    overview:
      '本章不只讲“发生了什么”，而是讲“为什么下一代方法会出现”。每个阶段都用同一条线索拆解：上一代瓶颈是什么，这一代做了什么关键改进，解决了什么问题，又把复杂度推向了哪里。',
    accent: 'signal',
    handoff:
      '当模型从“能做局部任务”走到“能被产品系统调用”的能力层之后，工程问题就不再只是模型结构，而会自然转向工作流、工具调用和 Agent 选型。',
    summary: [
      '第一章的重点不是编年史，而是瓶颈迁移史：每一代模型都解决了一层问题，也把复杂度推向了下一层。',
      'Transformer 和预训练让模型能力显著跃迁，但“更强的模型”并不等于“更稳定的系统”。',
      '当模型开始具备对话、工具和长上下文能力时，系统设计才真正成为主角。',
    ],
    stages: [
      {
        id: 'models-rules',
        title: '规则与统计方法',
        eyebrow: '1950s-2000s',
        timeframe: '规则系统 / 统计 NLP',
        keyPoint: '先把语言任务变成“可定义、可统计、可评估”的问题，再谈学习能力。',
        description:
          '早期方法靠人工规则、模板和特征工程驱动，把语言理解拆成大量可枚举子问题。它们奠定了任务定义和评估方式，但泛化能力弱、迁移成本高。',
        demoType: 'timeline',
        talkingPoints: [
          '这一阶段的核心贡献，是把“智能”问题先收敛成可建模任务。',
          '瓶颈不是没有规则，而是规则太依赖人工维护，难以覆盖真实世界变化。',
        ],
        demoHint: '点击时间线早期节点时，强调“规则能定义问题，但很难自动吸收新知识”。',
        analysis: {
          coreProblem: '系统严重依赖人工规则与特征工程，迁移到新任务时几乎要重写。',
          majorUpgrade: '把语言现象转成统计建模问题，用数据替代纯手工规则。',
          solvedWhat: '建立了可训练、可评估的 NLP 基础流程，让“从数据学习”成为可行方向。',
          remainingLimits: '表达能力有限，无法稳定建模复杂上下文与远距离依赖。',
          systemShift: '问题还停留在任务定义和特征设计层，尚未形成统一的通用表示层。',
        },
        formulaSpotlight: {
          title: '线性打分函数',
          expression: 'score(x) = w · x + b',
          explanation: '把人工设计的离散特征映射到一个线性得分，再依据阈值或概率做分类。',
          variables: ['x 表示人工提取的特征向量', 'w 表示每个特征的权重', 'b 表示偏置项'],
          visualizationLabel: '适合用二维特征平面展示“特征改变如何推动分类边界移动”。',
          labTarget: 'perceptron-classification',
        },
      },
      {
        id: 'models-rnn',
        title: 'RNN / LSTM',
        eyebrow: '1990s-2010s',
        timeframe: '循环神经网络时代',
        keyPoint: '序列建模第一次真正进入主舞台，但记忆链太长让远距离信息很难稳定保留。',
        description:
          'RNN 把“前文状态”显式带入当前计算，LSTM 再用门控机制缓解梯度消失问题，让序列任务开始具有可训练的长程记忆能力。',
        demoType: 'sequence-decay',
        talkingPoints: [
          'RNN 的意义不只是处理顺序，而是让模型拥有沿时间轴传递状态的能力。',
          'LSTM 的门控是在修补状态链，而不是消灭状态链的长度问题。',
        ],
        demoHint: '用颜色衰减或状态链长度解释：不是模型不努力，而是信息路径太长。',
        analysis: {
          coreProblem: '语言任务需要记住前文，但传统特征方法无法稳定编码序列依赖。',
          majorUpgrade: '引入循环状态和门控记忆，让历史信息能够跨时间步传播。',
          solvedWhat: '让机器翻译、语言建模、语音等序列任务进入可训练、可落地阶段。',
          remainingLimits: '训练依赖串行展开，长距离依赖仍然脆弱，并行效率差。',
          systemShift: '复杂度从特征工程转移到“如何维护状态链”和“如何训练长序列”。',
        },
        formulaSpotlight: {
          title: '循环状态更新',
          expression: 'h_t = f(W_x x_t + W_h h_(t-1) + b)',
          explanation: '当前状态由当前输入和上一时刻隐藏状态共同决定，因此信息必须沿时间链逐步传递。',
          variables: ['x_t 表示当前 token 或时间步输入', 'h_(t-1) 表示上一步隐藏状态', 'h_t 表示当前时刻新的状态'],
          visualizationLabel: '适合用逐 token 状态链和衰减强度展示“长依赖为什么会变弱”。',
          labTarget: 'rnn-generation',
        },
      },
      {
        id: 'models-transformer',
        title: 'Transformer',
        eyebrow: '2017+',
        timeframe: 'Attention / Transformer',
        keyPoint: '真正的跃迁不是“更大”，而是把信息路径从链式传递改成了可直接关联。',
        description:
          'Transformer 用 Attention 建立 token 之间的直接关系，缩短长距离依赖路径，也把训练方式从串行推向高并行，为后续规模化预训练奠定基础。',
        demoType: 'attention',
        talkingPoints: [
          'Attention 不是平均关注所有 token，而是按当前问题动态分配权重。',
          'Transformer 解决的是“全局关系如何高效建模”，而不只是“上下文更长”。',
        ],
        demoHint: '点选 token 时突出权重矩阵和 Softmax，让“直接依赖”变得可视。',
        analysis: {
          coreProblem: 'RNN 的链式状态更新让远距离依赖难学、训练难并行。',
          majorUpgrade: '用自注意力让任意 token 之间可直接建立关系，并行计算全序列交互。',
          solvedWhat: '长距离关系建模和规模化训练效率显著提升，形成现代大模型的骨架。',
          remainingLimits: '模型结构更强了，但还不等于通用产品能力，仍缺少对齐、工具与状态管理。',
          systemShift: '复杂度从“状态链维护”转向“注意力计算、上下文成本和规模化训练”。',
        },
        formulaSpotlight: {
          title: 'Attention 权重',
          expression: 'Attention(Q, K, V) = softmax(QK^T / √d_k) V',
          explanation: '先计算 Query 与 Key 的相关性分数，再经 Softmax 归一化，最后用这些权重汇聚 Value。',
          variables: ['Q 表示当前查询视角', 'K 表示被比较的键', 'V 表示被聚合的内容值'],
          visualizationLabel: '适合用权重热力图和多头并行条带展示“谁在关注谁”。',
          labTarget: 'transformer-architecture',
        },
      },
      {
        id: 'models-gpt',
        title: 'GPT 时代',
        eyebrow: '2018-2024',
        timeframe: '预训练 / 指令对齐',
        keyPoint: '模型从“做某类任务”进化成“通用能力底座”，但可靠性和可控性开始成为新瓶颈。',
        description:
          '预训练、指令微调和反馈对齐把模型从学术架构推向产品接口。GPT 系列让统一模型覆盖多任务成为现实，也让“如何让模型稳定协作”成为核心问题。',
        demoType: 'timeline',
        talkingPoints: [
          '这里真正的变化，是模型开始像能力平台，而不是一堆离散任务模型。',
          '对齐让模型更像接口，但接口背后仍然可能不稳定。',
        ],
        demoHint: '在时间线后半段强调：能力整合之后，问题从“能否回答”变成“能否被稳定调用”。',
        analysis: {
          coreProblem: '强模型已经出现，但交互方式仍偏原始，输出稳定性和可控性不足。',
          majorUpgrade: '通过大规模预训练、指令微调和反馈对齐，把模型变成可对话、可迁移的通用接口。',
          solvedWhat: '让一个模型覆盖大量任务，并开始具备可被产品系统直接调用的体验。',
          remainingLimits: '模型仍缺少外部行动能力、长期状态和稳定任务执行边界。',
          systemShift: '复杂度从单一模型架构转移到产品交互、约束注入和系统调度。',
        },
        formulaSpotlight: {
          title: '自回归预测目标',
          expression: 'P(x) = Π_t P(x_t | x_<t)',
          explanation: '模型通过逐 token 预测下一个 token 学习语言分布，再用指令对齐把这种能力包装成更可用的接口。',
          variables: ['x_t 表示当前要预测的 token', 'x_<t 表示它之前的上下文', 'Π 表示把每一步条件概率连乘'],
          visualizationLabel: '适合用逐 token 生成路径展示“续写目标如何演化成对话能力”。',
          labTarget: 'rnn-generation',
        },
      },
      {
        id: 'models-tools-agent',
        title: 'Tool Use / 长上下文 / Agent 过渡',
        eyebrow: '2024+',
        timeframe: '工具调用 / 多步执行',
        keyPoint: '模型会说，不代表系统能做；能力走向执行时，工程边界开始决定体验上限。',
        description:
          '当模型被接入工具、长上下文和任务循环后，它开始从“回答者”向“执行者”过渡。这一阶段的重点不再只是模型能力，而是工具、记忆、状态和循环如何协作。',
        demoType: 'timeline',
        talkingPoints: [
          '这一阶段的关键不是再换一种网络，而是把模型放进工程系统里。',
          '长上下文、工具调用和 Agent 让任务完成率变高，也让复杂度急剧上升。',
        ],
        demoHint: '用过渡卡明确讲出：从模型能力到系统能力，这正是第二章的入口。',
        analysis: {
          coreProblem: '模型能回答问题，但仍不等于能稳定完成真实任务。',
          majorUpgrade: '引入工具调用、上下文管理和多步任务循环，把模型接入外部系统。',
          solvedWhat: '模型开始拥有查询、执行、观察和继续决策的能力，任务完成路径更完整。',
          remainingLimits: '可靠性、权限、安全、成本和可观测性都成为必须显式设计的问题。',
          systemShift: '复杂度从模型内部彻底外溢到系统编排层，这就是 Agent 选型的起点。',
        },
        formulaSpotlight: {
          title: '上下文压缩收益',
          expression: 'compression_ratio = retained_state / raw_history',
          explanation: '长任务不可能无限堆消息，系统必须把原始历史压缩成更高密度的任务状态。',
          variables: ['raw_history 表示完整历史上下文', 'retained_state 表示压缩后仍保留的关键信息', 'ratio 表示压缩后的状态密度'],
          visualizationLabel: '适合用 token 增长与摘要替换曲线解释“为什么系统必须做记忆管理”。',
        },
      },
    ],
  },
  {
    id: 'chapter-agents',
    order: '02',
    title: '智能体（Agent）框架选型',
    subtitle: '先判断是否需要 Agent，再决定形态',
    overview:
      '本章强调“不是所有场景都需要 Agent”。真正的工程判断应从任务稳定性、工具需求、失败成本和可观测性出发，按复杂度逐级选择工作流、工具增强系统或自主循环。',
    accent: 'amber',
    handoff:
      '一旦确定需要工具调用和循环，问题就会自然转向下一章：这些能力在工程上到底是怎么被组合成稳定系统的。',
    summary: [
      'Agent 不是默认答案，稳定且可枚举的流程优先用 Workflow。',
      '很多场景用“LLM + 工具 + 固定编排”就足够，单 Agent 往往已经能覆盖大部分收益。',
      '只有在并行拆解、角色隔离和交叉复核明确成立时，多 Agent 才值得引入。',
    ],
    stages: [
      {
        id: 'agents-fit',
        title: '场景适配判断',
        eyebrow: 'Decision',
        keyPoint: '先判断任务复杂度和失败成本，再判断是否需要自主性。',
        description:
          '用任务稳定性、步骤枚举程度、外部工具需求和失败代价做第一轮筛选。很多工程问题并不需要 Agent，只需要更清晰的工作流。',
        demoType: 'decision-matrix',
        talkingPoints: [
          '“不用 Agent”不是保守，而是更高性价比的工程选择。',
          '失败成本高的任务，要优先考虑可测、可回放、可审计。',
        ],
        demoHint: '先展示“不需要 Agent”的结论，再解释什么时候才值得引入自主性。',
      },
      {
        id: 'agents-tools',
        title: '单 Agent 工具增强系统',
        eyebrow: 'Tools',
        keyPoint: '单 Agent 负责理解目标、调用工具和读取结果，工具层负责确定性执行，编排层负责边界控制。',
        description:
          '很多真实系统并不需要完全自治，而是通过固定的工具选择、参数组织和结果回流，让单 Agent 作为智能路由器与解释器。',
        demoType: 'tool-call-flow',
        talkingPoints: [
          '工具调用本质上是在把不确定生成连接到确定执行能力上。',
          '只要一个 Agent 就能稳定推进时，不要为了“更像组织架构”而过早拆成多个角色。',
        ],
        demoHint: '把每一步都讲成“谁负责什么”，强调单 Agent 的收益已经来自清晰边界，而不是无限自治。',
      },
      {
        id: 'agents-loop',
        title: '多 Agent 协作结构',
        eyebrow: 'Multi-Agent',
        keyPoint: '只有当任务天然可并行、角色边界清晰且单 Agent 已接近认知上限时，多 Agent 才真正有必要。',
        description:
          '开放目标、多线程子任务和交叉复核需求会把系统推向多 Agent 结构。此时规划、执行、检索、评审之间的职责边界和协作协议必须被明确设计。',
        demoType: 'agent-loop',
        talkingPoints: [
          '多 Agent 的收益来自并行度、隔离度和评审链路，而不是“agent 越多越高级”。',
          '停止条件、权限边界、共享状态和协调开销，是多 Agent 系统的基本设施。',
        ],
        demoHint: '不要只讲多个角色本身，要强调什么时候拆得值、什么时候通信成本会反噬收益。',
      },
    ],
  },
  {
    id: 'chapter-claude',
    order: '03',
    title: 'Claude 工程实现解析',
    subtitle: '从模块边界理解可用系统',
    overview:
      '本章把 Claude 类系统拆成一条真实调用链：请求如何进入，约束如何注入，工具如何执行，历史如何压缩，循环如何停止。目标不是神化模型，而是解释一个工业系统如何变得可维护。',
    accent: 'rose',
    handoff:
      '回到工程实践，真正有价值的不是单点能力，而是把 Prompt、Tool、Memory 和 Loop 组合成有边界的系统。',
    summary: [
      'Claude 类产品的体验来自模型能力与工程模块的组合，而不是某一个神奇提示词。',
      'Prompt、Tool、Memory、Loop 必须通过清晰接口和状态边界协作。',
      '越强的 Agent 能力，越需要停止条件、错误恢复和权限控制。',
    ],
    stages: [
      {
        id: 'claude-entry',
        title: 'Prompt 结构与任务入口',
        eyebrow: 'Entry',
        keyPoint: '入口层负责把用户意图、约束和环境状态组装成可执行上下文。',
        description:
          '真实系统的 Prompt 不是一段文案，而是目标、规则、工具说明、工作区状态和用户要求的组合输入。',
        demoType: 'context-compression',
        talkingPoints: [
          'Prompt 层本质上是任务上下文装配器。',
          '哪些信息进入模型、以什么顺序进入模型，会直接改变后续执行路径。',
        ],
        demoHint: '讲清楚“为什么不是所有上下文都该无差别塞给模型”。',
      },
      {
        id: 'claude-tools',
        title: 'Tool 调用链路',
        eyebrow: 'Flow',
        keyPoint: '工具不是附属功能，而是让模型从“会说”走向“会做”的执行路径。',
        description:
          '系统需要处理工具选择、参数传递、执行结果回流和错误恢复。每一步都要能被追踪、回放和解释。',
        demoType: 'tool-call-flow',
        talkingPoints: [
          '模型负责决定“做什么”，工具负责完成“怎么做”。',
          '工具结果回流模型后，系统才能形成闭环决策。',
        ],
        demoHint: '把这一段讲成一条真正的执行链，而不是抽象模块列表。',
      },
      {
        id: 'claude-context',
        title: '上下文管理',
        eyebrow: 'Context',
        keyPoint: '长任务依赖高密度状态，而不是无限增长的聊天历史。',
        description:
          '上下文窗口再大也有限，系统必须做摘要、滑动窗口和任务状态提炼，否则多轮执行会迅速失焦。',
        demoType: 'context-compression',
        talkingPoints: [
          '压缩不是丢历史，而是把历史转成更高密度的状态表达。',
          '上下文管理好坏，会直接影响模型能否记住目标、约束和已完成步骤。',
        ],
        demoHint: '配合 token 曲线说明“长任务为何必须做状态提炼”。',
      },
      {
        id: 'claude-agent-loop',
        title: '工程化 Agent Loop',
        eyebrow: 'Orchestration',
        keyPoint: '循环只有在被停止条件、错误恢复和权限边界包住时，才是真正的工程能力。',
        description:
          'Claude 类系统可以被理解为：模型推理、工具执行、观察结果和上下文维护之间的受控循环。真正的价值在于循环被如何治理。',
        demoType: 'agent-loop',
        talkingPoints: [
          '循环系统必须知道什么时候继续、什么时候回退、什么时候停下。',
          '工程边界越清楚，Agent 能力越容易被稳定复用。',
        ],
        demoHint: '把 Thought / Action / Observation / Reflect 映射到工程模块，而不是停留在概念层。',
      },
    ],
  },
];

export const finalTakeaways = [
  '模型能力演进的真正主题，是瓶颈如何一层层从算法问题转移到系统问题。',
  'Agent 不是默认方案，工作流、工具增强和自主循环应该按复杂度逐级选择。',
  'Claude 类系统的关键不在于某个单点技巧，而在于 Prompt、Tool、Memory、Loop 的模块化协作。',
  '好的讲解和 demo 应该帮助观众看清结构与边界，而不是堆积概念名词。',
];
