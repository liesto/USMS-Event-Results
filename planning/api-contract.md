# USMS Event Results - API Contract

**Version:** 1.0
**Date:** January 2, 2026
**Status:** Proof of Concept (TypeScript/Node.js)

---

## Overview

This document defines the REST API contract between the React front-end and the backend data layer. The API provides access to USMS event results data from the existing MySQL database without any schema modifications.

**Base URL (Development):** `http://localhost:3000/api`
**Base URL (Production):** TBD (Will be .NET Core on IIS/Sitecore)

---

## Authentication

**POC Phase:** No authentication required
**Production:** TBD (may integrate with USMS member authentication)

---

## Common Response Format

All API responses follow this structure:

### Success Response
```typescript
{
  "success": true,
  "data": T  // Type varies by endpoint
}
```

### Error Response
```typescript
{
  "success": false,
  "error": {
    "error": string,      // Error category
    "message": string,    // Human-readable message
    "code": string,       // Optional error code
    "details": unknown    // Optional additional context
  }
}
```

### HTTP Status Codes
- `200 OK` - Successful request
- `400 Bad Request` - Invalid parameters
- `404 Not Found` - Resource not found (e.g., swimmer not found)
- `500 Internal Server Error` - Server/database error

---

## Endpoints

### 1. Get Individual Results

Fetch all swim results for a specific swimmer with filtering options.

**Endpoint:** `GET /api/individual-results`

**Query Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `SwimmerID` | string | Yes* | USMS Swimmer ID (5 chars) | `GAT0R` |
| `FirstName` | string | No* | Swimmer first name | `Michael` |
| `LastName` | string | No* | Swimmer last name | `Phelps` |
| `MI` | string | No | Middle initial | `F` |
| `Sex` | string | No | Gender filter (`M` or `F`) | `M` |
| `CourseID` | number | No | Pool type (1=SCY, 2=SCM, 3=LCM) | `1` |
| `Distance` | number | No | Event distance filter | `50` |
| `StrokeID` | number | No | Stroke filter (1-10) | `1` |
| `lowage` | number | No | Minimum age filter | `25` |
| `highage` | number | No | Maximum age filter | `29` |
| `srt` | string | No | Sort order: `ageGrp`, `age`, `time` | `time` |
| `showScratch` | boolean | No | Include SCR/NS swims | `false` |
| `noID` | boolean | No | Only show swims without SwimmerID | `false` |

**\*Note:** Either `SwimmerID` OR (`LastName` + `FirstName`) is required.

**Example Request:**
```
GET /api/individual-results?SwimmerID=GAT0R&CourseID=1&srt=time
```

**Response Type:** `IndividualResultsResponse`

**Example Response:**
```json
{
  "success": true,
  "data": {
    "swimmer": {
      "SwimmerID": "GAT0R",
      "FirstName": "Rowdy",
      "MI": "T",
      "LastName": "Gaines",
      "FullName": "Rowdy T Gaines",
      "Sex": "M",
      "ClubAbbr": "SYSM",
      "Location": "Honolulu, HI",
      "MemberSince": "1984",
      "HideMemberInfo": false
    },
    "stats": {
      "totalSwims": 247,
      "podiumFinishes": 189,
      "firstPlace": 142,
      "uniqueMeets": 52,
      "recordedSwims": 247,
      "bestTime": {
        "event": "50 Free",
        "time": "21.45",
        "timeSec": 21.45,
        "meet": "USMS Spring Nationals",
        "meetID": "20240315SNATSY",
        "date": "2024-03-15"
      }
    },
    "results": [
      {
        "SwimID": 123456,
        "MeetID": "20240315SNATSY",
        "MeetTitle": "2024 USMS Spring Nationals",
        "MeetDate": "2024-03-15",
        "SwimmerID": "GAT0R",
        "FirstName": "Rowdy",
        "MI": "T",
        "LastName": "Gaines",
        "Age": 65,
        "AgeGroup": "65-69",
        "AgeGroupID": 14,
        "Sex": "M",
        "TeamAbbr": "SYSM",
        "CompetitorStatus": "member",
        "CourseAbbr": "SCY",
        "CourseName": "Short Course Yards",
        "StrokeShortName": "Free",
        "Distance": 50,
        "FixedTimeEventMinutes": 0,
        "EventNumber": 12,
        "Heat": 3,
        "Lane": 4,
        "Round": "Finals",
        "FinalTimeSec": 21.45,
        "FinalTime": "21.45",
        "Place": 1,
        "EventStatus": "OK",
        "PoolMeasured": true,
        "SplitsAvailable": false,
        "NumSplits": 0
      }
    ],
    "resultsByCourse": {
      "SCY": [...],
      "SCM": [...],
      "LCM": [...]
    },
    "totalResults": 247,
    "hasPoolNotMeasured": false,
    "mergedFrom": null
  }
}
```

**Error Cases:**
- `400` - Missing required parameters (`SwimmerID` or name)
- `404` - Swimmer not found
- `500` - Database error

---

### 2. Get Top Times

Fetch top times rankings for a specific event with optional filtering.

**Endpoint:** `GET /api/top-times`

**Query Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `CourseID` | number | Yes | Pool type (1=SCY, 2=SCM, 3=LCM) | `1` |
| `StrokeID` | number | Yes | Stroke (1-10) | `1` |
| `Distance` | number | Yes | Event distance | `50` |
| `AgeGroupID` | number | Yes | Age group (1-19) | `6` |
| `Sex` | string | Yes | Gender (`M`, `F`, or `A` for all) | `M` |
| `Season` | string | No | Season year range | `2024-2025` |
| `LMSCID` | number | No | LMSC region filter | `38` |
| `limit` | number | No | Number of results (default: 100) | `50` |
| `offset` | number | No | Pagination offset (default: 0) | `0` |

**Example Request:**
```
GET /api/top-times?CourseID=1&StrokeID=1&Distance=50&AgeGroupID=6&Sex=M&Season=2024-2025&limit=100
```

**Response Type:** `TopTimesResponse`

**Example Response:**
```json
{
  "success": true,
  "data": {
    "event": {
      "CourseAbbr": "SCY",
      "CourseName": "Short Course Yards",
      "StrokeShortName": "Free",
      "Distance": 50,
      "AgeGroup": "25-29",
      "Sex": "M"
    },
    "times": [
      {
        "rank": 1,
        "SwimmerID": "ABC12",
        "FirstName": "John",
        "MI": "",
        "LastName": "Doe",
        "Age": 27,
        "TeamAbbr": "NCMS",
        "LMSCID": 13,
        "LMSCAbbr": "NC",
        "FinalTimeSec": 19.82,
        "FinalTime": "19.82",
        "MeetID": "20240420NCSTY",
        "MeetTitle": "2024 NC State Championship",
        "MeetDate": "2024-04-20",
        "PoolMeasured": true
      }
    ],
    "totalCount": 847,
    "season": "2024-2025",
    "generatedAt": "2026-01-02T10:30:00.000Z"
  }
}
```

**Error Cases:**
- `400` - Missing required parameters
- `404` - No results found for criteria
- `500` - Database error

---

### 3. Get Reference Data

Fetch lookup data for filters (courses, strokes, age groups, etc.).

**Endpoint:** `GET /api/reference-data`

**Query Parameters:** None

**Response Type:** `ReferenceData`

**Example Response:**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "CourseID": 1,
        "CourseChar": "Y",
        "CourseAbbr": "SCY",
        "CourseName": "Short Course Yards",
        "CourseType": "pool"
      },
      {
        "CourseID": 2,
        "CourseChar": "S",
        "CourseAbbr": "SCM",
        "CourseName": "Short Course Meters",
        "CourseType": "pool"
      },
      {
        "CourseID": 3,
        "CourseChar": "L",
        "CourseAbbr": "LCM",
        "CourseName": "Long Course Meters",
        "CourseType": "pool"
      }
    ],
    "strokes": [
      {
        "StrokeID": 1,
        "StrokeShortName": "Free",
        "StrokeLongName": "Freestyle"
      },
      {
        "StrokeID": 2,
        "StrokeShortName": "Back",
        "StrokeLongName": "Backstroke"
      },
      {
        "StrokeID": 3,
        "StrokeShortName": "Breast",
        "StrokeLongName": "Breaststroke"
      },
      {
        "StrokeID": 4,
        "StrokeShortName": "Fly",
        "StrokeLongName": "Butterfly"
      },
      {
        "StrokeID": 5,
        "StrokeShortName": "IM",
        "StrokeLongName": "Individual Medley"
      }
    ],
    "ageGroups": [
      {
        "AgeGroupID": 1,
        "AgeGroup": "18-24",
        "MinAge": 18,
        "MaxAge": 24,
        "FINAAgeGroup": false
      },
      {
        "AgeGroupID": 2,
        "AgeGroup": "25-29",
        "MinAge": 25,
        "MaxAge": 29,
        "FINAAgeGroup": false
      }
    ],
    "distances": [50, 100, 200, 500, 1000, 1650],
    "seasons": ["2024-2025", "2023-2024", "2022-2023"]
  }
}
```

---

## Data Handling Rules

### Privacy Compliance

When `Person.HideMemberInfo = true`:
- Set `FirstName = "Name"`
- Set `LastName = "Unknown"`
- Set `MI = ""`
- Omit personal details (email, birth date, etc.)

When `Person.HideResultsInfo = true`:
- Return empty results array
- Include message indicating results are hidden

### Merged Swimmers

If `Person.NewSwimmerID` is not null:
- Fetch results using `NewSwimmerID` instead
- Include `mergedFrom` field in response with original SwimmerID

### Pool Measurement

- Set `hasPoolNotMeasured = true` if ANY result has `Meet.PoolMeasured = false`
- Individual results include `PoolMeasured` flag per swim

### Fixed-Time Events

For distance events (e.g., 1-hour swim):
- `FixedTimeEventMinutes > 0` indicates distance event
- `FinalTimeSec` represents distance covered, not time
- Format event name using `formatFixedTimeEvent()` utility

### Time Formatting

- Store times in database as `FinalTimeSec` (decimal seconds)
- Convert to display format using `timeSecToDisplayTime()`:
  - `22.03` → `"22.03"`
  - `62.45` → `"1:02.45"`
  - `3661.23` → `"1:01:01.23"`

### Event Status Handling

Valid status codes:
- `OK` - Normal result (display time/place)
- `DQ` - Disqualified (show "Disqualified")
- `NS` - No Show (show "No Show")
- `SCR` - Scratch (show "Scratch")
- `DNF` - Did Not Finish (show "Did Not Finish")
- `EXH` - Exhibition (show "Exhibition")
- `NT` - No Time (show "No Time")

Only include SCR/NS swims if `showScratch=true` parameter is set.

---

## Performance Considerations

### Caching Strategy

- Cache reference data (courses, strokes, age groups) for 24 hours
- Cache individual results for 1 hour (results update infrequently)
- Cache top times for 30 minutes (more dynamic)

### Query Optimization

- Add indexes on frequently queried fields:
  - `EventResultsSwims.SwimmerID`
  - `EventResultsSwims.MeetID`
  - `EventResultsSwims.CourseID + StrokeID + Distance`
  - `EventResultsSwimmers.CompetitorID`

### Pagination

- Default limit: 100 results
- Maximum limit: 1000 results
- Use `offset` parameter for pagination
- Return `hasMore` flag in response

---

## Database Query Pattern

### Individual Results Query Flow

1. Look up swimmer in `People` table by `SwimmerID` or name
2. Check for merged swimmer (`NewSwimmerID`)
3. Check privacy flags (`HideMemberInfo`, `HideResultsInfo`)
4. Join `EventResultsSwims` with:
   - `EventResultsSwimmers` (competitor details)
   - `Meets` (meet info)
   - `Courses` (pool type)
   - `Strokes` (event stroke)
   - `AgeGroups` (age group name)
5. Apply filters (course, distance, stroke, age range)
6. Sort by specified order (age group, age, or time)
7. Filter out SCR/NS unless `showScratch=true`
8. Calculate stats (total swims, podiums, best time)
9. Group results by course (SCY, SCM, LCM)

### Top Times Query Flow

1. Query `EventResultsSwims` with filters:
   - `CourseID`, `StrokeID`, `Distance` (exact match)
   - `AgeGroupID` (from age group table)
   - `Sex` (unless `Sex='A'` for all)
   - Optional: `Season` (date range from meet)
   - Optional: `LMSCID` (region filter)
2. Join with `EventResultsSwimmers` and `Meets`
3. Filter `EventStatus = 'OK'` (only valid times)
4. Sort by `FinalTimeSec ASC`
5. Apply limit/offset for pagination
6. Assign rank numbers (1-N)

---

## Example Integration

### React Hook for Individual Results

```typescript
import { useQuery } from '@tanstack/react-query'
import type { IndividualResultsParams, IndividualResultsResponse, APIResponse } from '@/types'

export function useIndividualResults(params: IndividualResultsParams) {
  return useQuery({
    queryKey: ['individual-results', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value))
        }
      })

      const response = await fetch(`/api/individual-results?${searchParams}`)
      const data: APIResponse<IndividualResultsResponse> = await response.json()

      if (!data.success) {
        throw new Error(data.error.message)
      }

      return data.data
    },
    enabled: Boolean(params.SwimmerID || (params.FirstName && params.LastName)),
  })
}
```

### Usage in Component

```typescript
function SwimmerResultsPage() {
  const { data, isLoading, error } = useIndividualResults({
    SwimmerID: 'GAT0R',
    CourseID: 1,
    srt: 'time',
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return null

  return (
    <div>
      <h1>{data.swimmer.FullName}</h1>
      <StatsGrid stats={data.stats} />
      <ResultsTable results={data.results} />
    </div>
  )
}
```

---

## Testing Checklist

- [ ] Test with valid SwimmerID
- [ ] Test with name-based search (FirstName + LastName)
- [ ] Test with all filter combinations
- [ ] Test privacy flags (HideMemberInfo, HideResultsInfo)
- [ ] Test merged swimmers (NewSwimmerID redirect)
- [ ] Test pagination (limit/offset)
- [ ] Test empty results
- [ ] Test invalid parameters (400 errors)
- [ ] Test swimmer not found (404 errors)
- [ ] Test database errors (500 errors)
- [ ] Test SCR/NS filtering
- [ ] Test fixed-time events
- [ ] Test time formatting edge cases
- [ ] Compare results with legacy PHP output

---

## Migration Notes

### TypeScript POC → .NET Core Production

When migrating to .NET Core backend:

1. **Keep API contract identical** - URL paths, parameters, response format
2. **Reuse TypeScript types** - Convert to C# models/DTOs
3. **Implement same business logic** - Privacy, merging, filtering
4. **Maintain MySQL schema** - No database changes
5. **Update base URL** - Point React app to new .NET endpoints
6. **Add authentication** - If required by production environment

---

*Last Updated: January 2, 2026*
