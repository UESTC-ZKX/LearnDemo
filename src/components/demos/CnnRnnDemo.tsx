import { useEffect, useMemo, useState } from 'react';
import { DemoFrame } from './DemoFrame';

type ViewMode = 'cnn' | 'rnn' | 'transformer';

const cnnTokens = ['输入', '边缘', '纹理', '部件', '对象'];
const rnnStates = ['x1', 'h1', 'h2', 'h3', '输出'];

const viewCopy: Record<ViewMode, { title: string; detail: string; secondary: string }> = {
  cnn: {
    title: 'CNN（卷积神经网络）：局部感受野',
    detail: '局部感受野只看相邻区域，再通过特征提取把边缘、纹理逐步组合成更高层模式。',
    secondary: '同一个卷积核会在不同位置共享参数，因此同类特征出现在不同地方也能被识别。',
  },
  rnn: {
    title: 'RNN（循环神经网络）：状态链',
    detail: '隐藏状态沿序列逐步传递，每个新 token（词元）都读取上一时刻状态后再更新。',
    secondary: '这种顺序处理保留了时间顺序，但早期信息到最终输出的路径会越来越长。',
  },
  transformer: {
    title: '为什么需要 Transformer',
    detail: '传统状态链很难稳定保留长距离依赖，Transformer 通过 token（词元）之间的直接连接缩短信号路径。',
    secondary: '更短的路径让远处上下文能更直接参与当前判断，不再完全依赖一条脆弱的状态链。',
  },
};

interface CnnRnnDemoProps {
  focus?: ViewMode;
}

export function CnnRnnDemo({ focus = 'cnn' }: CnnRnnDemoProps) {
  const [view, setView] = useState<ViewMode>(focus);

  useEffect(() => {
    setView(focus);
  }, [focus]);

  const activeCopy = viewCopy[view];

  const cnnWindow = useMemo(() => {
    if (view !== 'cnn') {
      return [1, 1, 0.45, 0.2, 0.2];
    }

    return [0.35, 1, 1, 0.35, 0.2];
  }, [view]);

  const rnnStrength = useMemo(() => {
    if (view !== 'rnn') {
      return [0.25, 0.45, 0.55, 0.65, 0.8];
    }

    return [0.3, 0.5, 0.7, 0.85, 1];
  }, [view]);

  return (
    <DemoFrame title="CNN / RNN / Transformer 对比" hint="切换三种视图，先看局部感受野，再看状态链，最后看为什么 Transformer 需要更短的信息路径。" testId="demo-cnn-rnn">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={`demo-button ${view === 'cnn' ? 'demo-button-active' : ''}`}
          onClick={() => setView('cnn')}
        >
          CNN（卷积神经网络）
        </button>
        <button
          type="button"
          className={`demo-button ${view === 'rnn' ? 'demo-button-active' : ''}`}
          onClick={() => setView('rnn')}
        >
          RNN（循环神经网络）
        </button>
        <button
          type="button"
          className={`demo-button ${view === 'transformer' ? 'demo-button-active' : ''}`}
          onClick={() => setView('transformer')}
        >
          为什么需要 Transformer
        </button>
      </div>

      <div data-testid="cnn-rnn-visual" className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded border border-line bg-black/20 p-4">
          <div className="flex items-center justify-between gap-3">
            <h5 className="text-sm font-semibold text-white">{activeCopy.title}</h5>
            <span className="rounded border border-line px-2 py-1 text-[11px] uppercase tracking-wide text-zinc-400">{view}</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-300">{activeCopy.detail}</p>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{activeCopy.secondary}</p>

          {view === 'cnn' ? (
            <div className="mt-4 grid grid-cols-5 gap-2">
              {cnnTokens.map((token, index) => (
                <div
                  key={token}
                  className="rounded border border-line px-2 py-3 text-center text-sm text-white"
                  style={{ backgroundColor: `rgba(61, 214, 198, ${cnnWindow[index]})` }}
                >
                  {token}
                </div>
              ))}
            </div>
          ) : null}

          {view === 'rnn' ? (
            <div className="mt-4 grid grid-cols-5 gap-2">
              {rnnStates.map((state, index) => (
                <div
                  key={state}
                  className="rounded border border-line px-2 py-3 text-center text-sm text-white"
                  style={{ backgroundColor: `rgba(251, 191, 36, ${rnnStrength[index]})` }}
                >
                  {state}
                </div>
              ))}
            </div>
          ) : null}

          {view === 'transformer' ? (
            <div className="mt-4 grid gap-2">
              <div className="rounded border border-line bg-zinc-950/70 p-3 text-sm text-zinc-200">
                长距离依赖：早期 token（词元）可以影响后续 token，不必全部挤进一条状态链。
              </div>
              <div className="rounded border border-line bg-zinc-950/70 p-3 text-sm text-zinc-200">
                缩短信号路径：直接注意力连接让上下文用更少跳数跨越序列。
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded border border-line bg-black/20 p-4">
          <h5 className="text-sm font-semibold text-white">讲解含义</h5>
          <div className="mt-3 grid gap-2 text-sm leading-6 text-zinc-300">
            <p>
              <span className="font-semibold text-signal">关注点：</span>
              {view === 'cnn' ? '局部模式识别' : view === 'rnn' ? '序列记忆' : '长距离依赖'}
            </p>
            <p>
              <span className="font-semibold text-amber">路径：</span>
              {view === 'transformer' ? '更短的直接路径' : '一步一步传递'}
            </p>
            <p>
              <span className="font-semibold text-rose">取舍：</span>
              {view === 'cnn' ? '擅长附近特征' : view === 'rnn' ? '保留顺序，但远距离关系较弱' : '远距上下文更强，路由更灵活'}
            </p>
          </div>
        </div>
      </div>
    </DemoFrame>
  );
}
