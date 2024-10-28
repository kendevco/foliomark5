import { LRUCache } from 'lru-cache'

const adminCache = new LRUCache({
  max: 500, // Maximum number of items
  ttl: 1000 * 60 * 5, // 5 minutes
})

export const getCachedAdminStatus = async (userId: string, checkFn: () => Promise<boolean>) => {
  const cacheKey = `admin-status:${userId}`

  if (adminCache.has(cacheKey)) {
    return adminCache.get(cacheKey)
  }

  const result = await checkFn()
  adminCache.set(cacheKey, result)
  return result
}
