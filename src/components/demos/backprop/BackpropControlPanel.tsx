import { BackpropNetworkPreset } from './backpropDemoModel';

export type BackpropTeachingMode = 'sample' | 'epoch';

interface BackpropControlPanelProps {
  autoRunning: boolean;
  learningRate: number;
  mode: BackpropTeachingMode;
  preset: BackpropNetworkPreset;
  speed: number;
  onLearningRateChange: (value: number) => void;
  onModeChange: (value: BackpropTeachingMode) => void;
  onPause: () => void;
  onPresetChange: (value: BackpropNetworkPreset) => void;
  onReset: () => void;
  onSpeedChange: (value: number) => void;
  onStartAuto: () => void;
  onStep: () => void;
}

export function BackpropControlPanel(props: BackpropControlPanelProps) {
  const {
    autoRunning,
    learningRate,
    mode,
    preset,
    speed,
    onLearningRateChange,
    onModeChange,
    onPause,
    onPresetChange,
    onReset,
    onSpeedChange,
    onStartAuto,
    onStep,
  } = props;

  return (
    <section className="rounded-[2rem] border border-line bg-black/20 p-6 shadow-projection">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <button
          type="button"
          className={`demo-button ${preset === 'small' ? 'demo-button-active' : ''}`}
          onClick={() => onPresetChange('small')}
        >
          极简网络
        </button>
        <button
          type="button"
          className={`demo-button ${preset === 'medium' ? 'demo-button-active' : ''}`}
          onClick={() => onPresetChange('medium')}
        >
          稍大网络
        </button>
        <button
          type="button"
          className={`demo-button ${mode === 'sample' ? 'demo-button-active' : ''}`}
          onClick={() => onModeChange('sample')}
        >
          单样本模式
        </button>
        <button
          type="button"
          className={`demo-button ${mode === 'epoch' ? 'demo-button-active' : ''}`}
          onClick={() => onModeChange('epoch')}
        >
          按轮模式
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" className="control-button" onClick={onStep}>
          单步执行
        </button>
        <button type="button" className="control-button" onClick={onStartAuto}>
          自动播放
        </button>
        <button type="button" className="demo-button" onClick={onPause}>
          暂停
        </button>
        <button type="button" className="demo-button" onClick={onReset}>
          重置
        </button>
        <span className="rounded-full border border-line px-3 py-2 text-xs uppercase tracking-[0.18em] text-zinc-400">
          {autoRunning ? 'auto running' : 'manual mode'}
        </span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <label className="rounded-2xl border border-line bg-zinc-950/60 p-4 text-sm text-zinc-300">
          <div className="flex items-center justify-between">
            <span>学习率</span>
            <span className="font-semibold text-white">{learningRate.toFixed(2)}</span>
          </div>
          <input
            aria-label="反向传播学习率"
            className="mt-3 w-full accent-[#f59e0b]"
            max="0.8"
            min="0.05"
            step="0.05"
            type="range"
            value={learningRate}
            onChange={(event) => onLearningRateChange(Number(event.target.value))}
          />
        </label>

        <label className="rounded-2xl border border-line bg-zinc-950/60 p-4 text-sm text-zinc-300">
          <div className="flex items-center justify-between">
            <span>播放速度</span>
            <span className="font-semibold text-white">{speed} ms</span>
          </div>
          <input
            aria-label="反向传播播放速度"
            className="mt-3 w-full accent-[#3dd6c6]"
            max="800"
            min="100"
            step="50"
            type="range"
            value={speed}
            onChange={(event) => onSpeedChange(Number(event.target.value))}
          />
        </label>
      </div>
    </section>
  );
}
