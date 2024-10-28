import { toast } from 'react-hot-toast'
import { track } from '../analytics'

export const Toast = {
  success: (message: string, eventName?: string, eventData?: Record<string, any>) => {
    toast.success(message)
    if (eventName) {
      track(eventName, { status: 'success', message, ...eventData })
    }
  },

  error: (message: string, eventName?: string, eventData?: Record<string, any>) => {
    toast.error(message)
    if (eventName) {
      track(eventName, { status: 'error', message, ...eventData })
    }
  },

  loading: (message: string) => {
    return toast.loading(message)
  },

  dismiss: (toastId: string) => {
    toast.dismiss(toastId)
  },

  promise: async <T>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string
      error: string
    },
    eventName?: string,
    eventData?: Record<string, any>,
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: (data) => {
        if (eventName) {
          track(eventName, { status: 'success', ...eventData })
        }
        return messages.success
      },
      error: (err) => {
        if (eventName) {
          track(eventName, {
            status: 'error',
            error: err?.message || 'Unknown error',
            ...eventData,
          })
        }
        return messages.error
      },
    })
  },
}
