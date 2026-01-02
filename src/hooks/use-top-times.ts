/**
 * React Query hook for fetching top times rankings
 */

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { TopTimesParams, TopTimesResponse } from '@/types'

export function useTopTimes(params: TopTimesParams) {
  return useQuery({
    queryKey: ['top-times', params],
    queryFn: () => apiClient.getTopTimes(params) as Promise<TopTimesResponse>,
    enabled: Boolean(
      params.CourseID &&
      params.StrokeID &&
      params.Distance &&
      params.AgeGroupID &&
      params.Sex
    ),
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  })
}
