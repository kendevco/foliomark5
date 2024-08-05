import { CollectionConfig } from 'payload/types';

const BookJournalEntries: CollectionConfig = {
  slug: 'book-journal-entries',
  fields: [
    {
      name: 'book',
      type: 'relationship',
      relationTo: 'books',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'lastReadDate',
      type: 'date',
      required: true,
    },
    {
      name: 'usersWithEntries',
      type: 'array',
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
        },
      ],
    },
  ],
};

export default BookJournalEntries;
