import { getPayloadClient } from './payload/getPayloadClient'
import { exportData } from './payload/exportData'
import { transformSpace } from '../collections/types'
import { getCachedAdminStatus } from './cache/adminCache'
import { getCurrentUser } from './getCurrentUser'
import { getUserWithProfile } from './getUserWithProfile'
import type { UserWithProfile } from './getUserWithProfile'

export const SpaceUtilities = {
  payload: {
    getClient: getPayloadClient,
    exportData,
  },
  transforms: {
    space: transformSpace,
  },
  cache: {
    getAdminStatus: getCachedAdminStatus,
  },
  user: {
    getCurrent: getCurrentUser,
    getWithProfile: getUserWithProfile,
  },
}

export {
  getPayloadClient,
  exportData,
  transformSpace,
  getCachedAdminStatus,
  getCurrentUser,
  getUserWithProfile,
  type UserWithProfile,
}
