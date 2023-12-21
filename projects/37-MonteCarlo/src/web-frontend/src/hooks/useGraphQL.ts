import { request } from 'graphql-request'
import useSWR from 'swr'

import { GRAPHQL_ENDPOINT } from '@/constants'

const fetcher = (query: any) => request(GRAPHQL_ENDPOINT, query)

export default function useGraphQL(query?: string) {
  return useSWR(query ? `{${query}}` : undefined, fetcher)
}
