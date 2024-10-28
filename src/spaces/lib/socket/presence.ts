import { Server as SocketIOServer } from 'socket.io'
import { getPayloadClient } from '@/spaces/utilities/getPayloadClient'

type PresenceData = {
  userId: string
  spaceId: string
  status: 'online' | 'offline' | 'idle' | 'dnd'
}

// Track online users per space
const onlineUsers = new Map<string, Set<string>>()

export const initializePresence = (io: SocketIOServer) => {
  io.on('connection', async (socket) => {
    const payload = await getPayloadClient()

    socket.on('presence:join', async (data: PresenceData) => {
      const { userId, spaceId, status } = data

      // Add user to space's online set
      if (!onlineUsers.has(spaceId)) {
        onlineUsers.set(spaceId, new Set())
      }
      onlineUsers.get(spaceId)?.add(userId)

      // Join the space's room
      socket.join(`space:${spaceId}`)

      // Update member status in Payload
      try {
        await payload.update({
          collection: 'members',
          where: {
            userId: { equals: userId },
            spaceId: { equals: spaceId },
          },
          data: {
            status,
            lastSeen: new Date().toISOString(),
          },
        })
      } catch (error) {
        console.error('Error updating member status:', error)
      }

      // Broadcast updated online count
      io.to(`space:${spaceId}`).emit('presence:update', {
        spaceId,
        count: onlineUsers.get(spaceId)?.size || 0,
      })
    })

    socket.on('presence:leave', (data: PresenceData) => {
      const { userId, spaceId } = data

      // Remove user from space's online set
      onlineUsers.get(spaceId)?.delete(userId)
      if (onlineUsers.get(spaceId)?.size === 0) {
        onlineUsers.delete(spaceId)
      }

      // Leave the space's room
      socket.leave(`space:${spaceId}`)

      // Broadcast updated online count
      io.to(`space:${spaceId}`).emit('presence:update', {
        spaceId,
        count: onlineUsers.get(spaceId)?.size || 0,
      })
    })

    socket.on('presence:status', async (data: PresenceData) => {
      const { userId, spaceId, status } = data

      // Update member status in Payload
      try {
        await payload.update({
          collection: 'members',
          where: {
            userId: { equals: userId },
            spaceId: { equals: spaceId },
          },
          data: {
            status,
            lastSeen: new Date().toISOString(),
          },
        })

        // Broadcast status update
        io.to(`space:${spaceId}`).emit('presence:status:update', {
          userId,
          status,
        })
      } catch (error) {
        console.error('Error updating member status:', error)
      }
    })

    socket.on('disconnect', () => {
      // Handle disconnection and cleanup
      onlineUsers.forEach((users, spaceId) => {
        users.forEach(async (userId) => {
          try {
            await payload.update({
              collection: 'members',
              where: {
                userId: { equals: userId },
              },
              data: {
                status: 'offline',
                lastSeen: new Date().toISOString(),
              },
            })
          } catch (error) {
            console.error('Error updating member status on disconnect:', error)
          }
        })
      })
    })
  })
}
