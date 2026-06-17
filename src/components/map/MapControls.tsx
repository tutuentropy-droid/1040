import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

const GOLD_COLOR = '#c9a962';

export default function MapControls() {
  const zoomLevel = useAppStore((state) => state.zoomLevel);
  const zoomIn = useAppStore((state) => state.zoomIn);
  const zoomOut = useAppStore((state) => state.zoomOut);
  const resetView = useAppStore((state) => state.resetView);

  return (
    <div
      className="absolute bottom-6 right-6 flex flex-col gap-2 rounded-xl p-2 shadow-2xl backdrop-blur-md"
      style={{
        backgroundColor: 'rgba(15, 22, 36, 0.85)',
        border: `1px solid ${GOLD_COLOR}40`,
      }}
    >
      <button
        onClick={zoomIn}
        className={cn(
          'group flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200',
          'hover:scale-105 active:scale-95',
        )}
        style={{
          backgroundColor: 'rgba(255,255,255,0.05)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = `${GOLD_COLOR}20`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
        }}
        title="放大视图"
      >
        <ZoomIn
          size={20}
          style={{ color: GOLD_COLOR }}
          className="transition-transform duration-200 group-hover:scale-110"
        />
      </button>

      <div
        className="flex h-8 items-center justify-center rounded-md text-xs font-medium"
        style={{
          color: GOLD_COLOR,
          backgroundColor: 'rgba(255,255,255,0.03)',
        }}
      >
        {Math.round(zoomLevel * 100)}%
      </div>

      <button
        onClick={zoomOut}
        className={cn(
          'group flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200',
          'hover:scale-105 active:scale-95',
        )}
        style={{
          backgroundColor: 'rgba(255,255,255,0.05)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = `${GOLD_COLOR}20`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
        }}
        title="缩小视图"
      >
        <ZoomOut
          size={20}
          style={{ color: GOLD_COLOR }}
          className="transition-transform duration-200 group-hover:scale-110"
        />
      </button>

      <div className="my-1 h-px w-full" style={{ backgroundColor: `${GOLD_COLOR}20` }} />

      <button
        onClick={resetView}
        className={cn(
          'group flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200',
          'hover:scale-105 active:scale-95',
        )}
        style={{
          backgroundColor: 'rgba(255,255,255,0.05)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = `${GOLD_COLOR}20`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
        }}
        title="重置视图"
      >
        <RotateCcw
          size={20}
          style={{ color: GOLD_COLOR }}
          className="transition-transform duration-300 group-hover:rotate-[-180deg]"
        />
      </button>
    </div>
  );
}
