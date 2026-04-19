import { useState } from 'react';
import { toolFlowSteps } from '../../data/demoContent';
import { DemoFrame } from './DemoFrame';

export function ToolCallFlowDemo() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <DemoFrame title="工具调用（Tool Call）流程" hint="逐步切换流程，强调模型和工具各自的职责边界。" testId="demo-tool-call-flow">
      <div className="grid gap-2">
        {toolFlowSteps.map((step, index) => (
          <button
            key={`${step.label}-${index}`}
            type="button"
            className={`demo-button ${index === activeIndex ? 'demo-button-active' : ''}`}
            onClick={() => setActiveIndex(index)}
          >
            {index + 1}. {step.label}
          </button>
        ))}
      </div>
      <p className="mt-4 rounded border border-line bg-black/20 p-4 text-sm leading-6 text-zinc-300">{toolFlowSteps[activeIndex].detail}</p>
    </DemoFrame>
  );
}
