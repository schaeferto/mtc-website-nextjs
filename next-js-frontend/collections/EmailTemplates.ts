import type { CollectionConfig } from 'payload'

export const EmailTemplates: CollectionConfig = {
  slug: 'email-templates',
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
      admin: {
        description: 'Unique identifier used to reference this template in code (e.g. trial_registration_notification)',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Applicant Confirmation', value: 'applicant_confirmation' },
        { label: 'Admin Notification', value: 'admin_notification' },
      ],
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
    },
    {
      name: 'html',
      type: 'code',
      required: true,
      admin: {
        language: 'html',
        description: 'Use {{name}}, {{event}}, {{date}}, {{addresse}}, {{email}} as placeholders.',
      },
    },
  ],
}
