import { useState } from 'react';
import { DemoFrame } from './DemoFrame';

const options = [
  { key: 'complexity', low: '低复杂度', high: '高复杂度' },
  { key: 'control', low: '强控制', high: '开放探索' },
  { key: 'tools', low: '工具很少', high: '工具很多' },
] as const;

export function DecisionMatrixDemo() {
  const [scores, setScores] = useState<Record<string, number>>({ complexity: 0, control: 0, tools: 0 });
  const total = Object.values(scores).reduce((sum, value) => sum + value, 0);
  const recommendation =
    total <= 0
      ? '不需要智能体（Agent）'
      : total === 1
        ? '工作流（Workflow）'
        : total === 2
          ? '工具增强大语言模型（Tool-enhanced LLM）'
          : '自主智能体（Autonomous Agent）';

  return (
    <DemoFrame title="智能体（Agent）框架选型决策图" hint="先判断复杂度和控制需求，再决定是否引入智能体。" testId="demo-decision-matrix">
      <div className="grid gap-3">
        {options.map((option) => (
          <div key={option.key} className="grid grid-cols-2 gap-2">
            <button type="button" className="demo-button" onClick={() => setScores({ ...scores, [option.key]: 0 })}>
              {option.low}
            </button>
            <button type="button" className="demo-button" onClick={() => setScores({ ...scores, [option.key]: 1 })}>
              {option.high}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded border border-amber/50 bg-amber/10 p-4 text-lg font-semibold text-amber">{recommendation}</div>
    </DemoFrame>
  );
}
