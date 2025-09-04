import React, { useEffect, useRef, useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, delay = 200 }) => {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);

  const show = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (rect) setPos({ top: rect.top - 8, left: rect.left + rect.width / 2 });
      setVisible(true);
    }, delay) as unknown as number;
  };
  const hide = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setVisible(false);
  };

  useEffect(() => () => { if (timerRef.current) window.clearTimeout(timerRef.current); }, []);

  return (
    <div ref={wrapperRef} onMouseEnter={show} onMouseLeave={hide} className="relative inline-block">
      {children}
      {visible && pos && (
        <div
          className="fixed z-[10000] px-2 py-1 text-xs rounded bg-gray-900 text-white/95 shadow-lg animate-fade-in"
          style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -100%)' }}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
