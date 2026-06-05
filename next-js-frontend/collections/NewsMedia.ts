import type { CollectionConfig } from 'payload';

export const NewsMedia: CollectionConfig = {
  slug: 'news-media',
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
