import { BackpropFunctionInsight, BackpropFunctionPoint } from './backpropDemoModel';

interface BackpropFunctionPanelProps {
  history: number[];
  insight: BackpropFunctionInsight;
  mode: 'sample' | 'epoch';
  points: BackpropFunctionPoint[];
}

interface BackpropChainRuleCardProps {
  imageSrc: string;
}

export function BackpropFunctionPanel(props: BackpropFunctionPanelProps) {
  const { history, insight, mode, points } = props;
  const functionPath = buildFunctionPath(points);
  const targetPoint = toChartPoint(insight.inputX, insight.targetY);
  const predictionPoint = toChartPoint(insight.inputX, insight.predictionY);
  const lossPoints = buildLossPoints(history);
  const lossBadge =
    mode === 'sample'
      ? insight.isImproving
        ? '这一步会让当前样本的 loss 继续下降。'
        : '这一步暂时没有把当前样本的 loss 压低，正适合解释为什么还要继续训练。'
      : insight.isImproving
        ? '这一轮训练正在把整体平均 loss 往下拉。'
        : '这一轮的整体平均 loss 还不够稳定，适合继续观察趋势。';

  return (
    <section className="grid gap-6 xl:grid-cols-[1.06fr_0.94fr]">
      <section className="rounded-[2rem] border border-line bg-black/20 p-6 shadow-projection">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">目标函数视图</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">看模型要逼近什么</h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-zinc-300">
              先固定一个输入点，再把目标值和模型预测放到同一张图里，观众会更容易理解误差到底从哪里来。
            </p>
          </div>
          <div className="rounded-full border border-line bg-zinc-950/80 px-3 py-2 text-xs text-zinc-300">
            {mode === 'sample' ? '单点讲解' : '整体趋势'}
          </div>
        </div>

        <svg className="mt-5 w-full" viewBox="0 0 420 220" aria-label="目标函数视图">
          <rect x="0" y="0" width="420" height="220" rx="24" fill="rgba(255,255,255,0.02)" />
          <path d="M50 180 H370" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
          <path d="M50 180 V30" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
          <path d={functionPath} fill="none" stroke="#3dd6c6" strokeWidth="4" strokeLinecap="round" />
          <line
            x1={targetPoint.x}
            y1="180"
            x2={targetPoint.x}
            y2={targetPoint.y}
            stroke="rgba(255,255,255,0.2)"
            strokeDasharray="6 6"
          />
          <circle cx={targetPoint.x} cy={targetPoint.y} r="7" fill="#f59e0b" />
          <circle cx={predictionPoint.x} cy={predictionPoint.y} r="7" fill="#60a5fa" />
          <line
            x1={targetPoint.x}
            y1={targetPoint.y}
            x2={predictionPoint.x}
            y2={predictionPoint.y}
            stroke="rgba(245,158,11,0.8)"
            strokeDasharray="5 5"
            strokeWidth="2"
          />
          <text x="54" y="26" fill="rgba(255,255,255,0.6)" fontSize="12">
            y
          </text>
          <text x="376" y="194" fill="rgba(255,255,255,0.6)" fontSize="12">
            x
          </text>
          <text x="66" y="52" fill="#3dd6c6" fontSize="12">
            目标函数
          </text>
          <text x="290" y="54" fill="#f59e0b" fontSize="12">
            目标点
          </text>
          <text x="290" y="72" fill="#60a5fa" fontSize="12">
            预测点
          </text>
        </svg>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-line bg-zinc-950/70 px-4 py-3 text-sm text-zinc-300">
            当前输入 x = {insight.inputX.toFixed(1)}
          </div>
          <div className="rounded-2xl border border-line bg-zinc-950/70 px-4 py-3 text-sm text-zinc-300">
            目标值 = {insight.targetY.toFixed(2)}
          </div>
          <div className="rounded-2xl border border-line bg-zinc-950/70 px-4 py-3 text-sm text-zinc-300">
            预测值 = {insight.predictionY.toFixed(4)}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-line bg-black/20 p-6 shadow-projection">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">损失下降轨迹</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">看梯度下降在推动什么</h2>
          <p className="mt-2 max-w-xl text-sm leading-7 text-zinc-300">
            不把所有公式同时丢给观众，而是直接给出“loss 有没有往下走”的证据，让训练是否有效一眼可见。
          </p>
        </div>

        <svg className="mt-5 w-full" viewBox="0 0 420 200" aria-label="损失下降轨迹">
          <rect x="0" y="0" width="420" height="200" rx="24" fill="rgba(255,255,255,0.02)" />
          <path d="M46 160 H376" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
          <path d="M46 160 V28" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
          <polyline
            points={lossPoints}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {renderLossHighlight(history)}
          <text x="54" y="26" fill="rgba(255,255,255,0.6)" fontSize="12">
            loss
          </text>
          <text x="332" y="178" fill="rgba(255,255,255,0.6)" fontSize="12">
            训练步数
          </text>
        </svg>

        <div className="mt-4 rounded-2xl border border-amber/30 bg-amber/10 px-4 py-3 text-sm leading-7 text-amber-50">
          {lossBadge}
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-zinc-950/70 px-4 py-3 text-sm text-zinc-300">
            当前损失 {insight.currentLoss.toFixed(4)}
          </div>
          <div className="rounded-2xl border border-line bg-zinc-950/70 px-4 py-3 text-sm text-zinc-300">
            变化量 Δloss {insight.lossDelta.toFixed(4)}
          </div>
        </div>
      </section>
    </section>
  );
}

export function BackpropChainRuleCard(props: BackpropChainRuleCardProps) {
  const { imageSrc } = props;

  return (
    <section className="rounded-[2rem] border border-line bg-black/20 p-6 shadow-projection">
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr] xl:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">链式法则直觉</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">最后再补一句：梯度为什么要层层相乘</h2>
          <p className="mt-4 text-base leading-8 text-zinc-300">
            这块放在下方作为辅助讲解区，不和主图抢注意力。讲到反向传播时，再把它当作“为什么要一层一层传回去”的直觉补充。
          </p>
          <div className="mt-5 rounded-[1.5rem] border border-amber/30 bg-amber/10 px-4 py-4 text-sm leading-7 text-amber-50">
            输出层先感受到 loss 的变化，再把这份影响传给隐藏层。每一层只负责告诉前一层：我这里变一点，会把最终误差放大或缩小多少。
          </div>
        </div>

        <img
          src={imageSrc}
          alt="链式法则示意图"
          className="w-full rounded-[1.5rem] border border-line bg-white/95 object-cover shadow-projection"
        />
      </div>
    </section>
  );
}

function buildFunctionPath(points: BackpropFunctionPoint[]) {
  return points
    .map((point, index) => {
      const chartPoint = toChartPoint(point.x, point.target);
      return `${index === 0 ? 'M' : 'L'} ${chartPoint.x} ${chartPoint.y}`;
    })
    .join(' ');
}

function buildLossPoints(history: number[]) {
  const maxLoss = Math.max(...history, 0.05);
  const minLoss = Math.min(...history, 0);

  return history
    .map((value, index) => {
      const x = history.length === 1 ? 210 : 60 + (index / (history.length - 1)) * 300;
      const ratio = maxLoss === minLoss ? 0.5 : (value - minLoss) / (maxLoss - minLoss);
      const y = 150 - ratio * 95;
      return `${x},${y}`;
    })
    .join(' ');
}

function renderLossHighlight(history: number[]) {
  if (history.length === 0) {
    return null;
  }

  const maxLoss = Math.max(...history, 0.05);
  const minLoss = Math.min(...history, 0);
  const lastIndex = history.length - 1;
  const lastValue = history[lastIndex];
  const previousValue = history[lastIndex - 1] ?? lastValue;
  const lastX = history.length === 1 ? 210 : 60 + (lastIndex / (history.length - 1)) * 300;
  const previousX = history.length <= 1 ? lastX : 60 + ((lastIndex - 1) / (history.length - 1)) * 300;
  const lastY = 150 - (maxLoss === minLoss ? 0.5 : (lastValue - minLoss) / (maxLoss - minLoss)) * 95;
  const previousY = 150 - (maxLoss === minLoss ? 0.5 : (previousValue - minLoss) / (maxLoss - minLoss)) * 95;

  return (
    <>
      <line x1={previousX} y1={previousY} x2={lastX} y2={lastY} stroke="#3dd6c6" strokeWidth="3" />
      <circle cx={lastX} cy={lastY} r="6" fill="#3dd6c6" />
    </>
  );
}

function toChartPoint(x: number, y: number) {
  return {
    x: 50 + x * 320,
    y: 180 - y * 150,
  };
}
