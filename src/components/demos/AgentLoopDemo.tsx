import { useState } from 'react';
import { agentLoopSteps } from '../../data/demoContent';
import { DemoFrame } from './DemoFrame';

export function AgentLoopDemo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = agentLoopSteps[activeIndex];

  return (
    <DemoFrame title="智能体循环（Agent Loop）" hint="把思考、行动、观察讲成工程系统里的可观测状态。" testId="demo-agent-loop">
      <div className="grid grid-cols-2 gap-2">
        {agentLoopSteps.map((step, index) => (
          <button
            key={step.label}
            type="button"
            className={`demo-button ${index === activeIndex ? 'demo-button-active' : ''}`}
            onClick={() => setActiveIndex(index)}
          >
            {step.label}
          </button>
        ))}
      </div>
      <p className="mt-4 rounded border border-line bg-black/20 p-4 text-sm leading-6 text-zinc-300">{active.detail}</p>
    </DemoFrame>
  );
}
