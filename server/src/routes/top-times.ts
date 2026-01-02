/**
 * Top Times API Route
 * GET /api/top-times
 */

import { Router } from 'express'
import { query, queryOne } from '../config/database.js'
import { timeSecToDisplayTime } from '../utils/time-utils.js'
import type {
  TopTimesParams,
  TopTimesResponse,
  TopTimeEntry,
  Course,
  Stroke,
  AgeGroup,
  APIResponse,
} from '../types.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const params = req.query as unknown as TopTimesParams

    // Validate required parameters
    if (!params.CourseID || !params.StrokeID || !params.Distance || !params.AgeGroupID || !params.Sex) {
      const response: APIResponse<TopTimesResponse> = {
        success: false,
        error: {
          error: 'ValidationError',
          message: 'CourseID, StrokeID, Distance, AgeGroupID, and Sex are required',
        },
      }
      return res.status(400).json(response)
    }

    // Parse numeric parameters
    const courseID = Number(params.CourseID)
    const strokeID = Number(params.StrokeID)
    const distance = Number(params.Distance)
    const ageGroupID = Number(params.AgeGroupID)
    const limit = Number(params.limit) || 100
    const offset = Number(params.offset) || 0

    // Validate limit
    if (limit > 1000) {
      const response: APIResponse<TopTimesResponse> = {
        success: false,
        error: {
          error: 'ValidationError',
          message: 'Limit cannot exceed 1000',
        },
      }
      return res.status(400).json(response)
    }

    // Step 1: Fetch event metadata
    const [course, stroke, ageGroup] = await Promise.all([
      queryOne<Course>('SELECT * FROM courses WHERE CourseID = ?', [courseID]),
      queryOne<Stroke>('SELECT * FROM strokes WHERE StrokeID = ?', [strokeID]),
      queryOne<AgeGroup>('SELECT * FROM agegroups WHERE AgeGroupID = ?', [ageGroupID]),
    ])

    if (!course || !stroke || !ageGroup) {
      const response: APIResponse<TopTimesResponse> = {
        success: false,
        error: {
          error: 'NotFound',
          message: 'Invalid event parameters (course, stroke, or age group not found)',
        },
      }
      return res.status(404).json(response)
    }

    // Step 2: Build query for top times
    let sql = `
      SELECT
        s.SwimID,
        s.SwimmerID,
        s.FinalTimeSec,
        s.MeetID,

        c.FirstName,
        c.MI,
        c.LastName,
        c.Age,
        c.TeamAbbr,
        c.LMSCID,

        m.MeetTitle,
        m.StartDate AS MeetDate,
        m.PoolMeasured,

        l.Abbr as LMSCAbbr

      FROM eventresultsswims s
      INNER JOIN eventresultsswimmers c ON s.CompetitorID = c.CompetitorID
      INNER JOIN meets m ON s.MeetID = m.MeetID
      LEFT JOIN lmscs l ON c.LMSCID = l.LMSCID
      WHERE
        m.CourseID = ? AND
        s.StrokeID = ? AND
        s.Distance = ? AND
        c.AgeGroupID = ? AND
        s.IndRelay = 'I' AND
        s.EventStatus = 'OK' AND
        s.FinalTimeSec > 0
    `

    const queryParams: any[] = [courseID, strokeID, distance, ageGroupID]

    // Filter by sex
    if (params.Sex !== 'A') {
      sql += ' AND c.Sex = ?'
      queryParams.push(params.Sex)
    }

    // Filter by LMSC region
    if (params.LMSCID) {
      sql += ' AND c.LMSCID = ?'
      queryParams.push(Number(params.LMSCID))
    }

    // Filter by season
    if (params.Season) {
      const [startYear, endYear] = params.Season.split('-').map(Number)
      if (startYear && endYear) {
        sql += ' AND m.StartDate BETWEEN ? AND ?'
        queryParams.push(`${startYear}-09-01`, `${endYear}-08-31`)
      }
    }

    // Sort by time and apply pagination
    sql += ' ORDER BY s.FinalTimeSec ASC LIMIT ? OFFSET ?'
    queryParams.push(limit, offset)

    const rows = await query<any>(sql, queryParams)

    // Step 3: Transform results
    const times: TopTimeEntry[] = rows.map((row, index) => ({
      rank: offset + index + 1,
      SwimmerID: row.SwimmerID,
      FirstName: row.FirstName,
      MI: row.MI || '',
      LastName: row.LastName,
      Age: row.Age,
      TeamAbbr: row.TeamAbbr,
      LMSCID: row.LMSCID,
      LMSCAbbr: row.LMSCAbbr || '',
      FinalTimeSec: row.FinalTimeSec,
      FinalTime: timeSecToDisplayTime(row.FinalTimeSec),
      MeetID: row.MeetID,
      MeetTitle: row.MeetTitle,
      MeetDate: row.MeetDate,
      PoolMeasured: row.PoolMeasured,
    }))

    // Step 4: Get total count for pagination
    let countSql = `
      SELECT COUNT(*) AS total
      FROM eventresultsswims s
      INNER JOIN eventresultsswimmers c ON s.CompetitorID = c.CompetitorID
      INNER JOIN meets m ON s.MeetID = m.MeetID
      WHERE
        m.CourseID = ? AND
        s.StrokeID = ? AND
        s.Distance = ? AND
        c.AgeGroupID = ? AND
        s.IndRelay = 'I' AND
        s.EventStatus = 'OK' AND
        s.FinalTimeSec > 0
    `

    const countParams: any[] = [courseID, strokeID, distance, ageGroupID]

    if (params.Sex !== 'A') {
      countSql += ' AND c.Sex = ?'
      countParams.push(params.Sex)
    }

    if (params.LMSCID) {
      countSql += ' AND c.LMSCID = ?'
      countParams.push(Number(params.LMSCID))
    }

    if (params.Season) {
      const [startYear, endYear] = params.Season.split('-').map(Number)
      if (startYear && endYear) {
        countSql += ' AND m.StartDate BETWEEN ? AND ?'
        countParams.push(`${startYear}-09-01`, `${endYear}-08-31`)
      }
    }

    const countResult = await queryOne<{ total: number }>(countSql, countParams)
    const totalCount = countResult?.total || 0

    const response: APIResponse<TopTimesResponse> = {
      success: true,
      data: {
        event: {
          CourseAbbr: course.CourseAbbr,
          CourseName: course.CourseName,
          StrokeShortName: stroke.StrokeShortName,
          Distance: distance,
          AgeGroup: ageGroup.AgeGroup,
          Sex: params.Sex,
        },
        times,
        totalCount,
        season: params.Season,
        generatedAt: new Date().toISOString(),
      },
    }

    res.json(response)
  } catch (error) {
    console.error('Top times error:', error)
    const response: APIResponse<TopTimesResponse> = {
      success: false,
      error: {
        error: 'ServerError',
        message: 'Failed to fetch top times',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
    }
    res.status(500).json(response)
  }
})

export default router
