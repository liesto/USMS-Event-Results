/**
 * API Request and Response Types for USMS Event Results
 */

import type {
  EventResultsSwim,
  EventResultsSwimmer,
  EventResultsSplit,
  Person,
  Meet,
  Course,
  Stroke,
  AgeGroup,
} from './database'

// ============================================================================
// Individual Results API
// ============================================================================

/**
 * Query parameters for fetching individual results
 * Based on indresults.php query parameters
 */
export interface IndividualResultsParams {
  // Primary identifier
  SwimmerID?: string; // Preferred method

  // Alternative search by name
  FirstName?: string;
  LastName?: string;
  MI?: string;
  Sex?: 'M' | 'F';

  // Filtering options
  CourseID?: number; // 1=SCY, 2=SCM, 3=LCM
  Distance?: number; // Filter by event distance
  StrokeID?: number; // Filter by stroke
  lowage?: number; // Minimum age
  highage?: number; // Maximum age

  // Display options
  srt?: 'ageGrp' | 'age' | 'time'; // Sort order
  showScratch?: boolean; // Include SCR and NS swims
  noID?: boolean; // Only show swims without SwimmerID
}

/**
 * Single swim result with all related data
 */
export interface SwimResult {
  // Swim details
  SwimID: number;
  MeetID: string;
  MeetTitle: string;
  MeetDate: string; // StartDate from Meets table

  // Swimmer info
  SwimmerID: string;
  FirstName: string;
  MI: string;
  LastName: string;
  Age: number;
  AgeGroup: string; // e.g., "25-29"
  AgeGroupID: number;
  Sex: 'M' | 'F';
  TeamAbbr: string;
  CompetitorStatus: 'unconfirmed' | 'member' | 'foreigner' | 'nonmember' | 'oneevent';

  // Event details
  CourseAbbr: string; // 'SCY', 'SCM', 'LCM'
  CourseName: string;
  StrokeShortName: string;
  Distance: number;
  FixedTimeEventMinutes: number; // 0 for regular events

  // Result details
  EventNumber: number;
  Heat: number;
  Lane: number;
  Round: string;
  FinalTimeSec: number;
  FinalTime: string; // Formatted time string (MM:SS.HH)
  Place: number;
  EventStatus: 'OK' | 'DQ' | 'NS' | 'SCR' | 'DNF' | 'EXH' | 'NT';

  // Additional info
  PoolMeasured: boolean;
  SplitsAvailable: boolean;
  NumSplits: number;
}

/**
 * Swimmer statistics summary
 */
export interface SwimmerStats {
  totalSwims: number;
  podiumFinishes: number; // Top 3 places
  firstPlace: number; // Gold medals
  uniqueMeets: number;
  recordedSwims: number;

  // Best time highlight
  bestTime?: {
    event: string; // e.g., "50 Free"
    time: string;
    timeSec: number;
    meet: string;
    meetID: string;
    date: string;
  };
}

/**
 * Swimmer basic info
 */
export interface SwimmerInfo {
  SwimmerID: string;
  FirstName: string;
  MI: string;
  LastName: string;
  FullName: string; // Formatted name
  Sex: 'M' | 'F';
  ClubAbbr: string;
  Location: string; // "City, State" or "City, Country"
  MemberSince: string | null; // Year joined USMS
  HideMemberInfo: boolean;
}

/**
 * Complete individual results response
 */
export interface IndividualResultsResponse {
  swimmer: SwimmerInfo;
  stats: SwimmerStats;
  results: SwimResult[];
  resultsByCourse: {
    SCY?: SwimResult[];
    SCM?: SwimResult[];
    LCM?: SwimResult[];
  };

  // Metadata
  totalResults: number;
  hasPoolNotMeasured: boolean; // Whether any results are from non-measured pools
  mergedFrom?: string; // NewSwimmerID if swimmer was merged
}

// ============================================================================
// Top Times API
// ============================================================================

/**
 * Query parameters for fetching top times
 * Based on toptimes.php query parameters
 */
export interface TopTimesParams {
  // Required filters
  CourseID: number; // 1=SCY, 2=SCM, 3=LCM
  StrokeID: number;
  Distance: number;
  AgeGroupID: number;
  Sex: 'M' | 'F' | 'A'; // A = All

  // Optional filters
  Season?: string; // e.g., "2024-2025"
  LMSCID?: number; // Filter by LMSC region

  // Display options
  limit?: number; // Top N (default 100)
  offset?: number; // For pagination
}

/**
 * Single top time entry
 */
export interface TopTimeEntry {
  rank: number;
  SwimmerID: string;
  FirstName: string;
  MI: string;
  LastName: string;
  Age: number;
  TeamAbbr: string;
  LMSCID: number;
  LMSCAbbr: string;

  // Performance
  FinalTimeSec: number;
  FinalTime: string; // Formatted

  // Meet info
  MeetID: string;
  MeetTitle: string;
  MeetDate: string;

  // Additional
  PoolMeasured: boolean;
}

/**
 * Top times response
 */
export interface TopTimesResponse {
  event: {
    CourseAbbr: string;
    CourseName: string;
    StrokeShortName: string;
    Distance: number;
    AgeGroup: string;
    Sex: 'M' | 'F' | 'A';
  };
  times: TopTimeEntry[];
  totalCount: number;

  // Metadata
  season?: string;
  generatedAt: string; // ISO timestamp
}

// ============================================================================
// Reference Data API
// ============================================================================

/**
 * Reference data for filters
 */
export interface ReferenceData {
  courses: Course[];
  strokes: Stroke[];
  ageGroups: AgeGroup[];
  distances: number[]; // Available distances per stroke
  seasons: string[]; // Available season years
}

// ============================================================================
// Error Response
// ============================================================================

export interface APIError {
  error: string;
  message: string;
  code?: string;
  details?: unknown;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Generic paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

/**
 * API Response wrapper
 */
export type APIResponse<T> =
  | { success: true; data: T }
  | { success: false; error: APIError };
