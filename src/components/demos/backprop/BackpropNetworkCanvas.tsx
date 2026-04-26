import { BackpropSampleAnalysis, BackpropNetworkState } from './backpropDemoModel';

interface BackpropNetworkCanvasProps {
  analysis: BackpropSampleAnalysis;
  mode: 'sample' | 'epoch';
  preset: 'small' | 'medium';
  stageIndex: number;
  state: BackpropNetworkState;
}

interface NodeLayout {
  id: string;
  value: number;
  x: number;
  y: number;
}

export function BackpropNetworkCanvas(props: BackpropNetworkCanvasProps) {
  const { analysis, mode, preset, stageIndex, state } = props;
  const inputNodes: NodeLayout[] = [
    { id: 'x1', x: 88, y: 110, value: analysis.sample.inputs[0] },
    { id: 'x2', x: 88, y: 228, value: analysis.sample.inputs[1] },
  ];
  const hiddenLayouts =
    preset === 'small'
      ? [
          { id: 'h1', x: 284, y: 104 },
          { id: 'h2', x: 284, y: 234 },
        ]
      : [
          { id: 'h1', x: 248, y: 76 },
          { id: 'h2', x: 284, y: 168 },
          { id: 'h3', x: 248, y: 258 },
        ];
  const hiddenNodes = analysis.hiddenActivations.map((value, index) => ({
    ...hiddenLayouts[index],
    id: hiddenLayouts[index]?.id ?? `h${index + 1}`,
    x: hiddenLayouts[index]?.x ?? 248 + index * 26,
    y: hiddenLayouts[index]?.y ?? 80 + index * 82,
    value,
  }));
  const outputNode = { id: 'y', x: 464, y: 168, value: analysis.output };
  const forwardActive = mode === 'epoch' || stageIndex <= 2;
  const outputBackpropActive = mode === 'epoch' || stageIndex === 3;
  const hiddenBackpropActive = mode === 'epoch' || stageIndex >= 4;
  const updateActive = mode === 'epoch' || stageIndex === 5;

  return (
    <section className="rounded-[2rem] border border-line bg-zinc-950/70 p-5 shadow-projection">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">网络画布</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">看见误差如何往回走</h2>
        </div>
        <div className="rounded-full border border-line bg-black/30 px-3 py-2 text-xs text-zinc-400">
          {preset === 'small' ? '2 -> 2 -> 1' : '2 -> 3 -> 1'}
        </div>
      </div>

      <svg className="mt-5 w-full" viewBox="0 0 560 340" aria-label="反向传播网络画布">
        <rect width="560" height="340" rx="26" fill="rgba(255,255,255,0.02)" />

        {inputNodes.flatMap((inputNode, inputIndex) =>
          hiddenNodes.map((hiddenNode, hiddenIndex) => (
            <g key={`${inputNode.id}-${hiddenNode.id}`}>
              <line
                x1={inputNode.x + 24}
                y1={inputNode.y}
                x2={hiddenNode.x - 24}
                y2={hiddenNode.y}
                stroke={forwardActive ? 'rgba(61,214,198,0.85)' : 'rgba(255,255,255,0.16)'}
                strokeWidth={forwardActive ? 3 : 1.5}
              />
              {renderWeightBadge(
                inputNode.x + 24,
                inputNode.y,
                hiddenNode.x - 24,
                hiddenNode.y,
                state.hiddenWeights[hiddenIndex][inputIndex].toFixed(2),
                inputNode.y < hiddenNode.y ? 18 : -18,
              )}
            </g>
          )),
        )}

        {hiddenNodes.map((hiddenNode, hiddenIndex) => (
          <g key={`${hiddenNode.id}-${outputNode.id}`}>
            <line
              x1={hiddenNode.x + 24}
              y1={hiddenNode.y}
              x2={outputNode.x - 24}
              y2={outputNode.y}
              stroke={
                outputBackpropActive
                  ? 'rgba(245,158,11,0.92)'
                  : forwardActive
                    ? 'rgba(61,214,198,0.85)'
                    : 'rgba(255,255,255,0.16)'
              }
              strokeWidth={outputBackpropActive || forwardActive ? 3 : 1.5}
              strokeDasharray={outputBackpropActive ? '10 6' : undefined}
            />
            {renderWeightBadge(
              hiddenNode.x + 24,
              hiddenNode.y,
              outputNode.x - 24,
              outputNode.y,
              state.outputWeights[hiddenIndex].toFixed(2),
              hiddenNode.y < outputNode.y ? 18 : -18,
            )}
          </g>
        ))}

        {inputNodes.map((node) => renderNode(node.x, node.y, node.id, node.value, updateActive))}
        {hiddenNodes.map((node, index) =>
          renderNode(
            node.x,
            node.y,
            node.id,
            node.value,
            updateActive,
            hiddenBackpropActive ? analysis.hiddenGradients[index] : undefined,
          ),
        )}
        {renderNode(outputNode.x, outputNode.y, outputNode.id, outputNode.value, updateActive, outputBackpropActive ? analysis.outputGradient : undefined)}

        <text x="42" y="38" fill="rgba(255,255,255,0.55)" fontSize="12">
          前向传播
        </text>
        <text x="414" y="38" fill="rgba(255,255,255,0.55)" fontSize="12">
          loss / 反向传播
        </text>
      </svg>
    </section>
  );
}

function renderWeightBadge(x1: number, y1: number, x2: number, y2: number, value: string, offset: number) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy) || 1;
  const normalX = -dy / length;
  const normalY = dx / length;
  const badgeX = midX + normalX * offset;
  const badgeY = midY + normalY * offset;

  return (
    <g>
      <rect
        x={badgeX - 19}
        y={badgeY - 11}
        width="38"
        height="22"
        rx="11"
        fill="rgba(5, 6, 8, 0.92)"
        stroke="rgba(255,255,255,0.18)"
      />
      <text x={badgeX} y={badgeY + 4} textAnchor="middle" fill="rgba(255,255,255,0.82)" fontSize="11">
        {value}
      </text>
    </g>
  );
}

function renderNode(x: number, y: number, label: string, value: number, updateActive: boolean, gradient?: number) {
  return (
    <g key={label}>
      <circle
        cx={x}
        cy={y}
        r="24"
        fill={updateActive ? 'rgba(245,158,11,0.18)' : 'rgba(255,255,255,0.08)'}
        stroke={gradient !== undefined ? 'rgba(245,158,11,0.9)' : 'rgba(255,255,255,0.5)'}
        strokeWidth={gradient !== undefined ? 3 : 2}
      />
      <text x={x} y={y - 5} textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700">
        {label}
      </text>
      <text x={x} y={y + 12} textAnchor="middle" fill="rgba(255,255,255,0.78)" fontSize="10">
        {value.toFixed(2)}
      </text>
      {gradient !== undefined ? (
        <text x={x} y={y + 46} textAnchor="middle" fill="#f59e0b" fontSize="10">
          grad {gradient.toFixed(3)}
        </text>
      ) : null}
    </g>
  );
}
