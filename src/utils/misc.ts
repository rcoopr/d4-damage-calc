import { StatSource, BuildSource } from '../store/builds/stats/labels';

export function clamp(number: number, min: number, max: number) {
  return Math.min(max, Math.max(min, number));
}

export const MAX_SATURATION = 3;
export const MAX_SATURATION_AT = 10;

export const mapSourceToBuilds: Record<StatSource, BuildSource> = {
  char: 'char',
  item1: 'build1',
  item2: 'build2',
};

export function resetWindowLocationToOrigin() {
  window.history.replaceState(null, '', new URL(window.location.origin));
}

export function noop() {
  void 0;
}
