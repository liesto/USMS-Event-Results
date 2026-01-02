/**
 * USMS Event Results API Server
 * TypeScript/Node.js POC
 */

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { testConnection } from './config/database.js'
import { errorHandler, notFoundHandler } from './middleware/error-handler.js'
import referenceDataRouter from './routes/reference-data.js'
import individualResultsRouter from './routes/individual-results.js'
import topTimesRouter from './routes/top-times.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/reference-data', referenceDataRouter)
app.use('/api/individual-results', individualResultsRouter)
app.use('/api/top-times', topTimesRouter)

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

// Start server
async function startServer() {
  try {
    // Test database connection
    await testConnection()

    app.listen(PORT, () => {
      console.log(`\n🚀 USMS Event Results API Server`)
      console.log(`📡 Running on http://localhost:${PORT}`)
      console.log(`🌍 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`)
      console.log(`💾 Database: ${process.env.DB_NAME || 'usms_main'}`)
      console.log(`\nAvailable endpoints:`)
      console.log(`  GET /health`)
      console.log(`  GET /api/reference-data`)
      console.log(`  GET /api/individual-results?SwimmerID=...`)
      console.log(`  GET /api/top-times?CourseID=...&StrokeID=...&Distance=...&AgeGroupID=...&Sex=...`)
      console.log(`\nPress Ctrl+C to stop\n`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
