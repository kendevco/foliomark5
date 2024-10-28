'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSocket } from '@/spaces/providers/socket-provider'
import { Message } from '@/spaces/collections/types'

type ChatSocketProps = {
  queryKey: string
  addKey: string
  updateKey: string
}

export const useChatSocket = ({ queryKey, addKey, updateKey }: ChatSocketProps) => {
  const { socket } = useSocket()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!socket) return

    // Handle new messages
    socket.on(addKey, (message: Message) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                items: [message],
              },
            ],
          }
        }

        const newData = { ...oldData }
        newData.pages[0].items = [message, ...newData.pages[0].items]

        return newData
      })
    })

    // Handle message updates
    socket.on(updateKey, (message: Message) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData
        }

        const newData = { ...oldData }
        const pages = [...newData.pages]

        pages.forEach((page) => {
          const messageIndex = page.items.findIndex((item: Message) => item.id === message.id)
          if (messageIndex !== -1) {
            page.items[messageIndex] = message
          }
        })

        newData.pages = pages
        return newData
      })
    })

    return () => {
      socket.off(addKey)
      socket.off(updateKey)
    }
  }, [queryKey, addKey, updateKey, socket, queryClient])
}

export { useSocket }
