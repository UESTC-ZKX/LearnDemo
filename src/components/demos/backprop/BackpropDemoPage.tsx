import { useEffect, useEffectEvent, useMemo, useState } from 'react';
import { BackpropControlPanel, BackpropTeachingMode } from './BackpropControlPanel';
import { BackpropChainRuleCard, BackpropFunctionPanel } from './BackpropFunctionPanel';
import { BackpropMetricsPanel } from './BackpropMetricsPanel';
import { BackpropNetworkCanvas } from './BackpropNetworkCanvas';
import { BackpropTimelinePanel } from './BackpropTimelinePanel';
import {
  analyzeBackpropSample,
  BackpropNetworkPreset,
  createBackpropDataset,
  createBackpropFunctionCurve,
  createBackpropNetworkState,
  getAverageBackpropLoss,
  getBackpropFunctionInsight,
  getBackpropLossSeries,
  trainBackpropEpoch,
} from './backpropDemoModel';

const SAMPLE_STEP_LABELS = ['前向传播', '计算 loss', '输出层梯度', '隐藏层梯度', '参数更新'];

export function BackpropDemoPage() {
  const [preset, setPreset] = useState<BackpropNetworkPreset>('small');
  const [mode, setMode] = useState<BackpropTeachingMode>('sample');
  const [learningRate, setLearningRate] = useState(0.3);
  const [speed, setSpeed] = useState(260);
  const [autoRunning, setAutoRunning] = useState(false);
  const [networkState, setNetworkState] = useState(() => createBackpropNetworkState('small'));
  const [sampleCursor, setSampleCursor] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [epoch, setEpoch] = useState(0);
  const dataset = useMemo(() => createBackpropDataset(), []);
  const [logs, setLogs] = useState<string[]>(['等待开始：先看清楚网络结构，再一步步推动一次 backprop。']);
  const [history, setHistory] = useState<number[]>([getAverageBackpropLoss(dataset, createBackpropNetworkState('small'))]);
  const functionCurve = useMemo(() => createBackpropFunctionCurve(), []);
  const activeSample = dataset[sampleCursor];
  const analysis = useMemo(
    () => analyzeBackpropSample(activeSample, networkState, learningRate),
    [activeSample, learningRate, networkState],
  );
  const lossSeries = useMemo(
    () => getBackpropLossSeries(mode, activeSample, networkState, analysis, history, learningRate),
    [mode, activeSample, networkState, analysis, history, learningRate],
  );
  const functionInsight = useMemo(
    () => getBackpropFunctionInsight(activeSample, analysis, lossSeries),
    [activeSample, analysis, lossSeries],
  );

  const stepDemo = useEffectEvent(() => {
    if (mode === 'sample') {
      setStepIndex((currentStep) => {
        if (currentStep < SAMPLE_STEP_LABELS.length) {
          const nextStep = currentStep + 1;
          appendLog(buildSampleLog(nextStep, sampleCursor, analysis, dataset.length));

          if (nextStep === SAMPLE_STEP_LABELS.length) {
            setNetworkState(analysis.updatedState);
            setAutoRunning(false);
          }

          return nextStep;
        }

        const nextSampleCursor = (sampleCursor + 1) % dataset.length;
        if (nextSampleCursor === 0) {
          setEpoch((currentEpoch) => currentEpoch + 1);
        }
        setSampleCursor(nextSampleCursor);
        appendHistory(getAverageBackpropLoss(dataset, analysis.updatedState));
        return 1;
      });
      return;
    }

    setNetworkState((currentState) => {
      const nextState = trainBackpropEpoch(dataset, currentState, learningRate);
      const nextLoss = getAverageBackpropLoss(dataset, nextState);
      setEpoch((currentEpoch) => currentEpoch + 1);
      appendHistory(nextLoss);
      appendLog(`第 ${epoch + 1} 轮训练完成：loss = ${nextLoss.toFixed(4)}，当前网络 ${preset === 'small' ? '2 -> 2 -> 1' : '2 -> 3 -> 1'}。`);
      return nextState;
    });
  });

  useEffect(() => {
    if (!autoRunning) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      stepDemo();
    }, speed);

    return () => {
      window.clearInterval(timer);
    };
  }, [autoRunning, speed, stepDemo]);

  function resetDemo(nextPreset: BackpropNetworkPreset = preset, nextMode: BackpropTeachingMode = mode) {
    const nextState = createBackpropNetworkState(nextPreset);
    setAutoRunning(false);
    setNetworkState(nextState);
    setSampleCursor(0);
    setStepIndex(0);
    setEpoch(0);
    setLogs([
      nextMode === 'sample'
        ? '等待开始：点击“单步执行”后，会按前向传播、loss、反向传播、参数更新的顺序展开。'
        : '等待开始：点击“单步执行”后，会跑完整个 epoch，并记录 loss 的下降趋势。',
    ]);
    setHistory([getAverageBackpropLoss(dataset, nextState)]);
  }

  function appendLog(line: string) {
    setLogs((currentLogs) => [line, ...currentLogs].slice(0, 8));
  }

  function appendHistory(value: number) {
    setHistory((currentHistory) => {
      const nextHistory = [...currentHistory, Number(value.toFixed(4))];
      return nextHistory.slice(-20);
    });
  }

  function handlePresetChange(nextPreset: BackpropNetworkPreset) {
    if (nextPreset === preset) {
      return;
    }
    setPreset(nextPreset);
    resetDemo(nextPreset, mode);
  }

  function handleModeChange(nextMode: BackpropTeachingMode) {
    if (nextMode === mode) {
      return;
    }
    setMode(nextMode);
    resetDemo(preset, nextMode);
  }

  const currentStepLine =
    mode === 'sample'
      ? stepIndex === 0
        ? '还没有开始拆解训练过程。先看一遍网络结构，再点击“单步执行”。'
        : `第 ${stepIndex} 步：${SAMPLE_STEP_LABELS[stepIndex - 1]}。`
      : `第 ${epoch} 轮：观察完整训练一轮之后，loss 是否真的在下降。`;
  const activeSampleLine = `${activeSample.id} | 输入 (${activeSample.inputs[0]}, ${activeSample.inputs[1]}) | 目标 ${activeSample.target}`;
  const lossLabel = `loss = ${analysis.loss.toFixed(4)} | output = ${analysis.output.toFixed(4)} | target = ${analysis.sample.target}`;
  const metricLines = [
    `输出层梯度 = ${analysis.outputGradient.toFixed(4)}`,
    `隐藏层梯度 = ${analysis.hiddenGradients.map((value) => value.toFixed(4)).join(' / ')}`,
    `更新后输出权重 = ${analysis.updatedState.outputWeights.map((value) => value.toFixed(2)).join(' , ')}`,
    `当前 epoch = ${epoch}`,
  ];
  const currentLabel = mode === 'sample' ? `当前样本：${activeSample.id}` : `已完成 ${epoch} 轮`;

  return (
    <main className="min-h-screen bg-[#050608] text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col px-6 py-6 lg:px-10">
        <header className="rounded-[2rem] border border-line bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_34%),rgba(255,255,255,0.03)] p-6 shadow-projection">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber">standalone demo</p>
          <h1 className="mt-3 text-4xl font-semibold text-white lg:text-5xl">反向传播教学演示</h1>
          <p className="mt-4 max-w-4xl text-base leading-8 text-zinc-300 lg:text-lg">
            这页会把一次完整的前向、损失、误差回传和参数更新过程拆开给观众看，先讲懂链式法则，再看训练如何真正让 loss 下降。
          </p>
        </header>

        <section className="mt-6 grid gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">先看网络内部</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">把一次反向传播拆成可讲解的 3 块</h2>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-zinc-300">
              第一眼只需要关注控制区、网络图和当前步骤。这样在讲课和投屏时，观众不会同时被函数图、损失图和链式法则图片分散注意力。
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr] xl:items-start">
            <div className="grid gap-6">
              <BackpropControlPanel
                autoRunning={autoRunning}
                learningRate={learningRate}
                mode={mode}
                preset={preset}
                speed={speed}
                onLearningRateChange={setLearningRate}
                onModeChange={handleModeChange}
                onPause={() => setAutoRunning(false)}
                onPresetChange={handlePresetChange}
                onReset={() => resetDemo()}
                onSpeedChange={setSpeed}
                onStartAuto={() => setAutoRunning(true)}
                onStep={stepDemo}
              />
              <BackpropNetworkCanvas analysis={analysis} mode={mode} preset={preset} stageIndex={stepIndex} state={networkState} />
            </div>

            <div className="grid gap-6">
              <BackpropMetricsPanel
                activeSampleLine={activeSampleLine}
                currentStepLine={currentStepLine}
                logs={logs}
                lossLabel={lossLabel}
                metricLines={metricLines}
              />
              <BackpropTimelinePanel
                activeStepIndex={Math.max(0, stepIndex - 1)}
                currentLabel={currentLabel}
                history={history}
                mode={mode}
                stepLabels={SAMPLE_STEP_LABELS}
              />
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">再看外部目标</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">最后再解释“为什么 loss 会往下走”</h2>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-zinc-300">
              当网络内部步骤已经看懂，再补目标函数和损失轨迹，观众会更容易把“参数更新”和“优化目标下降”对应起来。
            </p>
          </div>

          <BackpropFunctionPanel history={lossSeries} insight={functionInsight} mode={mode} points={functionCurve} />
        </section>

        <section className="mt-8">
          <BackpropChainRuleCard imageSrc="/backprop-chain-rule.png" />
        </section>
      </div>
    </main>
  );
}

function buildSampleLog(
  stepIndex: number,
  sampleCursor: number,
  analysis: ReturnType<typeof analyzeBackpropSample>,
  datasetSize: number,
) {
  if (stepIndex === 1) {
    return `第 1 步：${analysis.sample.id} 完成前向传播，output = ${analysis.output.toFixed(4)}。`;
  }

  if (stepIndex === 2) {
    return `第 2 步：${analysis.sample.id} 计算 loss = ${analysis.loss.toFixed(4)}。`;
  }

  if (stepIndex === 3) {
    return `第 3 步：${analysis.sample.id} 输出层梯度 = ${analysis.outputGradient.toFixed(4)}。`;
  }

  if (stepIndex === 4) {
    return `第 4 步：${analysis.sample.id} 隐藏层梯度 = ${analysis.hiddenGradients.map((value) => value.toFixed(4)).join(' / ')}。`;
  }

  return `第 5 步：${analysis.sample.id} 参数更新完成，下一样本索引 = ${(sampleCursor + 1) % datasetSize}。`;
}
