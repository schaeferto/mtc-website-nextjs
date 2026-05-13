import type { CollectionConfig } from 'payload';

export const Locations: CollectionConfig = {
  slug: 'locations',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (e.g. bogenhausen, moosach, olympiapark)',
      },
    },
    {
      name: 'address',
      type: 'text',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'confirmationTemplate',
      type: 'relationship',
      relationTo: 'email-templates',
      required: true,
      filterOptions: {
        type: { equals: 'applicant_confirmation' },
      },
      admin: {
        description: 'Email template sent to the applicant upon registration for this location.',
      },
    },
  ],
};
