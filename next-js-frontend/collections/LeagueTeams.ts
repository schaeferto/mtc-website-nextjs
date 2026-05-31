import type { CollectionConfig } from 'payload';

export const LeagueTeams: CollectionConfig = {
  slug: 'league-teams',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'season', 'overallPlacement'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'season',
      type: 'relationship',
      relationTo: 'league-seasons',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'league-media',
    },
    {
      name: 'overallPlacement',
      type: 'text',
      admin: {
        description: 'Final standing for the season, e.g. "8. Platz". Filled in after the season ends.',
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Sort order within a season (lower numbers first).',
      },
    },
    {
      name: 'events',
      type: 'join',
      collection: 'league-events',
      on: 'league',
      defaultSort: 'displayOrder',
    },
  ],
};
