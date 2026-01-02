# Modernize Event Results History (timeline)

What:  individual-results & top-times

## Design
~Dec '25 - v0 redesigns the 2 PHP pages w/ very limited prompting. 
### prompt
This is an old presentation of individual swim meet results.  https://www.usms.org/comp/meets/indresults.php?SwimmerID=GAT0R.  The modernized site has branding like this. https://www.usms.org/events.  I want a refreshed version of the individual swimmer results page.  It needs to have friendly filtering and be responsive.  I like this, but I think we can do better. 

These...
https://www.usms.org/comp/meets/toptimes.php
https://www.usms.org/comp/meets/indresults.php?SwimmerID=GAT0R

## POC outline
~Jan '26
- Pull down v0 UI into local project
- Establish baseline for POC
-- Current structure
This is an old PHP app that runs on a not very optimized mySQL DB.  

-- Main project goal
This more modern presentation of individual results and top-times would be a bridge-the-gap UI improvement as we work to redesign/rebuild the entire results & rankings section of USMS.  We'd need to be able to stand up the new page designs and return dynamic results without making any database changes. 

-- Suggested approach
- Use React for the front-end, since we already use it. 
- Host those pages in IIS/Sitecore (not PHP), since we already have that
- Database calls to the legacy mySQL database
- Middleware/data manipulation via .net core app (in production, not now)
- Use .ts for the POC (What we're working on today)

## Introduce Claude to Esther
- Download PHP repo as usms.PHP.git
- Export table structure from mySQL
`SELECT
      TABLE_NAME,
      COLUMN_NAME,
      DATA_TYPE,
      CHARACTER_MAXIMUM_LENGTH,
      COLUMN_TYPE,
      IS_NULLABLE,
      COLUMN_KEY,
      COLUMN_DEFAULT,
      EXTRA
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'usms_main'
  ORDER BY TABLE_NAME, ORDINAL_POSITION;`

## See if Claude can understand the data structure
Summary: Understanding the USMS Individual Results Data Structure

  Yes, you're absolutely correct! With the PHP code, the CSV schema, and the full PHP repo, I now have everything I need except the actual MySQL database to fully understand how the current page works.

  What I Now Understand:

  Key Tables for Individual Results:

  1. EventResultsSwimmers - Competitor information per meet
    - CompetitorID (PK), MeetID, SwimmerID, FirstName, LastName, MI
    - Age, AgeGroupID, Sex, TeamAbbr, CompetitorStatus
  2. EventResultsSwims - Individual swim results
    - SwimID (PK), MeetID, SwimmerID, CompetitorID
    - StrokeID, Distance, EventNumber, Heat, Lane
    - FinalTimeSec, Place, EventStatus, Round
    - FixedTimeEventMinutes (for distance events like 1-hour swim)
  3. EventResultsSwimmersInSwims - Junction table
    - Links CompetitorID to SwimID
  4. People - Member/swimmer master data
    - SwimmerID (PK), FirstName, MI, LastName
    - HideMemberInfo, NewSwimmerID (for merged swimmers)
  5. Meets - Meet information
    - MeetID, MeetTitle, StartDate, CourseID, PoolMeasured
  6. Courses - Pool types
    - CourseID, CourseChar, CourseAbbr (SCY, SCM, LCM)
  7. Strokes - Event strokes
    - StrokeID, StrokeShortName
  8. AgeGroups - Age group definitions
    - AgeGroupID, AgeGroup, MinAge, MaxAge
  9. EventResultsSplits - Split times
    - SplitID, SwimID, SplitDistance, TimeSec

  What I'm Missing:

  ❌ Sample data to test with
  ❌ Indexes and performance characteristics
  ❌ Actual row counts (to understand data volume)

## create a TypeScript interface/type definitions based on this schema so we can start building the API layer for our React app

I've completed Step 1: Define Data Layer from the next steps outlined in the progress summary. Here's what's been accomplished:

  Data Layer - Complete ✅

  Created 5 new files:

  1. src/types/database.ts - TypeScript interfaces for all MySQL tables (Person, Meet, EventResultsSwimmer, EventResultsSwim, Course, Stroke, AgeGroup, etc.)
  2. src/types/api.ts - API request/response types including:
    - IndividualResultsParams - Query parameters for individual results
    - SwimResult - Single swim result with all related data
    - SwimmerStats - Statistics summary
    - IndividualResultsResponse - Complete response structure
    - TopTimesParams & TopTimesResponse - Top times rankings
    - ReferenceData - Lookup data for filters
    - Error handling types
  3. src/types/index.ts - Centralized exports for all types
  4. src/lib/time-utils.ts - Utility functions matching PHP logic:
    - Time conversion (seconds ↔ display format)
    - Fixed-time event formatting
    - Pace calculation
    - Date/status/place/name formatting
  5. planning/api-contract.md - Complete API specification with:
    - 3 REST endpoints (individual results, top times, reference data)
    - Request/response formats with examples
    - Privacy compliance rules
    - Query optimization guidelines
    - React integration examples
    - Testing checklist
  The data layer is now fully defined and documented. 
  
## Build API Backend
Can I hit these with postman? 

⏺ Yes, absolutely! The API server is running at http://localhost:3001 and you can test all the endpoints with Postman.

  Here are the endpoints you can try:

  Postman Request Examples

  1. Health Check

  GET http://localhost:3001/health

  2. Reference Data

  GET http://localhost:3001/api/reference-data

  3. Individual Results (by SwimmerID)

  GET http://localhost:3001/api/individual-results?SwimmerID=GAT0R

  4. Individual Results (by name)

  GET http://localhost:3001/api/individual-results?FirstName=Joy&LastName=Ward

  5. Individual Results with filters

  GET http://localhost:3001/api/individual-results?SwimmerID=GAT0R&CourseID=1&Distance=50&StrokeID=1&srt=time

  6. Top Times

  GET http://localhost:3001/api/top-times?CourseID=1&StrokeID=1&Distance=50&AgeGroupID=2&Sex=M&limit=10

  7. Top Times with season filter

  GET http://localhost:3001/api/top-times?CourseID=1&StrokeID=1&Distance=100&AgeGroupID=6&Sex=F&Season=2024-2025&limit=25

  Query Parameter Reference:

  CourseID: 1=SCY, 2=LCM, 3=SCM
  StrokeID: 1=Free, 2=Back, 3=Breast, 4=Fly, 5=IM
  Sex: M, F, or A (all)

  All endpoints return JSON in the format:
  {
    "success": true,
    "data": { ... }
  }

  The server is currently running in the background, so you can start testing right away!

Excellent! Now the API is working correctly. The fix was using the junction table eventresultsswimmersinswims to link swimmers to swims, just like the PHP code does.

  The API is now fully functional and tested with real data:

  ✅ Fixed Issues:
  1. Table names changed to lowercase (MySQL on Linux is case-sensitive)
  2. Query structure updated to use junction table eventresultsswimmersinswims
  3. Column names corrected (StrokeName → StrokeLongName, Abbr → LMSCAbbr)

  ✅ Working Endpoints with Real Data:
  - GET /health - Server health
  - GET /api/reference-data - All lookup tables
  - GET /api/individual-results?SwimmerID=GAT0R - Returns 128 swims for Kyle Deery
  - GET /api/top-times?... - Returns rankings (tested with 9,761 results)