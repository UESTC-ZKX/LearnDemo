import { describe, expect, it } from 'vitest';
import {
  demoKeys,
  getTimelineItems,
  modelEvolutionDemos,
  modelEvolutionTimeline,
  timelineModes,
} from './modelEvolution';

describe('model evolution data', () => {
  it('exports the expected spacing modes and demo key coverage', () => {
    expect(timelineModes).toEqual(['equal', 'chronological']);
    expect(demoKeys).toEqual([
      'foundation',
      'fitting',
      'neural-network',
      'cnn-rnn',
      'transformer',
      'alignment',
      'moe',
    ]);
  });

  it('defines a full first-chapter timeline and right-side demo lab data', () => {
    expect(modelEvolutionTimeline).toHaveLength(14);
    expect(modelEvolutionDemos.map((demo) => demo.key)).toEqual(demoKeys);

    for (const item of modelEvolutionTimeline) {
      expect(item.id).toBeTruthy();
      expect(item.dateLabel).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(item.eraLabel).toBeTruthy();
      expect(item.narration).toBeTruthy();
      expect(item.demoKey).toBeTruthy();
      expect(item.solvedProblem).toBeTruthy();
      expect(item.limitation).toBeTruthy();
      expect(item.nextTransition).toBeTruthy();
    }
  });

  it('includes the required historical nodes and GPT-5 endpoint', () => {
    const titles = modelEvolutionTimeline.map((item) => item.title);

    expect(titles).toEqual(
      expect.arrayContaining([
        '麦卡洛克-皮茨神经元模型（McCulloch-Pitts Neuron）',
        '图灵测试（Turing Test）',
        '感知机（Perceptron）',
        '反向传播（Backpropagation）',
        '卷积神经网络 / LeNet（CNN / LeNet）',
        '长短期记忆网络（LSTM）',
        'AlexNet',
        '序列到序列（Seq2Seq）',
        'Transformer',
        'BERT / GPT-1',
        'GPT-3',
        'ChatGPT',
        'GPT-4',
        'GPT-5',
      ]),
    );

    const gpt5 = modelEvolutionTimeline.at(-1);
    expect(gpt5?.dateLabel).toBe('2025-08-07');
    expect(gpt5?.title).toBe('GPT-5');
  });

  it('returns stable positions within the visible timeline rail for both spacing modes', () => {
    const equalItems = getTimelineItems('equal');
    const chronologicalItems = getTimelineItems('chronological');

    expect(equalItems[0].position).toBe(8);
    expect(equalItems.at(-1)?.position).toBe(92);
    expect(chronologicalItems[0].position).toBeGreaterThanOrEqual(8);
    expect(chronologicalItems.at(-1)?.position).toBe(92);

    for (const items of [equalItems, chronologicalItems]) {
      for (const item of items) {
        expect(item.position).toBeGreaterThanOrEqual(8);
        expect(item.position).toBeLessThanOrEqual(92);
        expect(item.labelPosition).toBeGreaterThanOrEqual(8);
        expect(item.labelPosition).toBeLessThanOrEqual(92);
      }
    }
  });

  it('compresses recent history in chronological mode compared with equal spacing', () => {
    const equalItems = getTimelineItems('equal');
    const chronologicalItems = getTimelineItems('chronological');

    const equalGap = equalItems.at(-1)!.position - equalItems.at(-2)!.position;
    const chronologicalGap =
      chronologicalItems.at(-1)!.position - chronologicalItems.at(-2)!.position;

    expect(chronologicalGap).toBeLessThan(equalGap);
  });

  it('keeps chronological order aligned with the timeline data', () => {
    const chronologicalItems = getTimelineItems('chronological');

    expect(chronologicalItems.map((item) => item.id)).toEqual(
      modelEvolutionTimeline.map((item) => item.id),
    );
    expect(chronologicalItems.map((item) => item.position)).toEqual(
      chronologicalItems.map((item) => item.position).slice().sort((a, b) => a - b),
    );
  });

  it('allows chronological labels to stack on the same real time positions', () => {
    const chronologicalItems = getTimelineItems('chronological');

    for (const item of chronologicalItems) {
      expect(item.labelPosition).toBe(item.position);
    }
  });

  it('keeps chronological dots compressed to show the recent burst', () => {
    const equalItems = getTimelineItems('equal');
    const chronologicalItems = getTimelineItems('chronological');

    const equalRecentGap = equalItems.at(-1)!.position - equalItems.at(-2)!.position;
    const trueRecentGap = chronologicalItems.at(-1)!.position - chronologicalItems.at(-2)!.position;

    expect(trueRecentGap).toBeLessThan(equalRecentGap);
  });
});
