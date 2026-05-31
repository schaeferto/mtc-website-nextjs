import type { CollectionConfig } from 'payload';

export const LeagueMedia: CollectionConfig = {
  slug: 'league-media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
};
