import { describe, expect, it } from 'vitest';
import { chapters } from './chapters';

describe('chapters data', () => {
  it('defines the three required chapters in order', () => {
    expect(chapters.map((chapter) => chapter.id)).toEqual([
      'chapter-models',
      'chapter-agents',
      'chapter-claude',
    ]);
  });

  it('keeps content data ready for later demo replacement', () => {
    for (const chapter of chapters) {
      expect(chapter.id).toMatch(/^chapter-/);
      expect(chapter.overview.length).toBeGreaterThan(20);
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
    expect(chapters[1].summary.join('')).toContain('Agent');
    expect(chapters[2].summary.join('')).toContain('工程');
  });

  it('structures the first chapter around bottlenecks, upgrades, and formula spotlights', () => {
    expect(chapters[0].stages).toHaveLength(5);

    for (const stage of chapters[0].stages) {
      const enrichedStage = stage as unknown as {
        analysis?: {
          coreProblem?: string;
          majorUpgrade?: string;
          solvedWhat?: string;
          remainingLimits?: string;
          systemShift?: string;
        };
        formulaSpotlight?: {
          title?: string;
          expression?: string;
          explanation?: string;
          variables?: string[];
          visualizationLabel?: string;
        };
      };

      expect(enrichedStage.analysis?.coreProblem).toBeTruthy();
      expect(enrichedStage.analysis?.majorUpgrade).toBeTruthy();
      expect(enrichedStage.analysis?.solvedWhat).toBeTruthy();
      expect(enrichedStage.analysis?.remainingLimits).toBeTruthy();
      expect(enrichedStage.analysis?.systemShift).toBeTruthy();
      expect(enrichedStage.formulaSpotlight?.title).toBeTruthy();
      expect(enrichedStage.formulaSpotlight?.expression).toBeTruthy();
      expect(enrichedStage.formulaSpotlight?.explanation).toBeTruthy();
      expect(enrichedStage.formulaSpotlight?.variables?.length).toBeGreaterThanOrEqual(2);
      expect(enrichedStage.formulaSpotlight?.visualizationLabel).toBeTruthy();
    }
  });
});
