import { describe, expect, it } from 'vitest';
import { chapters } from './chapters';

describe('chapters data', () => {
  it('defines the three required chapters in order', () => {
    expect(chapters.map((chapter) => chapter.title)).toEqual([
      '大模型发展',
      '智能体（Agent）框架选型',
      'Claude 工程实现解析',
    ]);
  });

  it('keeps content data ready for later demo replacement', () => {
    for (const chapter of chapters) {
      expect(chapter.id).toMatch(/^chapter-/);
      expect(chapter.overview).toContain('本阶段');
      expect(chapter.stages.length).toBeGreaterThanOrEqual(3);
      expect(chapter.handoff).toBeTruthy();
      expect(chapter.summary.length).toBeGreaterThanOrEqual(3);

      for (const stage of chapter.stages) {
        expect(stage.demoType).toBeTruthy();
        expect(stage.keyPoint).toBeTruthy();
        expect(stage.talkingPoints.length).toBeGreaterThanOrEqual(2);
        expect(stage.demoHint).toBeTruthy();
      }
    }
  });

  it('covers all required demo types across the structured content', () => {
    const demoTypes = chapters.flatMap((chapter) => chapter.stages.map((stage) => stage.demoType));

    expect(demoTypes).toEqual(
      expect.arrayContaining([
        'timeline',
        'sequence-decay',
        'attention',
        'decision-matrix',
        'tool-call-flow',
        'context-compression',
        'agent-loop',
      ]),
    );
  });

  it('keeps chapter-specific content constraints visible in the data', () => {
    expect(chapters[0].stages.map((stage) => stage.timeframe).filter(Boolean).length).toBe(chapters[0].stages.length);
    expect(chapters[1].summary.join('')).toContain('不是所有场景都需要智能体（Agent）');
    expect(chapters[2].summary.join('')).toContain('工程模块');
  });
});
