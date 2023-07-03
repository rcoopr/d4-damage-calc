import { useAtom, useAtomValue } from 'jotai';
import { focusAtom } from 'jotai-optics';
import { activeBuildNameAtom, buildStorageAtom } from './builds';
import { useCallback } from 'react';

export function useActiveBuildAtom() {
  const activeBuildName = useAtomValue(activeBuildNameAtom);

  return useAtom(
    focusAtom(
      buildStorageAtom,
      useCallback((optic) => optic.prop(activeBuildName), [activeBuildName])
    )
  );
}
