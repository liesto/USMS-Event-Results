/**
 * Reference Data API Route
 * GET /api/reference-data
 */

import { Router } from 'express'
import { query } from '../config/database.js'
import type { Course, Stroke, AgeGroup, ReferenceData, APIResponse } from '../types.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    // Fetch all reference data in parallel
    const [courses, strokes, ageGroups] = await Promise.all([
      query<Course>('SELECT * FROM courses WHERE CourseType = ? ORDER BY CourseID', ['pool']),
      query<Stroke>('SELECT StrokeID, StrokeShortName, StrokeName as StrokeLongName FROM strokes ORDER BY StrokeID'),
      query<AgeGroup>('SELECT * FROM agegroups ORDER BY MinAge'),
    ])

    // Get available distances from events
    const distanceRows = await query<{ Distance: number }>(
      'SELECT DISTINCT Distance FROM eventresultsswims WHERE Distance > 0 ORDER BY Distance'
    )
    const distances = distanceRows.map(row => row.Distance)

    // Get available seasons (last 10 years)
    const currentYear = new Date().getFullYear()
    const seasons: string[] = []
    for (let i = 0; i < 10; i++) {
      const startYear = currentYear - i
      const endYear = startYear + 1
      seasons.push(`${startYear}-${endYear}`)
    }

    const referenceData: ReferenceData = {
      courses,
      strokes,
      ageGroups,
      distances,
      seasons,
    }

    const response: APIResponse<ReferenceData> = {
      success: true,
      data: referenceData,
    }

    res.json(response)
  } catch (error) {
    console.error('Reference data error:', error)
    const response: APIResponse<ReferenceData> = {
      success: false,
      error: {
        error: 'DatabaseError',
        message: 'Failed to fetch reference data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
    }
    res.status(500).json(response)
  }
})

export default router
