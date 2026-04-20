import { BackpropSampleAnalysis, BackpropNetworkState } from './backpropDemoModel';

interface BackpropNetworkCanvasProps {
  analysis: BackpropSampleAnalysis;
  mode: 'sample' | 'epoch';
  preset: 'small' | 'medium';
  stageIndex: number;
  state: BackpropNetworkState;
}

export function BackpropNetworkCanvas(props: BackpropNetworkCanvasProps) {
  const { analysis, mode, preset, stageIndex, state } = props;
  const inputNodes = [
    { id: 'x1', x: 88, y: 110, value: analysis.sample.inputs[0] },
    { id: 'x2', x: 88, y: 210, value: analysis.sample.inputs[1] },
  ];
  const hiddenLayouts =
    preset === 'small'
      ? [
          { id: 'h1', x: 270, y: 110 },
          { id: 'h2', x: 270, y: 210 },
        ]
      : [
          { id: 'h1', x: 240, y: 80 },
          { id: 'h2', x: 270, y: 160 },
          { id: 'h3', x: 240, y: 240 },
        ];
  const hiddenNodes = analysis.hiddenActivations.map((value, index) => ({
    ...hiddenLayouts[index],
    id: hiddenLayouts[index]?.id ?? `h${index + 1}`,
    x: hiddenLayouts[index]?.x ?? 240 + index * 28,
    y: hiddenLayouts[index]?.y ?? 80 + index * 80,
    value,
  }));
  const outputNode = { id: 'y', x: 444, y: 160, value: analysis.output };
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

      <svg className="mt-5 w-full" viewBox="0 0 540 320" aria-label="反向传播网络画布">
        <rect width="540" height="320" rx="26" fill="rgba(255,255,255,0.02)" />

        {inputNodes.flatMap((inputNode, inputIndex) =>
          hiddenNodes.map((hiddenNode, hiddenIndex) => (
            <g key={`${inputNode.id}-${hiddenNode.id}`}>
              <line
                x1={inputNode.x + 20}
                y1={inputNode.y}
                x2={hiddenNode.x - 20}
                y2={hiddenNode.y}
                stroke={forwardActive ? 'rgba(61,214,198,0.85)' : 'rgba(255,255,255,0.16)'}
                strokeWidth={forwardActive ? 3 : 1.5}
              />
              <text
                x={(inputNode.x + hiddenNode.x) / 2}
                y={(inputNode.y + hiddenNode.y) / 2 - 8}
                textAnchor="middle"
                fill="rgba(255,255,255,0.55)"
                fontSize="11"
              >
                {state.hiddenWeights[hiddenIndex][inputIndex].toFixed(2)}
              </text>
            </g>
          )),
        )}

        {hiddenNodes.map((hiddenNode, hiddenIndex) => (
          <g key={`${hiddenNode.id}-${outputNode.id}`}>
            <line
              x1={hiddenNode.x + 20}
              y1={hiddenNode.y}
              x2={outputNode.x - 20}
              y2={outputNode.y}
              stroke={outputBackpropActive ? 'rgba(245,158,11,0.92)' : forwardActive ? 'rgba(61,214,198,0.85)' : 'rgba(255,255,255,0.16)'}
              strokeWidth={outputBackpropActive || forwardActive ? 3 : 1.5}
              strokeDasharray={outputBackpropActive ? '10 6' : undefined}
            />
            <text
              x={(hiddenNode.x + outputNode.x) / 2}
              y={(hiddenNode.y + outputNode.y) / 2 - 8}
              textAnchor="middle"
              fill="rgba(255,255,255,0.55)"
              fontSize="11"
            >
              {state.outputWeights[hiddenIndex].toFixed(2)}
            </text>
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
        <text x="408" y="38" fill="rgba(255,255,255,0.55)" fontSize="12">
          loss / 反向传播
        </text>
      </svg>
    </section>
  );
}

function renderNode(x: number, y: number, label: string, value: number, updateActive: boolean, gradient?: number) {
  return (
    <g key={label}>
      <circle
        cx={x}
        cy={y}
        r="22"
        fill={updateActive ? 'rgba(245,158,11,0.18)' : 'rgba(255,255,255,0.08)'}
        stroke={gradient !== undefined ? 'rgba(245,158,11,0.9)' : 'rgba(255,255,255,0.5)'}
        strokeWidth={gradient !== undefined ? 3 : 2}
      />
      <text x={x} y={y - 5} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700">
        {label}
      </text>
      <text x={x} y={y + 10} textAnchor="middle" fill="rgba(255,255,255,0.78)" fontSize="10">
        {value.toFixed(2)}
      </text>
      {gradient !== undefined ? (
        <text x={x} y={y + 42} textAnchor="middle" fill="#f59e0b" fontSize="10">
          grad {gradient.toFixed(3)}
        </text>
      ) : null}
    </g>
  );
}
