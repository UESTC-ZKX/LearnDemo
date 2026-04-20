# Transformer 演示页优化设计

## 背景与目标

当前 Transformer 内容分成两块：主章节里的 AttentionDemo 偏向矩阵并行计算，技术实验区里的 Transformer 架构块偏静态。它们能说明一部分概念，但还不够适合演讲时按“整体架构、模块职责、执行过程、完整翻译案例”逐层讲解。

本次改造采用已验证的“主页面轻讲解 + 独立高交互 Demo 页”方案：

1. 主页面 Transformer 卡片保留轻量入口，用经典 Encoder-Decoder 架构缩略图建立整体直觉。
2. 独立 Demo 页完整承载 Transformer 教学流程，适合投屏讲解。
3. 架构图采用 Attention Is All You Need Figure 1 风格的教学重绘，避免引入外部图片资源，同时保留经典结构关系。
4. 页面先举例介绍各模块职责和执行原理，最后演示一个翻译全链路 case。

## 页面结构

### 主页面入口

技术实验区的“Transformer：编码器与解码器”保留在原位置，但内容改成轻量引导：

1. 左侧展示 Figure 1 风格的 Encoder / Decoder 缩略结构。
2. 右侧列出 Input Embedding、Positional Encoding、Self-Attention、Cross-Attention、Feed Forward、Linear + Softmax 的职责。
3. 增加“打开完整 Demo”按钮，通过 `?demo=transformer` 在新窗口打开独立教学页。
4. 如果浏览器阻止弹窗，显示可理解提示。

### 独立 Transformer Demo 页

独立页分为三个讲解阶段：

1. 架构总览：展示经典 Encoder-Decoder 架构重绘，支持点击模块高亮。
2. 模块拆解：右侧面板解释当前模块的职责、输入输出和执行原理。
3. 翻译全链路：用 “I love AI” 到 “我爱人工智能” 的固定 case 展示 tokenization、embedding、encoder memory、decoder masked self-attention、cross-attention、softmax 选词和最终输出。

## 交互设计

1. 顶部阶段按钮：架构总览、模块拆解、翻译全链路。
2. 模块按钮：点击后高亮架构图中的对应模块，并更新讲解面板。
3. 翻译流程按钮：支持单步推进、自动播放、暂停、重置。
4. 翻译链路每一步要同时展示当前输入 token、正在工作的模块和生成结果。

## 技术实现

1. 沿用现有 query 参数入口，不引入路由库。
2. 新增 `TransformerDemoPage` 作为独立页面组件。
3. 扩展 `perceptronDemoMode.ts`，新增 `transformer-demo` 模式和 URL builder。
4. 修改 `main.tsx` 根据 `?demo=transformer` 渲染独立页。
5. 修改 `TechnicalEvolutionLabs.tsx`，为 Transformer 区域增加完整 Demo 入口和更清晰的架构缩略图。
6. 使用 SVG / HTML 结构绘制教学重绘图，不依赖外部图片和新增图形库。

## 验收标准

1. 主页面 Transformer 实验区能打开 `?demo=transformer` 独立页。
2. 独立页能看到 Figure 1 风格的 Encoder-Decoder 结构重绘。
3. 点击模块后，讲解面板能显示模块职责和执行原理。
4. 翻译全链路能按步骤演示 “I love AI” 到 “我爱人工智能”。
5. 现有测试和构建流程不被破坏。

## 自检结论

范围聚焦在 Transformer 讲解页，不扩展为通用 Transformer 训练平台；不引入新路由库；不引入外部图片资源；主页面保持轻量，完整讲解放到独立页。
