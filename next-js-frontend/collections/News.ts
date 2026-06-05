import type { CollectionConfig } from 'payload';

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'header',
    defaultColumns: ['header', 'date', 'releaseDate', 'published'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'header',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
    },
    {
      name: 'date',
      type: 'date',
      admin: {
        description: 'Event or article date (shown on the news page).',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd.MM.yyyy',
        },
      },
    },
    {
      name: 'releaseDate',
      type: 'date',
      admin: {
        description: 'Publication date (used for the "NEU" badge). Defaults to createdAt if not set.',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd.MM.yyyy',
        },
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Only published articles appear on the news page.',
      },
    },
    {
      name: 'images',
      type: 'array',
      label: 'Images',
      admin: {
        description: 'Article images. Mark one as cover — it appears in the news list and as the first lightbox slide.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'news-media',
          required: true,
        },
        {
          name: 'isCover',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Mark as cover image (shown in the news list).',
          },
        },
      ],
    },
  ],
};
