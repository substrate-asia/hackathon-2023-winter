import request from 'graphql-request'

import { GRAPHQL_ENDPOINT } from '@/constants'

export function fetchJobByTrackId(trackId: string) {
  const query = `
    jobs(where: {uniqueTrackId_eq: "${trackId}"}, limit: 1) {
        id
    }
  `
  return request<any>(GRAPHQL_ENDPOINT, `{${query}}`)
}
