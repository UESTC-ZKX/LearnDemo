interface PresentationControlsProps {
  isPresentationMode: boolean;
  onToggle: () => void;
}

export function PresentationControls({ isPresentationMode, onToggle }: PresentationControlsProps) {
  return (
    <div className="presentation-controls" aria-label="演讲控制">
      <button type="button" className="control-button" onClick={onToggle}>
        {isPresentationMode ? '退出演讲模式' : '进入演讲模式'}
      </button>
      <span className="hidden text-xs text-zinc-400 md:inline">↑↓ / ←→ 切换重点模块，1/2/3 跳转章节</span>
    </div>
  );
}
