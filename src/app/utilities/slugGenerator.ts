import { FieldHook } from 'payload'
import slugify from 'slugify'

const slugGenerator: FieldHook = ({ value, originalDoc, data }) => {
  if (typeof value === 'string') {
    return slugify(value, { lower: true, strict: true })
  }
  if (data && data.title) {
    return slugify(data.title, { lower: true, strict: true })
  }
  return value
}

export default slugGenerator
