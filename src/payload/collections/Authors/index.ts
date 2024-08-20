<<<<<<< HEAD
// src/payload/collections/Authors/index.ts
import { CollectionConfig } from 'payload'
import { slugField } from '../../fields/slug'
=======
// src\payload\collections\Authors\index.ts
import { CollectionConfig } from 'payload'
import slugGenerator from '../../../app/utilities/slugGenerator'
>>>>>>> origin/main

const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
<<<<<<< HEAD
    slugField('name'),
=======
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [slugGenerator],
      },
    },
>>>>>>> origin/main
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'books',
      type: 'relationship',
<<<<<<< HEAD
      relationTo: 'books',
=======
      relationTo: 'books', // Ensure 'books' is the correct slug for the Books collection
>>>>>>> origin/main
      hasMany: true,
    },
  ],
}

export default Authors
