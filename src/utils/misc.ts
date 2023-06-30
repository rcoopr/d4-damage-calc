import { StatSource, Build } from '../store/item-selection';

export function clamp(number: number, min: number, max: number) {
  return Math.min(max, Math.max(min, number));
}

export const MAX_SATURATION = 3;
export const MAX_SATURATION_AT = 10;

export const mapSourceToBuilds: Record<StatSource, Build> = {
  base: 'base',
  item1: 'build1',
  item2: 'build2',
};
