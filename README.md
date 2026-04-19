# 技术分享前端页面

主题：《从大模型发展，到 Agent 框架选型，再到 Claude 工程实现解析》。

这是一个面向现场分享和屏幕投影的单页前端项目。页面按三大章节组织内容，并提供轻量交互 demo、章节 Summary、Final Takeaways 和演讲模式。

## 启动方式

```bash
npm install
npm run dev
```

常用命令：

```bash
npm run test
npm run build
npm run preview
```

## 目录结构

```text
src/
  components/
    ChapterSection.tsx
    FinalTakeaways.tsx
    PresentationControls.tsx
    Sidebar.tsx
    StageCard.tsx
    demos/
      AgentLoopDemo.tsx
      AttentionDemo.tsx
      ContextCompressionDemo.tsx
      DecisionMatrixDemo.tsx
      DemoFrame.tsx
      DemoRenderer.tsx
      SequenceDecayDemo.tsx
      TimelineDemo.tsx
      ToolCallFlowDemo.tsx
  data/
    chapters.ts
    chapters.test.ts
    demoContent.ts
  hooks/
    useActiveSection.ts
  test/
    setup.ts
  App.tsx
  App.test.tsx
  index.css
  main.tsx
```

## 如何增加新章节

在 `src/data/chapters.ts` 中追加一个 `Chapter` 对象，并保证：

- `id` 唯一，且以 `chapter-` 开头。
- `title`、`subtitle`、`overview` 面向讲解场景。
- `stages` 至少包含三个阶段，阶段中声明 `demoType`、`talkingPoints` 和 `demoHint`。
- `handoff` 写清楚章节之间的承接关系。
- `summary` 给出本章末尾的结论表达。

页面导航和主内容会自动从数据中渲染。

## 如何替换 Demo 数据

Demo 的展示组件在 `src/components/demos/`，演示数据在 `src/data/demoContent.ts`。替换数据时优先改数据文件；如果要新增 demo 类型：

1. 在 `src/data/chapters.ts` 扩展 `DemoType`。
2. 在 `src/components/demos/` 新增独立组件。
3. 在 `DemoRenderer.tsx` 增加映射。
4. 给组件补一条测试，保证它不是静态占位。

## 如何用于现场分享

- 点击右下角“进入演讲模式”，页面会隐藏侧边栏并放宽内容区。
- 使用 `↑` / `↓` 或 `←` / `→` 在 Hero、章节、阶段和 Final Takeaways 之间切换。
- 使用数字键 `1`、`2`、`3` 快速跳转三大章节。
- 左侧导航仍适合非演讲模式下按章节浏览。

## 内容结构

- 第一章“大模型发展”按时间/阶段展开，覆盖预训练、长依赖瓶颈、Attention 和指令对齐。
- 第二章“Agent 框架选型”突出“不是所有场景都需要 Agent”，并用决策图解释选型。
- 第三章“Claude 工程实现解析”从入口、工具调用、上下文压缩和工程化循环讲模块关系。

## 当前可扩展点

- 继续丰富每个 demo 的数据样例。
- 给演讲模式增加全屏 API 接入。
- 根据正式分享时长裁剪章节数量和每个阶段的讲解密度。
