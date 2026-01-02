/**
 * Type definitions for USMS Event Results
 * Centralized exports for all types
 */

// Database types
export type {
  Person,
  Meet,
  EventResultsSwimmer,
  EventResultsSwim,
  EventResultsSwimmerInSwim,
  EventResultsSplit,
  EventResultsRelay,
  Course,
  Stroke,
  AgeGroup,
} from './database'

// API types
export type {
  IndividualResultsParams,
  SwimResult,
  SwimmerStats,
  SwimmerInfo,
  IndividualResultsResponse,
  TopTimesParams,
  TopTimeEntry,
  TopTimesResponse,
  ReferenceData,
  APIError,
  PaginatedResponse,
  APIResponse,
} from './api'
