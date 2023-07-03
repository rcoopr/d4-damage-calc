import { ComputedStats } from '../../store/builds/dps';
import { StatSource, BuildSource } from '../../store/builds/stats/labels';

export function getDpsDiff(
  comparison: ComputedStats['comparison'],
  source: StatSource | BuildSource
) {
  switch (source) {
    case 'build1':
      return comparison.build;
    case 'build2':
      return 0 - comparison.build;
    case 'item1':
      return comparison.item;
    case 'item2':
      return 0 - comparison.item;
    default:
      return 0;
  }
}
