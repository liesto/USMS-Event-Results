/**
 * TypeScript interfaces for USMS MySQL database tables
 * Generated from usms_main database schema
 */

// ============================================================================
// Core Member/Swimmer Data
// ============================================================================

export interface Person {
  SwimmerID: string; // varchar(5) - Primary Key
  NewSwimmerID: string | null; // For merged swimmers
  HideMemberInfo: boolean; // Privacy flag
  HideProfile: boolean;
  HideResultsInfo: boolean; // Hide competition results
  LMSCID: number;
  Sex: 'M' | 'F' | null;
  FirstName: string;
  MI: string;
  LastName: string;
  BirthDate: string; // date
  EMailAddress: string | null;
  ClubPermID: number;
  ClubAbbr: string;
  Deceased: boolean;
  // ... other fields as needed
}

// ============================================================================
// Meet Information
// ============================================================================

export interface Meet {
  MeetID: string; // varchar(15) - Primary Key
  MeetTitle: string;
  StartDate: string; // date
  EndDate: string; // date
  CourseID: number;
  PoolMeasured: boolean; // Pool measurement certification
  VenueID: number;
  LMSCID: number;
  // ... other fields as needed
}

// ============================================================================
// Event Results - Swimmers
// ============================================================================

export interface EventResultsSwimmer {
  CompetitorID: number; // int(10) unsigned - Primary Key
  MeetID: string; // varchar(15)
  SwimmerID: string; // varchar(5)
  FirstName: string; // varchar(28)
  LastName: string; // varchar(28)
  MI: string; // char(1)
  RegNumber: string; // varchar(16)
  BirthDate: string; // date
  Age: number; // int(10) unsigned
  AgeGroupID: number; // int(10) unsigned
  LMSCID: number;
  TeamID: number;
  TeamAbbr: string; // varchar(6)
  Sex: 'M' | 'F';
  CompetitorStatus: 'unconfirmed' | 'member' | 'foreigner' | 'nonmember' | 'oneevent';
}

// ============================================================================
// Event Results - Swims
// ============================================================================

export interface EventResultsSwim {
  SwimID: number; // int(10) unsigned - Primary Key
  MeetID: string; // varchar(15)
  SwimDate: string; // date
  CompetitorID: number;
  SwimmerID: string; // varchar(5)
  EventNumber: number;
  IndRelay: 'I' | 'R'; // Individual or Relay
  StrokeID: number;
  Distance: number; // yards/meters
  FixedTimeEventMinutes: number; // For distance events (e.g., 1-hour swim)
  SeedTimeSec: number; // decimal(8,2)
  Round: 'Prelims' | 'Semis' | 'Finals' | 'SwimOff' | 'Split' | 'TimeTrial';
  SplitRefSwim: number; // Reference to parent swim if this is a split
  Heat: number; // smallint(5)
  Lane: number; // tinyint(3)
  Place: number; // smallint(5)
  FinalTimeSec: number; // decimal(8,2)
  Points: number; // decimal(6,2)
  EventStatus: 'OK' | 'DQ' | 'NS' | 'SCR' | 'DNF' | 'EXH' | 'NT';
  SplitsAvailable: boolean; // tinyint(3)
}

// ============================================================================
// Junction Table - Swimmers in Swims
// ============================================================================

export interface EventResultsSwimmerInSwim {
  SwimmerInSwimID: number; // Primary Key
  SwimID: number;
  MeetID: string;
  CompetitorID: number;
  SwimmerNumber: number; // For relays
  ReactionTime: number | null; // float(5,2)
}

// ============================================================================
// Split Times
// ============================================================================

export interface EventResultsSplit {
  SplitID: number; // int(10) unsigned - Primary Key
  SwimID: number;
  MeetID: string;
  SplitNumber: number;
  SplitDistance: number; // Distance at which split was taken
  TimeSec: number; // decimal(8,2) - Cumulative time
}

// ============================================================================
// Reference Data - Courses
// ============================================================================

export interface Course {
  CourseID: number; // Primary Key
  CourseChar: string; // char(1) - 'Y', 'M', 'S'
  CourseAbbr: string; // varchar(6) - 'SCY', 'SCM', 'LCM'
  CourseName: string; // varchar(20) - 'Short Course Yards', etc.
  CourseType: 'pool' | 'longdist';
}

// ============================================================================
// Reference Data - Strokes
// ============================================================================

export interface Stroke {
  StrokeID: number; // Primary Key
  StrokeShortName: string; // 'Free', 'Back', 'Breast', 'Fly', 'IM', etc.
  StrokeLongName: string;
  // ... other fields
}

// ============================================================================
// Reference Data - Age Groups
// ============================================================================

export interface AgeGroup {
  AgeGroupID: number; // Primary Key
  AgeGroup: string; // char(7) - '18-24', '25-29', etc.
  MinAge: number; // smallint(5)
  MaxAge: number; // smallint(5)
  FINAAgeGroup: boolean;
}

// ============================================================================
// Relay-specific tables (for future use)
// ============================================================================

export interface EventResultsRelay {
  RelayID: number; // Primary Key
  SwimID: number;
  MeetID: string;
  AgeGroupID: number;
  TeamAbbr: string;
  TeamID: number;
  Sex: 'M' | 'F' | 'X'; // X for mixed
  EventNumber: number;
  StrokeID: number;
  Distance: number;
  Heat: number;
  Lane: number;
  Place: number;
  FinalTimeSec: number;
  EventStatus: 'OK' | 'DQ' | 'NS' | 'SCR' | 'DNF' | 'EXH';
  RelayStatus: 'unconfirmed' | 'member' | 'foreigner' | 'nonmember';
  SplitsAvailable: boolean;
}
