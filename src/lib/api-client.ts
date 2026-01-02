/**
 * API Client Configuration
 * Handles all HTTP requests to the USMS Event Results API
 */

import type { APIResponse } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data: APIResponse<T> = await response.json()

    if (!data.success) {
      throw new Error(data.error.message || 'API request failed')
    }

    return data.data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Unknown error occurred')
  }
}

/**
 * Build query string from parameters
 */
function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

/**
 * API Client
 */
export const apiClient = {
  /**
   * Get reference data (courses, strokes, age groups, etc.)
   */
  getReferenceData: () => {
    return fetchAPI('/api/reference-data')
  },

  /**
   * Get individual results for a swimmer
   */
  getIndividualResults: (params: Record<string, any>) => {
    const queryString = buildQueryString(params)
    return fetchAPI(`/api/individual-results${queryString}`)
  },

  /**
   * Get top times rankings
   */
  getTopTimes: (params: Record<string, any>) => {
    const queryString = buildQueryString(params)
    return fetchAPI(`/api/top-times${queryString}`)
  },
}
