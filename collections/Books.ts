import { CollectionConfig } from 'payload/types';
import slugGenerator from '../src/app/utilities/slugGenerator';

const Books: CollectionConfig = {
  slug: 'books',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [slugGenerator],
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'publishedDate',
      type: 'date',
    },
    {
      name: 'isbn',
      type: 'text',
    },
  ],
};

export default Books;
