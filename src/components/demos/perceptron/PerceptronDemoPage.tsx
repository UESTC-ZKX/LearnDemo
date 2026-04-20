import { useEffect, useEffectEvent, useMemo, useState } from 'react';
import { PerceptronControlPanel } from './PerceptronControlPanel';
import { PerceptronMetricsPanel } from './PerceptronMetricsPanel';
import { PerceptronPlaneCanvas } from './PerceptronPlaneCanvas';
import {
  createPerceptronState,
  createTwoLayerNetworkState,
  getDefaultLinearSamples,
  getDefaultXorSamples,
  getPerceptronErrorCount,
  getTwoLayerAccuracy,
  PerceptronState,
  PlaneSample,
  predictTwoLayer,
  trainPerceptronSample,
  trainPerceptronEpoch,
  trainTwoLayerSample,
  trainTwoLayerEpoch,
  TwoLayerNetworkState,
} from './perceptronDemoModel';

type DemoSceneId = 'linear' | 'xor-single' | 'xor-double';

interface PerceptronSceneSnapshot {
  activeSampleId?: string;
  epoch: number;
  history: number[];
  logs: string[];
  sampleCursor: number;
  samples: PlaneSample[];
  state: PerceptronState;
}

interface TwoLayerSceneSnapshot {
  activeSampleId?: string;
  epoch: number;
  history: number[];
  logs: string[];
  sampleCursor: number;
  samples: PlaneSample[];
  state: TwoLayerNetworkState;
}

const MAX_HISTORY = 24;

export function PerceptronDemoPage() {
  const [sceneId, setSceneId] = useState<DemoSceneId>('linear');
  const [learningRate, setLearningRate] = useState(0.3);
  const [speed, setSpeed] = useState(240);
  const [autoRunning, setAutoRunning] = useState(false);
  const [linearScene, setLinearScene] = useState<PerceptronSceneSnapshot>(() => createPerceptronSceneSnapshot(getDefaultLinearSamples()));
  const [xorSingleScene, setXorSingleScene] = useState<PerceptronSceneSnapshot>(() => createPerceptronSceneSnapshot(getDefaultXorSamples()));
  const [xorDoubleScene, setXorDoubleScene] = useState<TwoLayerSceneSnapshot>(() => createTwoLayerSceneSnapshot());

  const activeScene = useMemo(() => {
    if (sceneId === 'linear') {
      const errorCount = getPerceptronErrorCount(linearScene.samples, linearScene.state);
      return {
        accuracy: 1 - errorCount / linearScene.samples.length,
        activeExplanation: '一旦数据线性可分，单层感知机就能通过错分样本更新，把边界一点点推到正确位置。',
        epoch: linearScene.epoch,
        errorCount,
        history: linearScene.history,
        parameterLines: [
          `w = [${linearScene.state.weights[0].toFixed(2)}, ${linearScene.state.weights[1].toFixed(2)}]`,
          `b = ${linearScene.state.bias.toFixed(2)}`,
          '目标：把两簇点用一条直线干净分开',
        ],
        activeSampleId: linearScene.activeSampleId,
        activeSampleLine: buildActiveSampleLine(linearScene.samples, linearScene.activeSampleId),
        samples: linearScene.samples,
        sceneSummary: '这个场景用最少的点讲清“感知机就是学一条线”。每次训练，如果有点站错了边，就沿着正确方向推一把边界。',
        trainingLogs: linearScene.logs,
      };
    }

    if (sceneId === 'xor-single') {
      const errorCount = getPerceptronErrorCount(xorSingleScene.samples, xorSingleScene.state);
      return {
        accuracy: 1 - errorCount / xorSingleScene.samples.length,
        activeExplanation: '这里失败的根因不是训练次数不够，而是单层感知机的表达能力只允许一条线，无法同时把 XOR 的四个点分开。',
        epoch: xorSingleScene.epoch,
        errorCount,
        history: xorSingleScene.history,
        parameterLines: [
          `w = [${xorSingleScene.state.weights[0].toFixed(2)}, ${xorSingleScene.state.weights[1].toFixed(2)}]`,
          `b = ${xorSingleScene.state.bias.toFixed(2)}`,
          '结论：单层线性边界无法解决 XOR',
        ],
        activeSampleId: xorSingleScene.activeSampleId,
        activeSampleLine: buildActiveSampleLine(xorSingleScene.samples, xorSingleScene.activeSampleId),
        samples: xorSingleScene.samples,
        sceneSummary: 'XOR 的四个点分布在对角线上。你无论怎么移动一条直线，总会至少分错两个象限中的一部分点。',
        trainingLogs: xorSingleScene.logs,
      };
    }

    const accuracy = getTwoLayerAccuracy(xorDoubleScene.samples, xorDoubleScene.state);
    const errorCount = xorDoubleScene.samples.length - Math.round(accuracy * xorDoubleScene.samples.length);
    return {
      accuracy,
      activeExplanation: '两层网络先在隐藏层学出中间分割，再把这些中间特征组合成最终分类区域，所以 XOR 终于能被分开。',
      epoch: xorDoubleScene.epoch,
      errorCount,
      history: xorDoubleScene.history,
      parameterLines: [
        `隐藏层数 = ${xorDoubleScene.state.hiddenBiases.length}`,
        `输出偏置 = ${xorDoubleScene.state.outputBias.toFixed(2)}`,
        `样本 1 输出 = ${predictTwoLayer(xorDoubleScene.samples[0], xorDoubleScene.state).toFixed(2)}`,
      ],
      activeSampleId: xorDoubleScene.activeSampleId,
      activeSampleLine: buildActiveSampleLine(xorDoubleScene.samples, xorDoubleScene.activeSampleId),
      samples: xorDoubleScene.samples,
      sceneSummary: '这个场景把“为什么多层有效”画出来。隐藏层先切出几条辅助边界，输出层再把这些切分结果重组成 XOR 的目标区域。',
      trainingLogs: xorDoubleScene.logs,
    };
  }, [linearScene, sceneId, xorDoubleScene, xorSingleScene]);

  const stepActiveScene = useEffectEvent(() => {
    if (sceneId === 'linear') {
      setLinearScene((current) => {
        const sample = current.samples[current.sampleCursor];
        const result = trainPerceptronSample(sample, current.state, learningRate);
        const nextErrorCount = getPerceptronErrorCount(current.samples, result.nextState);
        return {
          ...current,
          epoch: current.epoch + 1,
          activeSampleId: sample.id,
          history: appendHistory(current.history, 1 - nextErrorCount / current.samples.length),
          logs: appendLogs(
            current.logs,
            `第 ${current.epoch + 1} 步 | ${sample.id} -> 预测 ${formatBinaryLabel(result.prediction)}，目标 ${formatBinaryLabel(sample.label)}，${result.updated ? '发生更新' : '无需更新'}`,
          ),
          sampleCursor: (current.sampleCursor + 1) % current.samples.length,
          state: result.nextState,
        };
      });
      return;
    }

    if (sceneId === 'xor-single') {
      setXorSingleScene((current) => {
        const sample = current.samples[current.sampleCursor];
        const result = trainPerceptronSample(sample, current.state, learningRate);
        const nextErrorCount = getPerceptronErrorCount(current.samples, result.nextState);
        return {
          ...current,
          epoch: current.epoch + 1,
          activeSampleId: sample.id,
          history: appendHistory(current.history, 1 - nextErrorCount / current.samples.length),
          logs: appendLogs(
            current.logs,
            `第 ${current.epoch + 1} 步 | ${sample.id} -> 预测 ${formatBinaryLabel(result.prediction)}，目标 ${formatBinaryLabel(sample.label)}，${result.updated ? '边界仍在硬推' : '这一步碰巧分类正确'}`,
          ),
          sampleCursor: (current.sampleCursor + 1) % current.samples.length,
          state: result.nextState,
        };
      });
      return;
    }

    setXorDoubleScene((current) => {
      const sample = current.samples[current.sampleCursor];
      const result = trainTwoLayerSample(sample, current.state, learningRate);
      return {
        ...current,
        epoch: current.epoch + 1,
        activeSampleId: sample.id,
        history: appendHistory(current.history, getTwoLayerAccuracy(current.samples, result.nextState)),
        logs: appendLogs(
          current.logs,
          `第 ${current.epoch + 1} 步 | ${sample.id} -> 输出 ${result.output.toFixed(2)}，预测 ${formatBinaryLabel(result.prediction)}，目标 ${formatBinaryLabel(sample.label)}`,
        ),
        sampleCursor: (current.sampleCursor + 1) % current.samples.length,
        state: result.nextState,
      };
    });
  });

  useEffect(() => {
    if (!autoRunning) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      stepActiveScene();
    }, speed);

    return () => {
      window.clearInterval(timer);
    };
  }, [autoRunning, speed, stepActiveScene]);

  function resetCurrentScene() {
    setAutoRunning(false);

    if (sceneId === 'linear') {
      setLinearScene(createPerceptronSceneSnapshot(getDefaultLinearSamples()));
      return;
    }

    if (sceneId === 'xor-single') {
      setXorSingleScene(createPerceptronSceneSnapshot(getDefaultXorSamples()));
      return;
    }

    setXorDoubleScene(createTwoLayerSceneSnapshot());
  }

  function switchScene(nextSceneId: DemoSceneId) {
    setAutoRunning(false);
    setSceneId(nextSceneId);
  }

  return (
    <main className="min-h-screen bg-[#050608] text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col px-6 py-6 lg:px-10">
        <header className="rounded-[2rem] border border-line bg-[radial-gradient(circle_at_top_left,rgba(61,214,198,0.18),transparent_34%),rgba(255,255,255,0.03)] p-6 shadow-projection">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-signal">standalone demo</p>
              <h1 className="mt-3 text-4xl font-semibold text-white lg:text-5xl">感知机平面分类与 XOR 演示</h1>
              <p className="mt-4 max-w-4xl text-base leading-8 text-zinc-300 lg:text-lg">
                这不是把公式堆在页面上，而是把“单层只能学一条线”“为什么 XOR 会失败”“为什么多层会成功”直接画给观众看。
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { id: 'linear' as const, label: '线性可分' },
                { id: 'xor-single' as const, label: 'XOR 单层感知机' },
                { id: 'xor-double' as const, label: 'XOR 两层网络' },
              ].map((scene) => (
                <button
                  key={scene.id}
                  type="button"
                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                    sceneId === scene.id
                      ? 'border-signal/70 bg-signal/10 text-white'
                      : 'border-line bg-white/[0.03] text-zinc-300 hover:border-signal/40 hover:text-white'
                  }`}
                  onClick={() => switchScene(scene.id)}
                >
                  {scene.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="mt-6 grid flex-1 gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="grid gap-6">
            <PerceptronControlPanel
              autoRunning={autoRunning}
              learningRate={learningRate}
              speed={speed}
              onLearningRateChange={setLearningRate}
              onPause={() => setAutoRunning(false)}
              onReset={resetCurrentScene}
              onSpeedChange={setSpeed}
              onStartAuto={() => setAutoRunning(true)}
              onStep={stepActiveScene}
            />
            <PerceptronPlaneCanvas
              activeSampleId={activeScene.activeSampleId}
              perceptronState={sceneId === 'xor-double' ? undefined : sceneId === 'linear' ? linearScene.state : xorSingleScene.state}
              samples={activeScene.samples}
              sceneId={sceneId}
              twoLayerState={sceneId === 'xor-double' ? xorDoubleScene.state : undefined}
            />
          </div>

          <PerceptronMetricsPanel
            accuracy={activeScene.accuracy}
            activeExplanation={activeScene.activeExplanation}
            activeSampleLine={activeScene.activeSampleLine}
            epoch={activeScene.epoch}
            errorCount={activeScene.errorCount}
            history={activeScene.history}
            parameterLines={activeScene.parameterLines}
            sceneSummary={activeScene.sceneSummary}
            trainingLogs={activeScene.trainingLogs}
          />
        </div>
      </div>
    </main>
  );
}

function createPerceptronSceneSnapshot(samples: PlaneSample[]): PerceptronSceneSnapshot {
  return {
    activeSampleId: undefined,
    epoch: 0,
    history: [0],
    logs: [],
    sampleCursor: 0,
    samples,
    state: createPerceptronState(),
  };
}

function createTwoLayerSceneSnapshot(): TwoLayerSceneSnapshot {
  const samples = getDefaultXorSamples();
  const state = createTwoLayerNetworkState(3, 7);

  return {
    activeSampleId: undefined,
    epoch: 0,
    history: [getTwoLayerAccuracy(samples, state)],
    logs: [],
    sampleCursor: 0,
    samples,
    state,
  };
}

function appendHistory(history: number[], value: number): number[] {
  const nextHistory = [...history, Number(value.toFixed(4))];
  if (nextHistory.length > MAX_HISTORY) {
    nextHistory.shift();
  }
  return nextHistory;
}

function appendLogs(logs: string[], line: string): string[] {
  const nextLogs = [line, ...logs];
  return nextLogs.slice(0, 8);
}

function buildActiveSampleLine(samples: PlaneSample[], activeSampleId?: string): string | undefined {
  if (!activeSampleId) {
    return undefined;
  }

  const activeSample = samples.find((sample) => sample.id === activeSampleId);
  if (!activeSample) {
    return undefined;
  }

  return `${activeSample.id} | 坐标 (${activeSample.x}, ${activeSample.y}) | 目标 ${formatBinaryLabel(activeSample.label)}`;
}

function formatBinaryLabel(label: 1 | -1): string {
  return label === 1 ? '+1' : '-1';
}
