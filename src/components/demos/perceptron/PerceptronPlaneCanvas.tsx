import { PlaneSample, PerceptronState, TwoLayerNetworkState, predictPerceptron, predictTwoLayer } from './perceptronDemoModel';

interface PerceptronPlaneCanvasProps {
  activeSampleId?: string;
  samples: PlaneSample[];
  sceneId: 'linear' | 'xor-single' | 'xor-double';
  perceptronState?: PerceptronState;
  twoLayerState?: TwoLayerNetworkState;
}

const CANVAS_SIZE = 520;
const PADDING = 56;
const GRID_STEPS = 6;

export function PerceptronPlaneCanvas(props: PerceptronPlaneCanvasProps) {
  const { activeSampleId, perceptronState, samples, sceneId, twoLayerState } = props;
  const xValues = samples.map((sample) => sample.x);
  const yValues = samples.map((sample) => sample.y);
  const xMin = Math.min(...xValues, -1.5) - 0.8;
  const xMax = Math.max(...xValues, 1.5) + 0.8;
  const yMin = Math.min(...yValues, -1.5) - 0.8;
  const yMax = Math.max(...yValues, 1.5) + 0.8;
  const innerSize = CANVAS_SIZE - PADDING * 2;

  function mapX(value: number) {
    return PADDING + ((value - xMin) / (xMax - xMin)) * innerSize;
  }

  function mapY(value: number) {
    return CANVAS_SIZE - PADDING - ((value - yMin) / (yMax - yMin)) * innerSize;
  }

  const backgroundCells = buildBackgroundCells(sceneId, samples, xMin, xMax, yMin, yMax, perceptronState, twoLayerState);
  const linePath =
    sceneId === 'xor-double'
      ? null
      : buildPerceptronBoundaryPath(perceptronState, xMin, xMax, yMin, yMax, mapX, mapY);
  const hiddenPaths = sceneId === 'xor-double' ? buildHiddenBoundaryPaths(twoLayerState, xMin, xMax, yMin, yMax, mapX, mapY) : [];

  return (
    <section className="rounded-[2rem] border border-line bg-[radial-gradient(circle_at_top,rgba(61,214,198,0.18),transparent_34%),rgba(8,9,11,0.94)] p-5 shadow-projection">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">几何直觉画布</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">在平面上看见分类边界</h2>
        </div>
        <div className="rounded-full border border-line bg-black/30 px-3 py-2 text-xs text-zinc-400">
          绿色为正类，橙色为负类
        </div>
      </div>

      <svg className="mt-5 w-full" viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`} aria-label="感知机平面分类画布">
        <rect fill="rgba(255,255,255,0.02)" height={CANVAS_SIZE} rx="28" width={CANVAS_SIZE} />

        {backgroundCells.map((cell) => (
          <rect
            key={cell.key}
            fill={cell.fill}
            height={cell.height}
            opacity={cell.opacity}
            width={cell.width}
            x={cell.x}
            y={cell.y}
          />
        ))}

        {new Array(GRID_STEPS + 1).fill(null).map((_, index) => {
          const ratio = index / GRID_STEPS;
          const x = PADDING + ratio * innerSize;
          const y = PADDING + ratio * innerSize;

          return (
            <g key={`grid-${index}`}>
              <line
                stroke="rgba(255,255,255,0.08)"
                strokeDasharray="4 8"
                strokeWidth="1"
                x1={x}
                x2={x}
                y1={PADDING}
                y2={CANVAS_SIZE - PADDING}
              />
              <line
                stroke="rgba(255,255,255,0.08)"
                strokeDasharray="4 8"
                strokeWidth="1"
                x1={PADDING}
                x2={CANVAS_SIZE - PADDING}
                y1={y}
                y2={y}
              />
            </g>
          );
        })}

        <line
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="1.5"
          x1={PADDING}
          x2={CANVAS_SIZE - PADDING}
          y1={mapY(0)}
          y2={mapY(0)}
        />
        <line
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="1.5"
          x1={mapX(0)}
          x2={mapX(0)}
          y1={PADDING}
          y2={CANVAS_SIZE - PADDING}
        />

        {hiddenPaths.map((path, index) => (
          <path
            key={`hidden-${index}`}
            d={path}
            fill="none"
            stroke={index % 2 === 0 ? 'rgba(61,214,198,0.95)' : 'rgba(245,158,11,0.9)'}
            strokeDasharray="8 8"
            strokeWidth="2"
          />
        ))}

        {linePath ? <path d={linePath} fill="none" stroke="#ffffff" strokeWidth="3" /> : null}

        {samples.map((sample) => {
          const isMisclassified = getMisclassified(sceneId, sample, perceptronState, twoLayerState);
          const isActive = sample.id === activeSampleId;
          return (
            <g key={sample.id}>
              {isActive ? (
                <circle
                  cx={mapX(sample.x)}
                  cy={mapY(sample.y)}
                  fill="none"
                  r="18"
                  stroke="rgba(255,255,255,0.65)"
                  strokeDasharray="6 6"
                  strokeWidth="2"
                />
              ) : null}
              <circle
                cx={mapX(sample.x)}
                cy={mapY(sample.y)}
                fill={sample.label === 1 ? '#3dd6c6' : '#f59e0b'}
                r="12"
                stroke={isActive ? '#ffffff' : isMisclassified ? '#ffffff' : 'rgba(8,9,11,0.9)'}
                strokeWidth={isActive ? 5 : isMisclassified ? 4 : 2}
              />
              <text
                fill="#ffffff"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
                x={mapX(sample.x)}
                y={mapY(sample.y) + 4}
              >
                {sample.label === 1 ? '+' : '-'}
              </text>
            </g>
          );
        })}

        <text fill="rgba(255,255,255,0.52)" fontSize="13" x={CANVAS_SIZE - PADDING + 8} y={mapY(0) + 4}>
          x1
        </text>
        <text fill="rgba(255,255,255,0.52)" fontSize="13" x={mapX(0) - 6} y={PADDING - 12}>
          x2
        </text>
      </svg>
    </section>
  );
}

interface BackgroundCell {
  fill: string;
  height: number;
  key: string;
  opacity: number;
  width: number;
  x: number;
  y: number;
}

function buildBackgroundCells(
  sceneId: 'linear' | 'xor-single' | 'xor-double',
  samples: PlaneSample[],
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  perceptronState?: PerceptronState,
  twoLayerState?: TwoLayerNetworkState,
): BackgroundCell[] {
  const cells: BackgroundCell[] = [];
  const columns = 18;
  const rows = 18;
  const cellWidth = (CANVAS_SIZE - PADDING * 2) / columns;
  const cellHeight = (CANVAS_SIZE - PADDING * 2) / rows;

  for (let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < columns; columnIndex += 1) {
      const sampleX = xMin + ((columnIndex + 0.5) / columns) * (xMax - xMin);
      const sampleY = yMin + ((rows - rowIndex - 0.5) / rows) * (yMax - yMin);
      const probeSample: PlaneSample = { id: `${rowIndex}-${columnIndex}`, x: sampleX, y: sampleY, label: 1 };
      const signal =
        sceneId === 'xor-double'
          ? (twoLayerState ? predictTwoLayer(probeSample, twoLayerState) : 0.5) - 0.5
          : perceptronState
            ? predictPerceptron(probeSample, perceptronState)
            : 0;
      const isPositiveRegion = signal >= 0;
      cells.push({
        key: `cell-${rowIndex}-${columnIndex}`,
        fill: isPositiveRegion ? 'rgba(61,214,198,0.22)' : 'rgba(245,158,11,0.18)',
        height: cellHeight,
        opacity: sceneId === 'xor-double' ? 0.55 : 0.42,
        width: cellWidth,
        x: PADDING + columnIndex * cellWidth,
        y: PADDING + rowIndex * cellHeight,
      });
    }
  }

  return cells;
}

function buildPerceptronBoundaryPath(
  perceptronState: PerceptronState | undefined,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  mapX: (value: number) => number,
  mapY: (value: number) => number,
): string | null {
  if (!perceptronState) {
    return null;
  }

  const [w1, w2] = perceptronState.weights;
  const b = perceptronState.bias;

  if (Math.abs(w1) < 0.0001 && Math.abs(w2) < 0.0001) {
    return null;
  }

  if (Math.abs(w2) < 0.0001) {
    const x = -b / w1;
    return `M ${mapX(x)} ${mapY(yMin)} L ${mapX(x)} ${mapY(yMax)}`;
  }

  const yAtMin = (-b - w1 * xMin) / w2;
  const yAtMax = (-b - w1 * xMax) / w2;

  return `M ${mapX(xMin)} ${mapY(yAtMin)} L ${mapX(xMax)} ${mapY(yAtMax)}`;
}

function buildHiddenBoundaryPaths(
  twoLayerState: TwoLayerNetworkState | undefined,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  mapX: (value: number) => number,
  mapY: (value: number) => number,
): string[] {
  if (!twoLayerState) {
    return [];
  }

  const paths: string[] = [];

  for (let hiddenIndex = 0; hiddenIndex < twoLayerState.hiddenBiases.length; hiddenIndex += 1) {
    const w1 = twoLayerState.inputHiddenWeights[hiddenIndex][0];
    const w2 = twoLayerState.inputHiddenWeights[hiddenIndex][1];
    const b = twoLayerState.hiddenBiases[hiddenIndex];

    if (Math.abs(w1) < 0.0001 && Math.abs(w2) < 0.0001) {
      continue;
    }

    if (Math.abs(w2) < 0.0001) {
      const x = -b / w1;
      paths.push(`M ${mapX(x)} ${mapY(yMin)} L ${mapX(x)} ${mapY(yMax)}`);
      continue;
    }

    const yAtMin = (-b - w1 * xMin) / w2;
    const yAtMax = (-b - w1 * xMax) / w2;
    paths.push(`M ${mapX(xMin)} ${mapY(yAtMin)} L ${mapX(xMax)} ${mapY(yAtMax)}`);
  }

  return paths;
}

function getMisclassified(
  sceneId: 'linear' | 'xor-single' | 'xor-double',
  sample: PlaneSample,
  perceptronState?: PerceptronState,
  twoLayerState?: TwoLayerNetworkState,
): boolean {
  if (sceneId === 'xor-double') {
    if (!twoLayerState) {
      return false;
    }
    return (predictTwoLayer(sample, twoLayerState) >= 0.5 ? 1 : -1) !== sample.label;
  }

  if (!perceptronState) {
    return false;
  }

  return predictPerceptron(sample, perceptronState) !== sample.label;
}
