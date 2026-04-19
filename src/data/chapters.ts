export type DemoType =
  | 'timeline'
  | 'sequence-decay'
  | 'attention'
  | 'decision-matrix'
  | 'tool-call-flow'
  | 'context-compression'
  | 'agent-loop';

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
    subtitle: '从早期智能设想到 GPT-5',
    overview: '本阶段用互动实验台建立共同语境：左侧时间线从 1943 年神经元数学模型推进到 GPT-5，右侧用可视化演示解释每次架构和训练范式变化解决了什么问题。',
    accent: 'signal',
    handoff: '当模型从可学习、可扩展走向可调用，问题不再只是“能不能回答”，而是“如何稳定完成任务”。',
    summary: [
      '早期人工智能先把智能变成可建模、可测试的问题。',
      '函数拟合、神经网络训练、CNN/RNN 让“从数据学习表示”逐步变得可演示。',
      'RNN 的长依赖问题推动了更适合全局建模的注意力（Attention）/ Transformer。',
      'GPT-5 作为本章时间线终点，把能力整合、效率约束和工程调用自然引向智能体（Agent）选型。',
    ],
    stages: [
      {
        id: 'models-scaling',
        title: '规模化预训练',
        eyebrow: '2018-2020',
        keyPoint: '参数、数据和算力共同推动通用能力出现。',
        description: '预训练把语言理解、知识压缩和生成能力收敛到统一范式里，应用侧开始把模型当成通用能力底座。',
        demoType: 'timeline',
        timeframe: '2018-2020',
        talkingPoints: [
          '从任务专用模型转向通用预训练模型，复用能力明显增强。',
          '规模化带来能力涌现，也带来成本、延迟和可解释性压力。',
        ],
        demoHint: '点击时间线节点，说明“解决的问题、留下的局限、下一阶段为何出现”。',
      },
      {
        id: 'models-sequence',
        title: '序列建模的长依赖瓶颈',
        eyebrow: 'RNN 时代',
        keyPoint: '信息沿序列传播会衰减，远距离关系很难稳定保留。',
        description: 'RNN/LSTM 让序列任务变得可行，但当文本变长，早期信息经过多步传递后容易被冲淡。',
        demoType: 'sequence-decay',
        timeframe: 'RNN / LSTM',
        talkingPoints: [
          '长距离依赖不是“模型不努力”，而是信息路径太长。',
          '这为注意力（Attention）的全局连接视角埋下伏笔。',
        ],
        demoHint: '观察序列向右传播时颜色变浅，强调远距离信息衰减。',
      },
      {
        id: 'models-attention',
        title: 'Transformer 与全局关注',
        eyebrow: '注意力（Attention）',
        keyPoint: '每个 token（词元）可以直接关注其他 token，显著缩短信息路径。',
        description: 'Transformer 让并行训练、长距离关系建模和可扩展性同时变好，是后续大模型能力扩张的关键基础。',
        demoType: 'attention',
        timeframe: '2017+',
        talkingPoints: [
          '注意力（Attention）不是“平均看所有词”，而是按当前 token（词元）的需要分配权重。',
          '全局关注让模型更适合处理复杂上下文关系。',
        ],
        demoHint: '选中 token（词元）后观察关联强弱，讲清“全局关注”的直觉。',
      },
      {
        id: 'models-alignment',
        title: '指令对齐与产品化能力',
        eyebrow: '2021+',
        keyPoint: '模型从续写文本转向更可控的任务响应。',
        description: '指令微调和反馈对齐让模型更适合被人类和产品调用，为智能体（Agent）、工具调用和工程执行奠定基础。',
        demoType: 'timeline',
        timeframe: '2021+',
        talkingPoints: [
          '对齐让模型输出更像“可协作接口”，而不是裸生成器。',
          '能力可调用之后，系统设计重点转向任务组织和边界控制。',
        ],
        demoHint: '回到时间线说明：能力可控以后，工程系统开始承担更大责任。',
      },
    ],
  },
  {
    id: 'chapter-agents',
    order: '02',
    title: '智能体（Agent）框架选型',
    subtitle: '先判断是否需要智能体（Agent），再选择形态',
    overview: '本阶段强调“不是所有场景都需要智能体（Agent）”：先识别任务复杂度、控制需求和工具边界，再比较工作流、工具增强与自主循环。选型目标是降低系统复杂度，而不是追逐概念。',
    accent: 'amber',
    handoff: '选型落地以后，真正的挑战会转向工程结构、上下文管理和可维护性。',
    summary: [
      '不是所有场景都需要智能体（Agent），稳定、可枚举流程优先使用工作流（Workflow）。',
      '工具数增加时可以先做工具增强大语言模型（Tool-enhanced LLM），而不是直接引入自主循环。',
      '自主智能体（Autonomous Agent）适合开放目标、多步探索、反馈驱动的任务，但必须配套观测和边界。',
    ],
    stages: [
      {
        id: 'agents-fit',
        title: '场景适配判断',
        eyebrow: '决策（Decision）',
        keyPoint: '稳定流程优先工作流，开放任务才考虑智能体。',
        description: '先用复杂度、控制需求、工具数量和失败成本判断是否需要智能体，避免把简单任务复杂化。',
        demoType: 'decision-matrix',
        talkingPoints: [
          '确定性强、步骤固定的场景，工作流（Workflow）更容易测试和运维。',
          '需要探索和反馈闭环时，智能体（Agent）才开始有足够收益。',
        ],
        demoHint: '调整选型维度，观察建议从“不需要智能体”逐步变成智能体。',
      },
      {
        id: 'agents-tools',
        title: '工具增强（Tool-enhanced）作为中间形态',
        eyebrow: '工具（Tools）',
        keyPoint: '模型负责理解意图，工具负责确定性执行。',
        description: '很多产品只需要“LLM + 工具调用 + 固定编排”，不需要完全自主的循环。',
        demoType: 'tool-call-flow',
        talkingPoints: [
          '工具调用把不可靠的生成结果接到可靠系统能力上。',
          '固定编排保留了可控性，也能覆盖大量真实业务场景。',
        ],
        demoHint: '沿着工具调用（Tool Call）流程讲清每一步的责任边界。',
      },
      {
        id: 'agents-loop',
        title: '智能体（Agent）循环结构',
        eyebrow: '循环（Loop）',
        keyPoint: '观察、计划、行动、反馈构成可讲解的状态流转。',
        description: '当任务需要多轮探索时，智能体循环把思考（Thought）、行动（Action）、观察（Observation）组织成可迭代的执行过程。',
        demoType: 'agent-loop',
        talkingPoints: [
          '循环带来灵活性，也带来不可预测性和调试成本。',
          '真实落地要限制动作空间、记录轨迹、设置停止条件。',
        ],
        demoHint: '逐步播放循环，强调每一步输入输出如何影响下一步。',
      },
    ],
  },
  {
    id: 'chapter-claude',
    order: '03',
    title: 'Claude 工程实现解析',
    subtitle: '从模块边界理解产品能力',
    overview: '本阶段从工程模块角度讲 Claude：命令入口、工具调用、上下文压缩和任务编排如何协作。重点不泛泛谈模型能力，而是解释一个可用的工程系统如何把能力包装成稳定体验。',
    accent: 'rose',
    handoff: '最终回到工程实践：把能力拆成可维护、可解释、可演示的模块。',
    summary: [
      'Claude 这类产品的体验来自模型能力与工程模块的组合。',
      '工具调用、上下文压缩、任务循环都需要清晰的工程模块边界。',
      '工程模块化让分享内容能落到可维护、可解释、可演示的实现结构。',
    ],
    stages: [
      {
        id: 'claude-entry',
        title: '命令入口与任务上下文',
        eyebrow: '入口（Entry）',
        keyPoint: '入口层负责把用户意图转成可执行上下文。',
        description: '命令解析、工作区状态、文件上下文和用户约束共同构成任务起点。',
        demoType: 'context-compression',
        talkingPoints: [
          '入口不是简单输入框，而是任务环境的组装层。',
          '上下文越复杂，越需要明确哪些信息进入模型。',
        ],
        demoHint: '用上下文窗口演示说明：不是所有信息都应该无差别塞进去。',
      },
      {
        id: 'claude-tools',
        title: '工具调用链路',
        eyebrow: '流程（Flow）',
        keyPoint: '工具不是附属功能，而是工程执行路径的一部分。',
        description: '从用户请求到工具选择、执行结果、再到最终回答，每一步都要可追踪、可恢复。',
        demoType: 'tool-call-flow',
        talkingPoints: [
          '模型决定意图和参数，工具负责执行确定性动作。',
          '工具结果必须回流给模型，才能形成可解释的闭环。',
        ],
        demoHint: '切换流程步骤，说明每一层产物如何进入下一层。',
      },
      {
        id: 'claude-context',
        title: '上下文压缩',
        eyebrow: '上下文（Context）',
        keyPoint: '长任务依赖上下文取舍，而不是无限堆消息。',
        description: '长对话和长任务会快速消耗上下文窗口，需要用摘要（Summary）或滑动窗口（Sliding Window）保留关键状态。',
        demoType: 'context-compression',
        talkingPoints: [
          '压缩不是丢弃历史，而是把历史变成更高密度的任务状态。',
          '压缩策略影响模型是否还能理解目标、约束和已完成步骤。',
        ],
        demoHint: '观察 token（词元）增长和摘要替换，解释为什么长任务需要压缩。',
      },
      {
        id: 'claude-agent-loop',
        title: '工程化智能体循环（Agent Loop）',
        eyebrow: '编排（Orchestration）',
        keyPoint: '循环必须被工程系统约束，才能成为可靠能力。',
        description: 'Claude 工程实现可以被理解为：模型推理、工具执行、观察结果和上下文维护之间的受控循环。',
        demoType: 'agent-loop',
        talkingPoints: [
          '工程系统要负责停止条件、错误恢复和状态记录。',
          '智能体（Agent）能力越强，越需要模块边界来控制复杂度。',
        ],
        demoHint: '把思考（Thought）/ 行动（Action）/ 观察（Observation）对应到工程模块，避免泛泛谈智能。',
      },
    ],
  },
];

export const finalTakeaways = [
  '从模型能力到工程系统，是这次分享的主线：模型越强，越需要清晰的任务组织方式。',
  '智能体（Agent）不是默认答案，工作流（Workflow）、工具增强（Tool-enhanced）和自主智能体（Autonomous Agent）要按复杂度逐步选择。',
  'Claude 工程实现的关键不是单点能力，而是工具、上下文、循环和边界的模块化协作。',
  '好的演示应该帮助观众理解结构，而不是模拟真实训练或真实推理。',
];
