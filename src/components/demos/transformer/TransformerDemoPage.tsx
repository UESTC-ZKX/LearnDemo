import { useEffect, useMemo, useState } from 'react';

type ModuleId =
  | 'input-embedding'
  | 'positional-encoding'
  | 'encoder-self-attention'
  | 'feed-forward'
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
    title: 'Encoder Self-Attention',
    layer: 'Encoder',
    responsibility: '让源句每个 token 直接查看其它 token，形成包含上下文的 source sentence memory。',
    principle: 'Q 和 K 计算相关性，softmax 得到权重，再对 V 加权求和。',
  },
  {
    id: 'feed-forward',
    title: 'Feed Forward',
    layer: 'Encoder',
    responsibility: '对每个位置独立做非线性变换，提升特征表达能力。',
    principle: '注意力负责混合不同位置的信息，FFN 负责在单个位置上加工信息。',
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
    title: 'Cross-Attention',
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

            <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto_1fr]">
              <div className="rounded border border-signal/60 bg-signal/10 p-4">
                <div className="text-center text-base font-semibold text-white">Encoder</div>
                <div className="mt-4 grid gap-2">
                  {modules
                    .filter((module) => module.layer === 'Encoder')
                    .map((module) => (
                      <div key={module.id} className="grid gap-2">
                        <ArchitectureBlock module={module} activeModuleId={activeModuleId} onSelect={setActiveModuleId} />
                        {module.id === 'encoder-self-attention' || module.id === 'feed-forward' ? (
                          <div className="rounded border border-line/70 bg-black/10 px-3 py-1 text-center text-xs text-zinc-400">
                            Add &amp; Norm
                          </div>
                        ) : null}
                      </div>
                    ))}
                </div>
                <div className="mt-4 rounded border border-line bg-black/20 p-3 text-sm text-zinc-300">源句：I / love / AI</div>
              </div>

              <div className="flex items-center justify-center text-3xl text-zinc-500">→</div>

              <div className="rounded border border-amber/60 bg-amber/10 p-4">
                <div className="text-center text-base font-semibold text-white">Decoder</div>
                <div className="mt-4 grid gap-2">
                  {modules
                    .filter((module) => module.layer === 'Decoder' || module.layer === 'Output')
                    .map((module) => (
                      <div key={module.id} className="grid gap-2">
                        <ArchitectureBlock module={module} activeModuleId={activeModuleId} onSelect={setActiveModuleId} />
                        {module.layer === 'Decoder' ? (
                          <div className="rounded border border-line/70 bg-black/10 px-3 py-1 text-center text-xs text-zinc-400">
                            Add &amp; Norm
                          </div>
                        ) : null}
                      </div>
                    ))}
                </div>
                <div className="mt-4 rounded border border-line bg-black/20 p-3 text-sm text-zinc-300">目标句：我 / 爱 / 人工智能</div>
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
