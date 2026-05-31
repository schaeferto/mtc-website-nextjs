import type { CollectionConfig } from 'payload';

export const LeagueEvents: CollectionConfig = {
  slug: 'league-events',
  admin: {
    useAsTitle: 'eventName',
    defaultColumns: ['eventName', 'league', 'eventDate', 'place'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'league',
      type: 'relationship',
      relationTo: 'league-teams',
      required: true,
    },
    {
      name: 'eventName',
      type: 'text',
      required: true,
    },
    {
      name: 'eventDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'd. MMMM yyyy',
        },
      },
    },
    {
      name: 'eventType',
      type: 'text',
      admin: {
        description: 'Optional, e.g. "Supersprint mit Mannschaftsverfolgung".',
      },
    },
    {
      name: 'place',
      type: 'text',
      admin: {
        description: 'Final placement, e.g. "9". Leave empty until the event has happened. Text so DNF/DNS can be recorded.',
      },
    },
    {
      name: 'participants',
      type: 'array',
      admin: {
        description: 'Athletes competing in this event.',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Sort order within a team (lower numbers first).',
      },
    },
  ],
};
