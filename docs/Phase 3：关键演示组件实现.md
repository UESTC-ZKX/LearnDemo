请继续第三阶段，实现关键演示组件。优先做“讲解价值高”的组件，而不是炫技。

需要实现这些 demo：

1. 模型发展时间线
- 可横向或纵向时间线
- 点击节点显示：
  - 阶段名称
  - 解决的问题
  - 局限
  - 下一阶段为什么出现

2. RNN 长依赖衰减演示
- 用动画展示信息随序列传播逐渐衰减
- 强调长距离依赖问题

3. Transformer / Attention 演示
- 输入一条示例句子
- 选中一个 token 时，高亮其与其他 token 的关联强弱
- 不要求真实模型计算，但视觉上要表达“全局关注”

4. Agent 框架选型决策图
- 根据复杂度、控制需求、工具数等维度给出建议
- 展示：
  - 不需要 Agent
  - Workflow
  - Tool-enhanced
  - Autonomous Agent

5. Tool Call 流程演示
- 用步骤流展示：
  User -> LLM -> Tool selection -> Tool result -> LLM -> Answer
- 每一步可以切换查看状态

6. 上下文窗口 / 压缩演示
- 模拟 token 使用增长
- 超出阈值后进入 summary/compression
- 可展示 sliding window 或 summary 替换逻辑

7. Agent Loop 演示
- 展示 Thought / Action / Observation 的循环
- 可以是 stepper 或自动播放流程

要求：
- 所有 demo 组件独立封装
- 数据与 UI 分离
- 动画轻量、稳定、适合投影
- 每个 demo 下方给出“讲解提示”区域