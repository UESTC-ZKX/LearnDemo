import { contextEvents } from '../../data/demoContent';
import { DemoFrame } from './DemoFrame';

export function ContextCompressionDemo() {
  let total = 0;
  const rows = contextEvents.map((event) => {
    total = Math.max(0, total + event.tokens);
    return { ...event, total };
  });

  return (
    <DemoFrame title="上下文窗口 / 压缩" hint="当 token（词元）接近阈值时，用摘要替换低价值历史，保留任务状态。" testId="demo-context-compression">
      <div className="grid gap-2">
        {rows.map((row) => (
          <div key={row.label} className="rounded border border-line p-3">
            <div className="flex justify-between text-sm text-zinc-300">
              <span>{row.label}</span>
              <span>{row.total} tokens（词元）</span>
            </div>
            <div className="mt-2 h-2 rounded bg-zinc-800">
              <div className={`h-2 rounded ${row.total > 4200 ? 'bg-rose' : 'bg-signal'}`} style={{ width: `${Math.min(100, row.total / 50)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </DemoFrame>
  );
}
