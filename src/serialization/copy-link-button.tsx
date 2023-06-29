import { useState, useRef, useCallback, useEffect } from 'react';
import { exportComparison } from './export';

export function CopyLinkButton() {
  const [open, setOpen] = useState(false);
  const timeout = useRef<number>();

  const onClick = useCallback(() => {
    setOpen(true);
    exportComparison();

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
    <div className="relative tooltip tooltip-top" data-tip="Click to Copy Link">
      <div data-open={open} className="copy-tip-right copy-tip-scale">
        <div data-open={open} className="copy-tip-rotate">
          <div className="copy-tail-right">Copied!</div>
        </div>
      </div>
      <button
        className="btn btn-neutral items-center md:btn-sm rounded tracking-wide font-normal capitalize"
        onClick={onClick}
      >
        <span>Share Comparison</span>
        <span className="text-base hidden sm:inline">
          <ClipboardIcon />
        </span>
      </button>
    </div>
  );
}

function ClipboardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M17 9H7V7h10m0 6H7v-2h10m-3 6H7v-2h7M12 3a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m7 0h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"
      />
    </svg>
  );
}
