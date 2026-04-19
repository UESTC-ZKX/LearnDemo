import { useState } from 'react';
import { timelineItems } from '../../data/demoContent';
import { DemoFrame } from './DemoFrame';

export function TimelineDemo() {
  const [activeId, setActiveId] = useState(timelineItems[0].id);
  const active = timelineItems.find((item) => item.id === activeId) ?? timelineItems[0];

  return (
    <DemoFrame title="模型发展时间线" hint="点击节点，把每个阶段讲成“解决什么、局限是什么、为什么出现下一步”。" testId="demo-timeline">
      <div className="grid gap-3">
        {timelineItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`demo-button ${item.id === activeId ? 'demo-button-active' : ''}`}
            onClick={() => setActiveId(item.id)}
          >
            <span>{item.year}</span>
            <strong>{item.label}</strong>
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-2 text-sm leading-6 text-zinc-300">
        <p><strong className="text-signal">解决：</strong>{active.solved}</p>
        <p><strong className="text-amber">局限：</strong>{active.limitation}</p>
        <p><strong className="text-rose">为什么出现：</strong>{active.next}</p>
      </div>
    </DemoFrame>
  );
}
