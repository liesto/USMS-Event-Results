/**
 * Individual Results API Route
 * GET /api/individual-results
 */

import { Router } from 'express'
import { query, queryOne } from '../config/database.js'
import { timeSecToDisplayTime, formatSwimmerName } from '../utils/time-utils.js'
import type {
  IndividualResultsParams,
  IndividualResultsResponse,
  SwimResult,
  SwimmerInfo,
  SwimmerStats,
  Person,
  APIResponse,
} from '../types.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const params = req.query as unknown as IndividualResultsParams

    // Validate required parameters
    if (!params.SwimmerID && (!params.FirstName || !params.LastName)) {
      const response: APIResponse<IndividualResultsResponse> = {
        success: false,
        error: {
          error: 'ValidationError',
          message: 'Either SwimmerID or (FirstName + LastName) is required',
        },
      }
      return res.status(400).json(response)
    }

    // Step 1: Find swimmer in People table
    let swimmer: Person | null = null
    let mergedFrom: string | undefined

    if (params.SwimmerID) {
      swimmer = await queryOne<Person>(
        'SELECT * FROM people WHERE SwimmerID = ?',
        [params.SwimmerID]
      )

      // Check for merged swimmer
      if (swimmer?.NewSwimmerID) {
        mergedFrom = swimmer.SwimmerID
        swimmer = await queryOne<Person>(
          'SELECT * FROM people WHERE SwimmerID = ?',
          [swimmer.NewSwimmerID]
        )
      }
    } else {
      // Search by name
      const whereClauses: string[] = ['FirstName = ?', 'LastName = ?']
      const whereParams: any[] = [params.FirstName, params.LastName]

      if (params.MI) {
        whereClauses.push('MI = ?')
        whereParams.push(params.MI)
      }
      if (params.Sex) {
        whereClauses.push('Sex = ?')
        whereParams.push(params.Sex)
      }

      swimmer = await queryOne<Person>(
        `SELECT * FROM people WHERE ${whereClauses.join(' AND ')} LIMIT 1`,
        whereParams
      )
    }

    if (!swimmer) {
      const response: APIResponse<IndividualResultsResponse> = {
        success: false,
        error: {
          error: 'NotFound',
          message: 'Swimmer not found',
        },
      }
      return res.status(404).json(response)
    }

    // Check privacy flags
    if (swimmer.HideResultsInfo) {
      const swimmerName = formatSwimmerName(
        swimmer.FirstName,
        swimmer.MI,
        swimmer.LastName,
        swimmer.HideMemberInfo
      )

      const swimmerInfo: SwimmerInfo = {
        SwimmerID: swimmer.SwimmerID,
        FirstName: swimmerName.firstName,
        MI: swimmerName.mi,
        LastName: swimmerName.lastName,
        FullName: swimmerName.fullName,
        Sex: swimmer.Sex || 'M',
        ClubAbbr: swimmer.ClubAbbr,
        Location: '',
        MemberSince: null,
        HideMemberInfo: swimmer.HideMemberInfo,
      }

      const response: APIResponse<IndividualResultsResponse> = {
        success: true,
        data: {
          swimmer: swimmerInfo,
          stats: {
            totalSwims: 0,
            podiumFinishes: 0,
            firstPlace: 0,
            uniqueMeets: 0,
            recordedSwims: 0,
          },
          results: [],
          resultsByCourse: {},
          totalResults: 0,
          hasPoolNotMeasured: false,
          mergedFrom,
        },
      }
      return res.json(response)
    }

    // Step 2: Build query for results
    // Note: Must use EventResultsSwimmersInSwims junction table like PHP does
    let sql = `
      SELECT
        s.SwimID,
        s.MeetID,
        s.SwimDate,
        s.EventNumber,
        s.Heat,
        s.Lane,
        s.Round,
        s.FinalTimeSec,
        s.Place,
        s.EventStatus,
        s.Distance,
        s.FixedTimeEventMinutes,
        s.SplitsAvailable,

        c.CompetitorID,
        c.FirstName,
        c.MI,
        c.LastName,
        c.Age,
        c.AgeGroupID,
        c.Sex,
        c.TeamAbbr,
        c.CompetitorStatus,

        m.MeetTitle,
        m.StartDate AS MeetDate,
        m.PoolMeasured,

        co.CourseAbbr,
        co.CourseName,

        st.StrokeShortName,

        ag.AgeGroup,

        (SELECT COUNT(*) FROM eventresultssplits WHERE SwimID = s.SwimID) AS NumSplits

      FROM eventresultsswimmers c
      LEFT JOIN eventresultsswimmersinswims sis ON c.CompetitorID = sis.CompetitorID
      LEFT JOIN eventresultsswims s ON s.SwimID = sis.SwimID
      LEFT JOIN meets m ON c.MeetID = m.MeetID
      LEFT JOIN courses co ON m.CourseID = co.CourseID
      LEFT JOIN strokes st ON s.StrokeID = st.StrokeID
      LEFT JOIN agegroups ag ON c.AgeGroupID = ag.AgeGroupID
      WHERE c.SwimmerID = ? AND s.IndRelay = 'I'
    `

    const queryParams: any[] = [swimmer.SwimmerID]

    // Apply filters
    if (params.CourseID) {
      sql += ' AND m.CourseID = ?'
      queryParams.push(params.CourseID)
    }
    if (params.Distance) {
      sql += ' AND s.Distance = ?'
      queryParams.push(params.Distance)
    }
    if (params.StrokeID) {
      sql += ' AND s.StrokeID = ?'
      queryParams.push(params.StrokeID)
    }
    if (params.lowage) {
      sql += ' AND c.Age >= ?'
      queryParams.push(params.lowage)
    }
    if (params.highage) {
      sql += ' AND c.Age <= ?'
      queryParams.push(params.highage)
    }

    // Filter out scratches/no shows unless requested
    if (!params.showScratch) {
      sql += " AND s.EventStatus NOT IN ('SCR', 'NS')"
    }

    // Apply sorting
    const sortOrder = params.srt || 'ageGrp'
    if (sortOrder === 'time') {
      sql += ' ORDER BY s.FinalTimeSec ASC'
    } else if (sortOrder === 'age') {
      sql += ' ORDER BY c.Age DESC, m.StartDate DESC'
    } else {
      sql += ' ORDER BY c.AgeGroupID DESC, m.StartDate DESC'
    }

    const rows = await query<any>(sql, queryParams)

    // Step 3: Transform results
    const swimmerName = formatSwimmerName(
      swimmer.FirstName,
      swimmer.MI,
      swimmer.LastName,
      swimmer.HideMemberInfo
    )

    const results: SwimResult[] = rows.map(row => ({
      SwimID: row.SwimID,
      MeetID: row.MeetID,
      MeetTitle: row.MeetTitle,
      MeetDate: row.MeetDate,
      SwimmerID: swimmer!.SwimmerID,
      FirstName: swimmerName.firstName,
      MI: swimmerName.mi,
      LastName: swimmerName.lastName,
      Age: row.Age,
      AgeGroup: row.AgeGroup,
      AgeGroupID: row.AgeGroupID,
      Sex: row.Sex,
      TeamAbbr: row.TeamAbbr,
      CompetitorStatus: row.CompetitorStatus,
      CourseAbbr: row.CourseAbbr,
      CourseName: row.CourseName,
      StrokeShortName: row.StrokeShortName,
      Distance: row.Distance,
      FixedTimeEventMinutes: row.FixedTimeEventMinutes,
      EventNumber: row.EventNumber,
      Heat: row.Heat,
      Lane: row.Lane,
      Round: row.Round,
      FinalTimeSec: row.FinalTimeSec,
      FinalTime: timeSecToDisplayTime(row.FinalTimeSec),
      Place: row.Place,
      EventStatus: row.EventStatus,
      PoolMeasured: row.PoolMeasured,
      SplitsAvailable: row.SplitsAvailable,
      NumSplits: row.NumSplits,
    }))

    // Step 4: Calculate stats
    const stats: SwimmerStats = {
      totalSwims: results.length,
      podiumFinishes: results.filter(r => r.Place > 0 && r.Place <= 3 && r.EventStatus === 'OK').length,
      firstPlace: results.filter(r => r.Place === 1 && r.EventStatus === 'OK').length,
      uniqueMeets: new Set(results.map(r => r.MeetID)).size,
      recordedSwims: results.filter(r => r.EventStatus === 'OK').length,
    }

    // Find best time (fastest swim)
    const validSwims = results.filter(r => r.EventStatus === 'OK' && r.FinalTimeSec > 0)
    if (validSwims.length > 0) {
      const bestSwim = validSwims.reduce((best, current) => {
        return current.FinalTimeSec < best.FinalTimeSec ? current : best
      })

      stats.bestTime = {
        event: `${bestSwim.Distance} ${bestSwim.StrokeShortName}`,
        time: bestSwim.FinalTime,
        timeSec: bestSwim.FinalTimeSec,
        meet: bestSwim.MeetTitle,
        meetID: bestSwim.MeetID,
        date: bestSwim.MeetDate,
      }
    }

    // Step 5: Group by course
    const resultsByCourse: { SCY?: SwimResult[]; SCM?: SwimResult[]; LCM?: SwimResult[] } = {}
    for (const result of results) {
      const course = result.CourseAbbr as 'SCY' | 'SCM' | 'LCM'
      if (!resultsByCourse[course]) {
        resultsByCourse[course] = []
      }
      resultsByCourse[course]!.push(result)
    }

    // Step 6: Build swimmer info
    const swimmerInfo: SwimmerInfo = {
      SwimmerID: swimmer.SwimmerID,
      FirstName: swimmerName.firstName,
      MI: swimmerName.mi,
      LastName: swimmerName.lastName,
      FullName: swimmerName.fullName,
      Sex: swimmer.Sex || 'M',
      ClubAbbr: swimmer.ClubAbbr,
      Location: '',
      MemberSince: null,
      HideMemberInfo: swimmer.HideMemberInfo,
    }

    // Step 7: Check for unmeasured pools
    const hasPoolNotMeasured = results.some(r => !r.PoolMeasured)

    const response: APIResponse<IndividualResultsResponse> = {
      success: true,
      data: {
        swimmer: swimmerInfo,
        stats,
        results,
        resultsByCourse,
        totalResults: results.length,
        hasPoolNotMeasured,
        mergedFrom,
      },
    }

    res.json(response)
  } catch (error) {
    console.error('Individual results error:', error)
    const response: APIResponse<IndividualResultsResponse> = {
      success: false,
      error: {
        error: 'ServerError',
        message: 'Failed to fetch individual results',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
    }
    res.status(500).json(response)
  }
})

export default router
