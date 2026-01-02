# USMS Event Results API Server

TypeScript/Node.js API server providing access to USMS event results data.

## Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=your_database_host
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=usms_main

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### 3. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## API Endpoints

### Health Check
```
GET /health
```

Returns server status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-02T10:30:00.000Z"
}
```

---

### Get Reference Data
```
GET /api/reference-data
```

Fetch all lookup data (courses, strokes, age groups, distances, seasons).

**Response:**
```json
{
  "success": true,
  "data": {
    "courses": [...],
    "strokes": [...],
    "ageGroups": [...],
    "distances": [50, 100, 200, ...],
    "seasons": ["2024-2025", "2023-2024", ...]
  }
}
```

---

### Get Individual Results
```
GET /api/individual-results?SwimmerID=GAT0R
```

Fetch all swim results for a specific swimmer.

**Query Parameters:**
- `SwimmerID` (string) - USMS Swimmer ID (required if not using name search)
- `FirstName` (string) - First name (required if not using SwimmerID)
- `LastName` (string) - Last name (required if not using SwimmerID)
- `MI` (string) - Middle initial (optional)
- `Sex` (string) - M or F (optional)
- `CourseID` (number) - 1=SCY, 2=SCM, 3=LCM (optional)
- `Distance` (number) - Event distance (optional)
- `StrokeID` (number) - Stroke filter (optional)
- `lowage` (number) - Minimum age (optional)
- `highage` (number) - Maximum age (optional)
- `srt` (string) - Sort order: ageGrp, age, time (optional)
- `showScratch` (boolean) - Include SCR/NS swims (optional)

**Examples:**
```bash
# By Swimmer ID
curl "http://localhost:3000/api/individual-results?SwimmerID=GAT0R"

# By name
curl "http://localhost:3000/api/individual-results?FirstName=Rowdy&LastName=Gaines"

# With filters
curl "http://localhost:3000/api/individual-results?SwimmerID=GAT0R&CourseID=1&Distance=50&srt=time"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "swimmer": { ... },
    "stats": { ... },
    "results": [ ... ],
    "resultsByCourse": {
      "SCY": [ ... ],
      "SCM": [ ... ],
      "LCM": [ ... ]
    },
    "totalResults": 247,
    "hasPoolNotMeasured": false
  }
}
```

---

### Get Top Times
```
GET /api/top-times?CourseID=1&StrokeID=1&Distance=50&AgeGroupID=6&Sex=M
```

Fetch top times rankings for a specific event.

**Query Parameters (Required):**
- `CourseID` (number) - 1=SCY, 2=SCM, 3=LCM
- `StrokeID` (number) - Stroke ID
- `Distance` (number) - Event distance
- `AgeGroupID` (number) - Age group ID
- `Sex` (string) - M, F, or A (all)

**Query Parameters (Optional):**
- `Season` (string) - Season year range (e.g., "2024-2025")
- `LMSCID` (number) - LMSC region filter
- `limit` (number) - Number of results (default: 100, max: 1000)
- `offset` (number) - Pagination offset (default: 0)

**Examples:**
```bash
# Top 100 times
curl "http://localhost:3000/api/top-times?CourseID=1&StrokeID=1&Distance=50&AgeGroupID=6&Sex=M"

# Top 50 times for current season
curl "http://localhost:3000/api/top-times?CourseID=1&StrokeID=1&Distance=50&AgeGroupID=6&Sex=M&Season=2024-2025&limit=50"

# Pagination
curl "http://localhost:3000/api/top-times?CourseID=1&StrokeID=1&Distance=50&AgeGroupID=6&Sex=M&limit=100&offset=100"
```

**Response:**
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
    "times": [ ... ],
    "totalCount": 847,
    "season": "2024-2025",
    "generatedAt": "2026-01-02T10:30:00.000Z"
  }
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": {
    "error": "ErrorType",
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "details": "Additional error context (development only)"
  }
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (validation error)
- `404` - Not Found (swimmer/event not found)
- `500` - Internal Server Error

---

## Testing

### Using cURL

```bash
# Test health check
curl http://localhost:3000/health

# Test reference data
curl http://localhost:3000/api/reference-data

# Test individual results
curl "http://localhost:3000/api/individual-results?SwimmerID=GAT0R"

# Test top times
curl "http://localhost:3000/api/top-times?CourseID=1&StrokeID=1&Distance=50&AgeGroupID=6&Sex=M&limit=10"
```

### Using Browser

Open your browser to:
- http://localhost:3000/health
- http://localhost:3000/api/reference-data
- http://localhost:3000/api/individual-results?SwimmerID=GAT0R

---

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.ts          # MySQL connection pool
│   ├── middleware/
│   │   └── error-handler.ts     # Error handling middleware
│   ├── routes/
│   │   ├── reference-data.ts    # GET /api/reference-data
│   │   ├── individual-results.ts # GET /api/individual-results
│   │   └── top-times.ts         # GET /api/top-times
│   ├── utils/
│   │   └── time-utils.ts        # Time formatting utilities
│   ├── types.ts                 # TypeScript type definitions
│   └── index.ts                 # Main server entry point
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## Database Tables Used

**Individual Results:**
- `People` - Swimmer master data
- `EventResultsSwimmers` - Competitor info per meet
- `EventResultsSwims` - Individual swim results
- `Meets` - Meet information
- `Courses` - Pool types (SCY, SCM, LCM)
- `Strokes` - Event strokes
- `AgeGroups` - Age group definitions
- `EventResultsSplits` - Split times (count only)

**Top Times:**
- Same tables with different filtering/sorting

**Reference Data:**
- `Courses`
- `Strokes`
- `AgeGroups`

---

## Privacy & Business Logic

The API respects all privacy flags and business rules:

- **`HideMemberInfo`** - Returns "Name Unknown" instead of real name
- **`HideResultsInfo`** - Returns empty results array
- **`NewSwimmerID`** - Automatically redirects to merged swimmer
- **`PoolMeasured`** - Indicates if pool was certified
- **Fixed-time events** - Handles 1-hour swims, etc.
- **Event status filtering** - Excludes SCR/NS unless requested

---

## Next Steps

1. **Configure `.env`** with your database credentials
2. **Start the server** with `npm run dev`
3. **Test endpoints** using cURL or browser
4. **Connect front-end** - Update React app to use API endpoints
5. **Production deployment** - Migrate to .NET Core for production

---

*Last Updated: January 2, 2026*
