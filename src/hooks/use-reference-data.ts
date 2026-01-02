/**
 * React Query hook for fetching reference data (courses, strokes, age groups)
 */

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { ReferenceData } from '@/types'

export function useReferenceData() {
  return useQuery({
    queryKey: ['reference-data'],
    queryFn: () => apiClient.getReferenceData() as Promise<ReferenceData>,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours (reference data rarely changes)
    retry: 2,
  })
}
