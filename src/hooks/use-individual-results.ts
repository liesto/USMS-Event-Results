/**
 * React Query hook for fetching individual swimmer results
 */

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { IndividualResultsParams, IndividualResultsResponse } from '@/types'

export function useIndividualResults(params: IndividualResultsParams) {
  return useQuery({
    queryKey: ['individual-results', params],
    queryFn: () => apiClient.getIndividualResults(params) as Promise<IndividualResultsResponse>,
    enabled: Boolean(params.SwimmerID || (params.FirstName && params.LastName)),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  })
}
