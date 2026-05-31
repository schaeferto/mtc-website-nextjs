import * as migration_20260514_133136 from './20260514_133136';
import * as migration_20260531_183357_league_content from './20260531_183357_league_content';

export const migrations = [
  {
    up: migration_20260514_133136.up,
    down: migration_20260514_133136.down,
    name: '20260514_133136',
  },
  {
    up: migration_20260531_183357_league_content.up,
    down: migration_20260531_183357_league_content.down,
    name: '20260531_183357_league_content'
  },
];
