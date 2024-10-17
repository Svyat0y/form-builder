import { useRef, useState, useCallback, useEffect } from 'react';

export const useResizableSidebar = (
  initialWidth: number,
  minWidth: number = 300,
  maxWidth: number = 600,
) => {
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(initialWidth);

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing && sidebarRef.current) {
        const newWidth =
          sidebarRef.current.getBoundingClientRect().right -
          mouseMoveEvent.clientX;

        if (newWidth <= maxWidth && newWidth >= minWidth) {
          setSidebarWidth(newWidth);
        }
      }
    },
    [isResizing],
  );

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  return { sidebarRef, sidebarWidth, startResizing, setSidebarWidth };
};
