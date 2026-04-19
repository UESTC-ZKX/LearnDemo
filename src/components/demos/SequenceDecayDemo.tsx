import { sequenceTokens } from '../../data/demoContent';
import { DemoFrame } from './DemoFrame';

export function SequenceDecayDemo() {
  return (
    <DemoFrame title="RNN 长依赖衰减" hint="颜色越淡代表越远的信息越难保持，用它解释长距离依赖问题。" testId="demo-sequence-decay">
      <div className="grid grid-cols-4 gap-2">
        {sequenceTokens.map((token, index) => (
          <div
            key={token}
            className="rounded border border-line px-3 py-3 text-center text-sm text-white"
            style={{ backgroundColor: `rgba(61, 214, 198, ${Math.max(0.18, 1 - index * 0.11)})` }}
          >
            {token}
          </div>
        ))}
      </div>
      <div className="mt-4 h-2 rounded bg-gradient-to-r from-signal via-amber to-rose opacity-80" />
    </DemoFrame>
  );
}
