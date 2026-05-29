import type { CollectionConfig } from 'payload';

export const Trainings: CollectionConfig = {
  slug: 'trainings',
  admin: {
    useAsTitle: 'date',
    defaultColumns: ['date', 'discipline', 'location', 'isDisabled'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          timeIntervals: 15,
        },
      },
    },
    {
      name: 'discipline',
      type: 'select',
      required: true,
      options: [
        { label: 'Schwimmen', value: 'Schwimmen' },
        { label: 'Laufen', value: 'Laufen' },
      ],
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'locations',
      required: true,
    },
    {
      name: 'isDisabled',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Hides this training from the booking form without deleting it.',
      },
    },
    {
      name: 'capacity',
      type: 'number',
      admin: {
        description: 'Optional maximum number of participants.',
      },
    },
  ],
};
