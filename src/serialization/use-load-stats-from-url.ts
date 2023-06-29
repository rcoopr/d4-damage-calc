import { useEffect } from 'react';
import { importComparison } from './import';

export function useLoadStatsFromUrl() {
  useEffect(() => {
    // TODO: This doesn't work in dev mode because of double useEffect in react strict mode
    // But we don't want to overwrite wornItem on a regular page load otherwise it will always be null
    if (window.location.search !== '') {
      importComparison();
      resetWindowLocationToOrigin();
    }
  }, []);
}

function resetWindowLocationToOrigin() {
  window.history.replaceState(null, '', new URL(window.location.origin));
}
