import { useState, useRef, useCallback, useEffect } from 'react';
import { createShareLink } from './utils';

export function CopyLinkButton() {
  const [open, setOpen] = useState(false);
  const timeout = useRef<number>();

  const onClick = useCallback(() => {
    setOpen(true);
    createShareLink();

    if (timeout.current) {
      window.clearTimeout(timeout.current);
    }

    timeout.current = window.setTimeout(() => setOpen(false), 1800);
  }, []);

  useEffect(() => {
    return () => {
      if (timeout.current) window.clearTimeout(timeout.current);
    };
  }, []);

  return (
    <div className="relative">
      <div data-open={open} className="copy-tip-right copy-tip-scale">
        <div data-open={open} className="copy-tip-rotate">
          <div className="copy-tail-right">Copied!</div>
        </div>
      </div>
      <button
        className="button btn btn-ghost items-center btn-sm rounded tracking-wide font-normal capitalize"
        onClick={onClick}
      >
        Share Comparison
      </button>
    </div>
  );
}
