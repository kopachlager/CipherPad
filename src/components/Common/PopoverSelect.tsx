import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type SelectOption = { label: string; value: string };

interface PopoverSelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  buttonClassName?: string;
  menuClassName?: string;
  renderButtonLabel?: (value: string) => React.ReactNode;
  optionClassName?: (opt: SelectOption, selected: boolean) => string;
}

const PopoverSelect: React.FC<PopoverSelectProps> = ({
  value,
  options,
  onChange,
  buttonClassName = '',
  menuClassName = '',
  renderButtonLabel,
  optionClassName,
}) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{top:number; left:number; width:number}>({ top: 0, left: 0, width: 0 });
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const ignoreClickUntilRef = useRef<number>(0);

  const recomputePosition = () => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) setPos({ top: rect.bottom, left: rect.left, width: rect.width });
  };

  const openMenu = () => { recomputePosition(); setOpen(true); ignoreClickUntilRef.current = Date.now() + 200; };
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (Date.now() < ignoreClickUntilRef.current) return; // ignore the click that opened
      const t = e.target as Node;
      if (btnRef.current?.contains(t)) return; // allow toggle clicks
      if (menuRef.current && !menuRef.current.contains(t)) closeMenu();
    };
    const onResize = () => recomputePosition();
    // Delay binding slightly to ignore the click that opened the menu
    const timer = window.setTimeout(() => {
      document.addEventListener('click', onDocClick, false);
    }, 0);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('click', onDocClick, false);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [open]);

  const selected = options.find(o => o.value === value);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (open) {
            closeMenu();
          } else {
            openMenu();
          }
        }}
        className={buttonClassName}
        aria-expanded={open}
      >
        {renderButtonLabel ? renderButtonLabel(value) : (selected?.label || value)}
      </button>
      {open && createPortal(
        <div
          ref={menuRef}
          className={menuClassName}
          style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
          role="listbox"
        >
          {options.map(opt => {
            const isSel = opt.value === value;
            const cls = optionClassName
              ? optionClassName(opt, isSel)
              : `w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${isSel ? 'bg-gray-50 dark:bg-gray-700' : ''}`;
            return (
              <button
                key={opt.value}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); onChange(opt.value); closeMenu(); }}
                className={cls}
                role="option"
                aria-selected={isSel}
              >
                {opt.label}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </>
  );
};

export default PopoverSelect;
