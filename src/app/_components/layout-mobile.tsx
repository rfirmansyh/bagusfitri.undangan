'use client';

import { ReactNode, Ref, useEffect } from 'react';

const LayoutMobile = ({ ref, children }: { ref: Ref<HTMLDivElement>, children: ReactNode }) => {
  useEffect(() => {
    const resizeWorkspace = function resizeWorkspace() {
      console.log('resizing');
      const workspace = document.getElementById('workspace');
      const canvas = document.getElementById('canvas');
      const zoom = document.getElementById('zoom');

      const windowWidth = Number(window.screen.width > 375 ? 375 : window.screen.width);
      const windowHeight = Number(window.innerHeight > 667 ? 667 : window.innerHeight);
      const hightRes = (windowHeight / windowWidth) * 9;

      const clientHeight = Number(window.innerHeight) / 667;
      const clientWidth = Number(window.screen.width) / 375;
      const scale = clientHeight < clientWidth ? clientHeight : clientWidth;
      var newHeight = (375 / 9) * (hightRes < 16 || window.screen.width > 375 ? 16 : hightRes);

      if (workspace) {
        workspace.style.height = ''.concat(String(newHeight), 'px');
      }
      if (canvas) {
        canvas.style.height = ''.concat(String(newHeight), 'px');
      }
      if (zoom) {
        zoom.style.transform = 'scale('.concat(String(scale), ') translate(0px,0px)');
      }
    };

    const SCROLL_KEY = 'canvas-scroll-top';

    // Restore scroll position as early as possible after reload
    const restoreScroll = () => {
      const canvas = document.getElementById('canvas');
      const saved = sessionStorage.getItem(SCROLL_KEY);
      if (canvas && saved !== null) {
        canvas.scrollTop = parseInt(saved, 10);
      }
    };

    // Save scroll position before the page unloads (HMR reload)
    const saveScroll = () => {
      const canvas = document.getElementById('canvas');
      if (canvas) {
        sessionStorage.setItem(SCROLL_KEY, String(canvas.scrollTop));
      }
    };

    window.addEventListener('beforeunload', saveScroll);

    document.addEventListener('DOMContentLoaded', () => {
      resizeWorkspace();
      restoreScroll();
    });
    window.addEventListener('resize', resizeWorkspace);

    // Call once on load in case DOMContentLoaded already fired
    resizeWorkspace();
  }, []);

  return (
    <div ref={ref} id="workspace">
      <div id="zoom">
        <div className="flex h-full w-full items-center justify-center">
          <div id="canvas" className="absolute">
            <main className="main h-full w-full" id="main-content">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutMobile;
