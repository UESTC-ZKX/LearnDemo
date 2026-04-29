import { useEffect, useMemo, useState } from 'react';

type ModuleId =
  | 'input-embedding'
  | 'positional-encoding'
  | 'encoder-self-attention'
  | 'add-norm'
  | 'feed-forward'
  | 'output-embedding'
  | 'masked-self-attention'
  | 'cross-attention'
  | 'linear-softmax';

interface TransformerModule {
  id: ModuleId;
  title: string;
  layer: 'Encoder' | 'Decoder' | 'Output';
  responsibility: string;
  principle: string;
}

const modules: TransformerModule[] = [
  {
    id: 'input-embedding',
    title: 'Input Embedding',
    layer: 'Encoder',
    responsibility: '把离散 token 映射成连续向量，让后续层可以计算相似度和组合语义。',
    principle: '每个词元查表得到一个向量，向量空间里相近方向可以表示相近语义。',
  },
  {
    id: 'positional-encoding',
    title: 'Positional Encoding',
    layer: 'Encoder',
    responsibility: '补上顺序信息，因为自注意力本身不会天然知道 token 的先后。',
    principle: '位置向量和词向量相加，让同一个 token 在不同位置拥有不同表示。',
  },
  {
    id: 'encoder-self-attention',
    title: 'Multi-Head Self-Attention',
    layer: 'Encoder',
    responsibility: '让源句每个 token 直接查看其它 token，形成包含上下文的 source sentence memory。',
    principle: '每个头用 Q 和 K 计算相关性，softmax 得到权重，再对 V 加权求和；多头并行让模型从不同语义子空间观察关系。',
  },
  {
    id: 'feed-forward',
    title: 'Feed Forward Network',
    layer: 'Encoder',
    responsibility: '对每个位置独立做非线性变换，提升特征表达能力。',
    principle: '注意力负责混合不同位置的信息，FFN 负责在单个位置上加工信息。',
  },
  {
    id: 'add-norm',
    title: 'Add & Norm',
    layer: 'Encoder',
    responsibility: '把子层输入通过残差连接加回输出，再做 LayerNorm，让深层堆叠更稳定。',
    principle: 'Add 保留原始信息并改善梯度流动，Norm 把每个位置的表示归一化，降低训练震荡。',
  },
  {
    id: 'output-embedding',
    title: 'Output Embedding',
    layer: 'Decoder',
    responsibility: '把已经生成的目标 token 映射成向量，作为 decoder 下一步生成的输入。',
    principle: '训练时目标序列会右移一位输入 decoder；推理时则把上一步生成的 token 再送回 decoder。',
  },
  {
    id: 'masked-self-attention',
    title: 'Masked Self-Attention',
    layer: 'Decoder',
    responsibility: '生成目标句时只允许看已经生成的 token，防止偷看未来答案。',
    principle: 'mask 会挡住当前位置右侧的注意力分数，自回归生成才成立。',
  },
  {
    id: 'cross-attention',
    title: 'Encoder-Decoder Attention',
    layer: 'Decoder',
    responsibility: '让目标端每一步回看 encoder 产出的 source sentence memory，决定当前词该翻译源句哪一部分。',
    principle: 'Decoder state 做 Q，Encoder memory 做 K/V，把生成端和源句语义对齐。',
  },
  {
    id: 'linear-softmax',
    title: 'Linear + Softmax',
    layer: 'Output',
    responsibility: '把 decoder hidden state 转成词表概率，选择下一个输出 token。',
    principle: '线性层给每个候选词打分，softmax 把分数归一化为概率分布。',
  },
];

const translationSteps = [
  {
    title: 'Tokenize + encode',
    moduleId: 'encoder-self-attention' as ModuleId,
    detail: '源句拆成 I / love / AI，经过 embedding、position 和 encoder self-attention，得到 source sentence memory。',
    generated: '',
  },
  {
    title: 'Decode token 1',
    moduleId: 'cross-attention' as ModuleId,
    detail: 'Decoder 从 <BOS> 出发，通过 cross-attention 对齐 I，生成“我”。',
    generated: '我',
  },
  {
    title: 'Decode token 2',
    moduleId: 'masked-self-attention' as ModuleId,
    detail: 'Masked self-attention 只能看“我”，再回看源句 love，生成“爱”。',
    generated: '我 爱',
  },
  {
    title: 'Decode token 3',
    moduleId: 'linear-softmax' as ModuleId,
    detail: '输出层在候选词中给“人工智能”最高概率，完成翻译。',
    generated: '我 爱 人工智能',
  },
];

const architectureNodes: Array<{
  key: string;
  id: ModuleId;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  tone: 'encoder' | 'decoder' | 'output';
}> = [
  { key: 'encoder-input', id: 'input-embedding', label: 'Input Embedding', x: 55, y: 430, w: 210, h: 40, tone: 'encoder' },
  { key: 'encoder-position', id: 'positional-encoding', label: 'Positional Encoding', x: 55, y: 370, w: 210, h: 40, tone: 'encoder' },
  { key: 'encoder-attention', id: 'encoder-self-attention', label: 'Multi-Head Attention', x: 55, y: 270, w: 210, h: 46, tone: 'encoder' },
  { key: 'encoder-attention-norm', id: 'add-norm', label: 'Add & Norm', x: 75, y: 220, w: 170, h: 34, tone: 'encoder' },
  { key: 'encoder-ffn', id: 'feed-forward', label: 'Feed Forward', x: 55, y: 145, w: 210, h: 46, tone: 'encoder' },
  { key: 'encoder-ffn-norm', id: 'add-norm', label: 'Add & Norm', x: 75, y: 95, w: 170, h: 34, tone: 'encoder' },
  { key: 'decoder-output-embedding', id: 'output-embedding', label: 'Output Embedding', x: 405, y: 480, w: 210, h: 40, tone: 'decoder' },
  { key: 'decoder-masked-attention', id: 'masked-self-attention', label: 'Masked Multi-Head Attention', x: 405, y: 380, w: 210, h: 46, tone: 'decoder' },
  { key: 'decoder-masked-norm', id: 'add-norm', label: 'Add & Norm', x: 425, y: 330, w: 170, h: 34, tone: 'decoder' },
  { key: 'decoder-cross-attention', id: 'cross-attention', label: 'Multi-Head Attention', x: 405, y: 270, w: 210, h: 46, tone: 'decoder' },
  { key: 'decoder-cross-norm', id: 'add-norm', label: 'Add & Norm', x: 425, y: 220, w: 170, h: 34, tone: 'decoder' },
  { key: 'decoder-ffn', id: 'feed-forward', label: 'Feed Forward', x: 405, y: 160, w: 210, h: 46, tone: 'decoder' },
  { key: 'decoder-ffn-norm', id: 'add-norm', label: 'Add & Norm', x: 425, y: 110, w: 170, h: 34, tone: 'decoder' },
  { key: 'output-linear-softmax', id: 'linear-softmax', label: 'Linear + Softmax', x: 405, y: 60, w: 210, h: 38, tone: 'output' },
];

function ClassicTransformerArchitecture({
  activeModuleId,
  onSelect,
}: {
  activeModuleId: ModuleId;
  onSelect: (id: ModuleId) => void;
}) {
  const activeNode = architectureNodes.find((node) => node.id === activeModuleId) ?? architectureNodes[0];

  return (
    <svg
      className="mt-5 w-full rounded border border-line bg-zinc-950/80 p-2"
      viewBox="0 0 670 590"
      role="img"
      aria-label="Transformer 经典 Encoder Decoder 架构图"
    >
      <defs>
        <marker id="transformer-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M0,0 L8,4 L0,8 Z" fill="rgba(255,255,255,0.55)" />
        </marker>
      </defs>
      <text x="160" y="32" fill="#ffffff" fontSize="18" fontWeight="700" textAnchor="middle">
        Encoder
      </text>
      <text x="510" y="32" fill="#ffffff" fontSize="18" fontWeight="700" textAnchor="middle">
        Decoder
      </text>
      <text x="31" y="92" fill="rgba(61,214,198,0.9)" fontSize="14" fontWeight="700">
        Nx
      </text>
      <text x="381" y="100" fill="rgba(245,158,11,0.9)" fontSize="14" fontWeight="700">
        Nx
      </text>
      <rect x="35" y="80" width="250" height="250" rx="12" fill="rgba(61,214,198,0.06)" stroke="rgba(61,214,198,0.35)" />
      <rect x="385" y="105" width="250" height="340" rx="12" fill="rgba(245,158,11,0.06)" stroke="rgba(245,158,11,0.35)" />

      {architectureNodes.map((node) => {
        const isActive = node.id === activeModuleId;
        const fill =
          node.tone === 'encoder'
            ? isActive
              ? 'rgba(61,214,198,0.28)'
              : 'rgba(61,214,198,0.12)'
            : node.tone === 'decoder'
              ? isActive
                ? 'rgba(245,158,11,0.28)'
                : 'rgba(245,158,11,0.12)'
              : isActive
                ? 'rgba(255,255,255,0.18)'
                : 'rgba(255,255,255,0.08)';
        const stroke =
          node.tone === 'encoder'
            ? isActive
              ? '#3dd6c6'
              : 'rgba(61,214,198,0.56)'
            : node.tone === 'decoder'
              ? isActive
                ? '#f59e0b'
                : 'rgba(245,158,11,0.56)'
              : isActive
                ? '#ffffff'
                : 'rgba(255,255,255,0.42)';

        return (
          <g
            key={node.key}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(node.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                onSelect(node.id);
              }
            }}
          >
            <rect x={node.x} y={node.y} width={node.w} height={node.h} rx="8" fill={fill} stroke={stroke} strokeWidth={isActive ? 2.5 : 1.5} />
            <text x={node.x + node.w / 2} y={node.y + node.h / 2 + 5} fill="#ffffff" fontSize="14" fontWeight="700" textAnchor="middle">
              {node.label}
            </text>
          </g>
        );
      })}

      {[
        [160, 430, 160, 410],
        [160, 370, 160, 316],
        [160, 270, 160, 254],
        [160, 220, 160, 191],
        [160, 145, 160, 129],
        [510, 480, 510, 426],
        [510, 380, 510, 364],
        [510, 330, 510, 316],
        [510, 270, 510, 254],
        [510, 220, 510, 206],
        [510, 160, 510, 144],
        [510, 110, 510, 98],
      ].map(([x1, y1, x2, y2]) => (
        <line key={`${x1}-${y1}-${y2}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.48)" strokeWidth="2" markerEnd="url(#transformer-arrow)" />
      ))}

      <line x1="265" y1="118" x2="405" y2="293" stroke="rgba(255,255,255,0.55)" strokeDasharray="7 7" strokeWidth="2" markerEnd="url(#transformer-arrow)" />
      <text x="335" y="205" fill="rgba(255,255,255,0.62)" fontSize="12" textAnchor="middle">
        encoder memory
      </text>
      <line x1="510" y1="60" x2="510" y2="45" stroke="rgba(255,255,255,0.48)" strokeWidth="2" markerEnd="url(#transformer-arrow)" />
      <text x="510" y="565" fill="rgba(255,255,255,0.62)" fontSize="13" textAnchor="middle">
        Outputs shifted right
      </text>
      <text x="160" y="565" fill="rgba(255,255,255,0.62)" fontSize="13" textAnchor="middle">
        Inputs
      </text>
      <text x={activeNode.x + activeNode.w / 2} y={activeNode.y - 10} fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">
        当前讲解
      </text>
    </svg>
  );
}

function ArchitectureBlock({
  module,
  activeModuleId,
  onSelect,
}: {
  module: TransformerModule;
  activeModuleId: ModuleId;
  onSelect: (id: ModuleId) => void;
}) {
  const isActive = module.id === activeModuleId;

  return (
    <button
      type="button"
      className={`rounded border px-3 py-2 text-left text-sm transition ${
        isActive ? 'border-signal/80 bg-signal/15 text-white' : 'border-line bg-black/20 text-zinc-300 hover:border-signal/50'
      }`}
      onClick={() => onSelect(module.id)}
    >
      {module.title}
    </button>
  );
}

export function TransformerDemoPage() {
  const [activeModuleId, setActiveModuleId] = useState<ModuleId>('input-embedding');
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const activeModule = useMemo(
    () => modules.find((module) => module.id === activeModuleId) ?? modules[0],
    [activeModuleId],
  );
  const activeStep = translationSteps[stepIndex];

  useEffect(() => {
    setActiveModuleId(activeStep.moduleId);
  }, [activeStep.moduleId]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timer = window.setInterval(() => {
      setStepIndex((current) => {
        if (current >= translationSteps.length - 1) {
          setIsPlaying(false);
          return current;
        }

        return current + 1;
      });
    }, 1200);

    return () => window.clearInterval(timer);
  }, [isPlaying]);

  function nextStep() {
    setStepIndex((current) => Math.min(current + 1, translationSteps.length - 1));
  }

  function resetSteps() {
    setIsPlaying(false);
    setStepIndex(0);
  }

  return (
    <main data-testid="transformer-demo-page" className="min-h-screen bg-ink px-5 py-6 text-zinc-100 lg:px-10">
      <section className="mx-auto grid max-w-7xl gap-5">
        <header className="flex flex-col gap-3 border-b border-line pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-signal">Transformer teaching lab</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Transformer：从经典架构到翻译全链路</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">
              先看 Attention Is All You Need Figure 1 风格的 Encoder-Decoder 结构，再拆模块职责，最后演示 I love AI 到 我爱人工智能。
            </p>
          </div>
          <div className="rounded border border-line bg-black/20 px-3 py-2 text-sm text-zinc-300">Figure 1 教学重绘</div>
        </header>

        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded border border-line bg-white/[0.035] p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">经典 Encoder / Decoder 架构</h2>
              <span className="rounded border border-signal/40 bg-signal/10 px-2 py-1 text-xs text-signal">
                {activeModule.title}
              </span>
            </div>

            <ClassicTransformerArchitecture activeModuleId={activeModuleId} onSelect={setActiveModuleId} />

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded border border-signal/50 bg-signal/10 p-4">
                <h3 className="text-base font-semibold text-white">Encoder：把输入句子压成上下文记忆</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  源句先经过 embedding 和 position，再在 N 层 encoder 中反复执行 multi-head self-attention、Add &amp; Norm、FFN。输出不是一个词，而是一组带上下文的向量记忆。
                </p>
                <div className="mt-3 grid gap-2">
                  {modules
                    .filter((module) => module.layer === 'Encoder')
                    .map((module) => (
                      <ArchitectureBlock key={module.id} module={module} activeModuleId={activeModuleId} onSelect={setActiveModuleId} />
                    ))}
                </div>
              </div>

              <div className="rounded border border-amber/50 bg-amber/10 p-4">
                <h3 className="text-base font-semibold text-white">Decoder：一边看历史输出，一边回看输入</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  目标句右移后进入 decoder。Masked self-attention 保证不能偷看未来，Encoder-Decoder Attention 对齐源句记忆，最后 Linear + Softmax 选出下一个 token。
                </p>
                <div className="mt-3 grid gap-2">
                  {modules
                    .filter((module) => module.layer === 'Decoder' || module.layer === 'Output')
                    .map((module) => (
                      <ArchitectureBlock key={module.id} module={module} activeModuleId={activeModuleId} onSelect={setActiveModuleId} />
                    ))}
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-4">
              {translationSteps.map((step, index) => (
                <button
                  key={step.title}
                  type="button"
                  className={`rounded border p-3 text-left text-sm transition ${
                    index === stepIndex ? 'border-amber/70 bg-amber/10 text-white' : 'border-line bg-black/20 text-zinc-300 hover:border-amber/50'
                  }`}
                  onClick={() => setStepIndex(index)}
                >
                  <div className="text-xs uppercase tracking-[0.16em] text-zinc-500">step {index + 1}</div>
                  <div className="mt-1 font-semibold">{step.title}</div>
                </button>
              ))}
            </div>
          </section>

          <aside className="grid gap-4">
            <section data-testid="transformer-module-explanation" className="rounded border border-line bg-white/[0.035] p-5">
              <p className="text-sm font-semibold text-signal">模块职责</p>
              <h2 className="mt-1 text-xl font-semibold text-white">{activeModule.title}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{activeModule.responsibility}</p>
              <p className="mt-3 rounded border border-line bg-black/20 p-3 text-sm leading-6 text-zinc-300">{activeModule.principle}</p>
            </section>

            <section className="rounded border border-line bg-white/[0.035] p-5">
              <p className="text-sm font-semibold text-amber">翻译全链路</p>
              <h2 className="mt-1 text-xl font-semibold text-white">{activeStep.title}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{activeStep.detail}</p>
              <div className="mt-4 rounded border border-line bg-black/20 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Generated output</div>
                <div data-testid="translation-output" className="mt-2 min-h-8 text-2xl font-semibold text-white">
                  {activeStep.generated || '尚未生成'}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" className="control-button" onClick={nextStep}>
                  下一步
                </button>
                <button type="button" className="control-button" onClick={() => setIsPlaying((current) => !current)}>
                  {isPlaying ? '暂停' : '自动播放'}
                </button>
                <button type="button" className="demo-button" onClick={resetSteps}>
                  重置
                </button>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
