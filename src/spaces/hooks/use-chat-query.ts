import qs from 'query-string'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSocket } from '@/components/providers/socket-provider'
import { Message } from '@/spaces/collections/types'

interface ChatQueryParams {
  queryKey: string
  apiUrl: string
  paramKey: 'channelId' | 'conversationId'
  paramValue: string
}

interface MessageResponse {
  docs: Message[]
  nextCursor: number | null
  hasNextPage: boolean
}

export const useChatQuery = ({ queryKey, apiUrl, paramKey, paramValue }: ChatQueryParams) => {
  const { isConnected } = useSocket()

  const fetchMessages = async ({ pageParam }: { pageParam?: number }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true },
    )

    const res = await fetch(url)
    return res.json() as Promise<MessageResponse>
  }

  return useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchInterval: isConnected ? false : 1000,
    initialPageParam: undefined as number | undefined,
  })
}
