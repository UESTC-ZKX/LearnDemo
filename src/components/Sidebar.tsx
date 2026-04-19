import type { Chapter } from '../data/chapters';

interface SidebarProps {
  chapters: Chapter[];
  activeSectionId: string;
  onNavigate: (id: string) => void;
}

export function Sidebar({ chapters, activeSectionId, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <nav aria-label="章节导航">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">分享导览</p>
        <h1 className="mt-3 text-xl font-semibold leading-7 text-white">技术分享导览</h1>

        <div className="mt-10 grid gap-2">
          {chapters.map((chapter) => {
            const isActive = chapter.id === activeSectionId;
            return (
              <a
                key={chapter.id}
                href={`#${chapter.id}`}
                className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate(chapter.id);
                }}
              >
                <span className="text-xs text-zinc-500">{chapter.order}</span>
                <span>{chapter.title}</span>
              </a>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
