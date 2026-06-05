import * as migration_20260514_133136 from './20260514_133136';
import * as migration_20260531_183357_league_content from './20260531_183357_league_content';
import * as migration_20260603_222457_news from './20260603_222457_news';

export const migrations = [
  {
    up: migration_20260514_133136.up,
    down: migration_20260514_133136.down,
    name: '20260514_133136',
  },
  {
    up: migration_20260531_183357_league_content.up,
    down: migration_20260531_183357_league_content.down,
    name: '20260531_183357_league_content',
  },
  {
    up: migration_20260603_222457_news.up,
    down: migration_20260603_222457_news.down,
    name: '20260603_222457_news'
  },
];
