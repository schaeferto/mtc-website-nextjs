import type { CollectionConfig } from 'payload';

export const LeagueSeasons: CollectionConfig = {
  slug: 'league-seasons',
  admin: {
    useAsTitle: 'heading',
    defaultColumns: ['heading', 'year', 'published'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'year',
      type: 'number',
      required: true,
      min: 2000,
      max: 2100,
      admin: {
        description: 'Season year, e.g. 2025.',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: {
        description: 'Heading shown on the /league page for this season, e.g. "Saison 2025 – drei Teams am Start".',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      admin: {
        description: 'Optional text shown below the season heading on the /league page.',
      },
    },
    {
      name: 'teams',
      type: 'join',
      collection: 'league-teams',
      on: 'season',
      defaultSort: 'displayOrder',
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Only published seasons appear on the /league page.',
      },
    },
  ],
};
