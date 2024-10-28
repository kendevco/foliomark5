import dotenv from 'dotenv'
import path from 'path'
import type { Payload } from 'payload'
import payload from 'payload'

dotenv.config({
  path: path.resolve(__dirname, '../../../.env'),
})

let cached = (global as any).payload

if (!cached) {
  cached = (global as any).payload = { client: null, promise: null }
}

export const getPayloadClient = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is missing')
  }
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET environment variable is missing')
  }

  if (cached.client) {
    return cached.client
  }

  if (!cached.promise) {
    cached.promise = payload.init({
      secret: process.env.PAYLOAD_SECRET,
      local: true,
      db: {
        adapter: 'mongoose',
        url: process.env.MONGODB_URI,
      },
    } as any)
  }

  try {
    cached.client = await cached.promise
  } catch (e: unknown) {
    cached.promise = null
    throw e
  }

  return cached.client
}

export default getPayloadClient; // Add this line to export as default
