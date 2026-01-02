/**
 * Shared types for USMS Event Results API
 * Mirrors the types from ../src/types/
 */

// ============================================================================
// Database Types
// ============================================================================

export interface Person {
  SwimmerID: string;
  NewSwimmerID: string | null;
  HideMemberInfo: boolean;
  HideProfile: boolean;
  HideResultsInfo: boolean;
  LMSCID: number;
  Sex: 'M' | 'F' | null;
  FirstName: string;
  MI: string;
  LastName: string;
  BirthDate: string;
  EMailAddress: string | null;
  ClubPermID: number;
  ClubAbbr: string;
  Deceased: boolean;
}

export interface Meet {
  MeetID: string;
  MeetTitle: string;
  StartDate: string;
  EndDate: string;
  CourseID: number;
  PoolMeasured: boolean;
  VenueID: number;
  LMSCID: number;
}

export interface EventResultsSwimmer {
  CompetitorID: number;
  MeetID: string;
  SwimmerID: string;
  FirstName: string;
  LastName: string;
  MI: string;
  RegNumber: string;
  BirthDate: string;
  Age: number;
  AgeGroupID: number;
  LMSCID: number;
  TeamID: number;
  TeamAbbr: string;
  Sex: 'M' | 'F';
  CompetitorStatus: 'unconfirmed' | 'member' | 'foreigner' | 'nonmember' | 'oneevent';
}

export interface EventResultsSwim {
  SwimID: number;
  MeetID: string;
  SwimDate: string;
  CompetitorID: number;
  SwimmerID: string;
  EventNumber: number;
  IndRelay: 'I' | 'R';
  StrokeID: number;
  Distance: number;
  FixedTimeEventMinutes: number;
  SeedTimeSec: number;
  Round: string;
  SplitRefSwim: number;
  Heat: number;
  Lane: number;
  Place: number;
  FinalTimeSec: number;
  Points: number;
  EventStatus: 'OK' | 'DQ' | 'NS' | 'SCR' | 'DNF' | 'EXH' | 'NT';
  SplitsAvailable: boolean;
}

export interface Course {
  CourseID: number;
  CourseChar: string;
  CourseAbbr: string;
  CourseName: string;
  CourseType: string;
}

export interface Stroke {
  StrokeID: number;
  StrokeShortName: string;
  StrokeLongName: string;
}

export interface AgeGroup {
  AgeGroupID: number;
  AgeGroup: string;
  MinAge: number;
  MaxAge: number;
  FINAAgeGroup: boolean;
}

// ============================================================================
// API Request Types
// ============================================================================

export interface IndividualResultsParams {
  SwimmerID?: string;
  FirstName?: string;
  LastName?: string;
  MI?: string;
  Sex?: 'M' | 'F';
  CourseID?: number;
  Distance?: number;
  StrokeID?: number;
  lowage?: number;
  highage?: number;
  srt?: 'ageGrp' | 'age' | 'time';
  showScratch?: boolean;
  noID?: boolean;
}

export interface TopTimesParams {
  CourseID: number;
  StrokeID: number;
  Distance: number;
  AgeGroupID: number;
  Sex: 'M' | 'F' | 'A';
  Season?: string;
  LMSCID?: number;
  limit?: number;
  offset?: number;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface SwimResult {
  SwimID: number;
  MeetID: string;
  MeetTitle: string;
  MeetDate: string;
  SwimmerID: string;
  FirstName: string;
  MI: string;
  LastName: string;
  Age: number;
  AgeGroup: string;
  AgeGroupID: number;
  Sex: 'M' | 'F';
  TeamAbbr: string;
  CompetitorStatus: 'unconfirmed' | 'member' | 'foreigner' | 'nonmember' | 'oneevent';
  CourseAbbr: string;
  CourseName: string;
  StrokeShortName: string;
  Distance: number;
  FixedTimeEventMinutes: number;
  EventNumber: number;
  Heat: number;
  Lane: number;
  Round: string;
  FinalTimeSec: number;
  FinalTime: string;
  Place: number;
  EventStatus: 'OK' | 'DQ' | 'NS' | 'SCR' | 'DNF' | 'EXH' | 'NT';
  PoolMeasured: boolean;
  SplitsAvailable: boolean;
  NumSplits: number;
}

export interface SwimmerStats {
  totalSwims: number;
  podiumFinishes: number;
  firstPlace: number;
  uniqueMeets: number;
  recordedSwims: number;
  bestTime?: {
    event: string;
    time: string;
    timeSec: number;
    meet: string;
    meetID: string;
    date: string;
  };
}

export interface SwimmerInfo {
  SwimmerID: string;
  FirstName: string;
  MI: string;
  LastName: string;
  FullName: string;
  Sex: 'M' | 'F';
  ClubAbbr: string;
  Location: string;
  MemberSince: string | null;
  HideMemberInfo: boolean;
}

export interface IndividualResultsResponse {
  swimmer: SwimmerInfo;
  stats: SwimmerStats;
  results: SwimResult[];
  resultsByCourse: {
    SCY?: SwimResult[];
    SCM?: SwimResult[];
    LCM?: SwimResult[];
  };
  totalResults: number;
  hasPoolNotMeasured: boolean;
  mergedFrom?: string;
}

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
  FinalTimeSec: number;
  FinalTime: string;
  MeetID: string;
  MeetTitle: string;
  MeetDate: string;
  PoolMeasured: boolean;
}

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
  season?: string;
  generatedAt: string;
}

export interface ReferenceData {
  courses: Course[];
  strokes: Stroke[];
  ageGroups: AgeGroup[];
  distances: number[];
  seasons: string[];
}

// ============================================================================
// API Response Wrapper
// ============================================================================

export interface APIError {
  error: string;
  message: string;
  code?: string;
  details?: unknown;
}

export type APIResponse<T> =
  | { success: true; data: T }
  | { success: false; error: APIError };
