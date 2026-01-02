# Testing Guide - USMS Event Results

## Servers Running

### Frontend (React + Vite)
**URL:** http://localhost:5173
**Status:** ✅ Running

### Backend (API Server)
**URL:** http://localhost:3001
**Status:** ✅ Running

---

## Individual Results Page

### Test URLs

#### 1. Default Swimmer (Kyle Deery - GAT0R)
```
http://localhost:5173/individual-results
```
**Expected:** 128 swims, 46 gold medals, best time 200 IM 1:53.88

#### 2. By Swimmer ID
```
http://localhost:5173/individual-results?SwimmerID=GAT0R
```

#### 3. By Name (Joy Ward)
```
http://localhost:5173/individual-results?FirstName=Joy&LastName=Ward
```

#### 4. Different Swimmer
```
http://localhost:5173/individual-results?SwimmerID=01XK4
```
(Michael Phelps - though he may have no results)

---

## What to Test

### Individual Results Page

1. **Data Loading**
   - [ ] Page shows loading spinner initially
   - [ ] Data loads from real API (check Network tab)
   - [ ] Swimmer name displays correctly
   - [ ] Stats cards show accurate data

2. **Swimmer Information**
   - [ ] Swimmer name (Kyle Deery or Joy Ward)
   - [ ] Swimmer ID displayed
   - [ ] Club abbreviation shown
   - [ ] Total swims count
   - [ ] Podium finishes
   - [ ] First place wins
   - [ ] Unique meets count
   - [ ] Best time highlighted

3. **Results Table**
   - [ ] All swims displayed
   - [ ] Event column (e.g., "50 Breast")
   - [ ] Time formatted correctly (MM:SS.HH)
   - [ ] Meet name shown
   - [ ] Date formatted
   - [ ] Course (SCY, SCM, LCM)
   - [ ] Age group shown
   - [ ] Place shown
   - [ ] Club abbreviation

4. **Filters**
   - [ ] Age group filter works
   - [ ] Event filter works
   - [ ] Course filter works (SCY, SCM, LCM)
   - [ ] Search box filters by meet/event/club

5. **Sorting**
   - [ ] Sort by Newest (default)
   - [ ] Sort by Oldest
   - [ ] Sort by Fastest time

6. **View Modes**
   - [ ] View All (single list)
   - [ ] View Grouped (by course and age group)

7. **Error Handling**
   - [ ] Invalid SwimmerID shows error message
   - [ ] Network error shows error message
   - [ ] Empty results handled gracefully

---

## API Direct Testing

### 1. Health Check
```bash
curl http://localhost:3001/health
```

### 2. Individual Results (SwimmerID)
```bash
curl "http://localhost:3001/api/individual-results?SwimmerID=GAT0R"
```

### 3. Individual Results (Name)
```bash
curl "http://localhost:3001/api/individual-results?FirstName=Joy&LastName=Ward"
```

### 4. Reference Data
```bash
curl http://localhost:3001/api/reference-data
```

### 5. Top Times
```bash
curl "http://localhost:3001/api/top-times?CourseID=1&StrokeID=1&Distance=50&AgeGroupID=2&Sex=M&limit=10"
```

---

## Browser DevTools Checks

### Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Check for:
   - API call to http://localhost:3001/api/individual-results
   - Status 200 (success)
   - Response has `success: true`
   - Data structure matches API contract

### Console Tab
- [ ] No errors in console
- [ ] No warnings about missing data
- [ ] React Query logs (if dev mode)

---

## Known Test Data

### Kyle Deery (GAT0R)
- **Total Swims:** 128
- **Gold Medals:** 46
- **Podium Finishes:** 86
- **Unique Meets:** 39
- **Best Time:** 200 IM - 1:53.88
- **Most Recent:** 2025 Summer Nationals (50 Breast LCM)

### Joy Ward
- **SwimmerID:** Unknown (search by name)
- **Test URL:** `?FirstName=Joy&LastName=Ward`

---

## Comparison with Legacy PHP

Compare results with legacy PHP page:
```
https://www.usms.org/comp/meets/indresults.php?SwimmerID=GAT0R
```

**Things to verify:**
- [ ] Same number of total swims
- [ ] Same stats (podiums, gold medals)
- [ ] Same meet names and dates
- [ ] Same times and places
- [ ] Same course designations

---

## Next Steps

After testing Individual Results:
- [ ] Test all filters and sorting
- [ ] Test with multiple swimmers
- [ ] Compare with PHP output
- [ ] Document any discrepancies
- [ ] Connect Top Times page to API

---

*Last Updated: January 2, 2026*
