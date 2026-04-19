import type { ReactNode } from 'react';

interface DemoFrameProps {
  title: string;
  hint: string;
  testId: string;
  children: ReactNode;
}

export function DemoFrame({ title, hint, testId, children }: DemoFrameProps) {
  return (
    <div className="demo-frame" data-testid={testId}>
      <div className="flex items-start justify-between gap-4 border-b border-line/80 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-signal">互动演示</p>
          <h4 className="mt-1 text-lg font-semibold text-white">{title}</h4>
        </div>
        <span className="rounded border border-signal/40 bg-signal/10 px-2 py-1 text-xs text-signal">实时</span>
      </div>
      <div className="mt-5">{children}</div>
      <p className="mt-5 rounded border border-line bg-black/20 p-3 text-sm leading-6 text-zinc-300">
        <span className="font-semibold text-zinc-100">讲解提示：</span>
        {hint}
      </p>
    </div>
  );
}
