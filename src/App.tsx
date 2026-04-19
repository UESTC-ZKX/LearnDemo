import { useEffect, useMemo, useState } from 'react';
import { ChapterSection } from './components/ChapterSection';
import { FinalTakeaways } from './components/FinalTakeaways';
import { PresentationControls } from './components/PresentationControls';
import { Sidebar } from './components/Sidebar';
import { chapters, finalTakeaways } from './data/chapters';
import { useActiveSection } from './hooks/useActiveSection';

const sectionIds = chapters.map((chapter) => chapter.id);

function App() {
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [targetIndex, setTargetIndex] = useState(0);
  const activeSectionId = useActiveSection(sectionIds);
  const presentationTargets = useMemo(
    () => [
      'hero',
      ...chapters.flatMap((chapter) =>
        chapter.id === 'chapter-models'
          ? [chapter.id]
          : [chapter.id, ...chapter.stages.map((stage) => stage.id)],
      ),
      'final-takeaways',
    ],
    [],
  );

  function handleNavigate(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const nextIndex = presentationTargets.indexOf(id);
    if (nextIndex >= 0) {
      setTargetIndex(nextIndex);
    }
  }

  function moveFocus(delta: number) {
    setTargetIndex((current) => {
      const next = Math.min(Math.max(current + delta, 0), presentationTargets.length - 1);
      document.getElementById(presentationTargets[next])?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return next;
    });
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        moveFocus(1);
      }

      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        moveFocus(-1);
      }

      if (['1', '2', '3'].includes(event.key)) {
        const chapter = chapters[Number(event.key) - 1];
        if (chapter) {
          event.preventDefault();
          handleNavigate(chapter.id);
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presentationTargets]);

  function togglePresentationMode() {
    setIsPresentationMode((current) => !current);
  }

  return (
    <div className={`min-h-screen bg-ink text-zinc-100 ${isPresentationMode ? 'presentation-mode' : ''}`}>
      <PresentationControls isPresentationMode={isPresentationMode} onToggle={togglePresentationMode} />
      <Sidebar chapters={chapters} activeSectionId={activeSectionId} onNavigate={handleNavigate} />

      <main className="content-shell">
        <section className="hero-section" id="hero" aria-labelledby="page-title">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-signal">技术分享</p>
          <h2 id="page-title" className="mt-5 max-w-5xl text-5xl font-semibold leading-tight text-white">
            从大模型发展，到智能体（Agent）框架选型，再到 Claude 工程实现解析
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            面向技术观众的分章节讲解页面。本轮先完成骨架、占位内容和基础导航，为后续内容结构化与演示组件留出清晰入口。
          </p>
        </section>

        <div className="grid gap-10">
          {chapters.map((chapter) => (
            <ChapterSection key={chapter.id} chapter={chapter} />
          ))}
          <FinalTakeaways items={finalTakeaways} />
        </div>
      </main>
    </div>
  );
}

export default App;
