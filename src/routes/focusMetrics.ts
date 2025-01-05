import express from 'express'
import { Pool } from 'pg'
import { RedisClientType } from 'redis'
import { Logger } from 'winston'
import { Prometheus } from 'prom-client'
import { authenticateJWT } from '../middleware/auth'

export default function(pool: Pool, redisClient: RedisClientType, logger: Logger, metrics: Prometheus) {
  const router = express.Router()

  router.get('/', authenticateJWT, async (req, res) => {
    const userId = req.user.id

    try {
      // Fetch daily metrics from Redis
      const dailySessions = await redisClient.get(`user:${userId}:daily_sessions`)
      const dailyFocusTime = await redisClient.get(`user:${userId}:daily_focus_time`)

      // Fetch weekly metrics from PostgreSQL
      const weeklyResult = await pool.query(
        'SELECT COUNT(*) as total_sessions, SUM(duration) as total_focus_time FROM focus_sessions WHERE user_id = $1 AND timestamp > NOW() - INTERVAL \'7 days\'',
        [userId]
      )

      const weeklyMetrics = weeklyResult.rows[0]

      // Fetch daily breakdown for the past week
      const dailyBreakdownResult = await pool.query(
        'SELECT DATE(timestamp) as date, COUNT(*) as sessions, SUM(duration) as focus_time FROM focus_sessions WHERE user_id = $1 AND timestamp > NOW() - INTERVAL \'7 days\' GROUP BY DATE(timestamp) ORDER BY date',
        [userId]
      )

      const dailyBreakdown = dailyBreakdownResult.rows

      // Generate motivational message
      const motivationalMessage = generateMotivationalMessage(weeklyMetrics.total_sessions, weeklyMetrics.total_focus_time)

      res.json({
        daily: {
          sessions: parseInt(dailySessions || '0'),
          focusTime: parseInt(dailyFocusTime || '0')
        },
        weekly: {
          totalSessions: parseInt(weeklyMetrics.total_sessions),
          totalFocusTime: parseInt(weeklyMetrics.total_focus_time)
        },
        dailyBreakdown,
        motivationalMessage
      })

      // Update Prometheus metrics
      metrics.metricsRequests.inc()
    } catch (error) {
      logger.error('Error fetching focus metrics:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  })

  return router
}

function generateMotivationalMessage(sessions: number, focusTime: number): string {
  if (sessions > 20) {
    return "Incredible focus! You're making outstanding progress!"
  } else if (sessions > 10) {
    return "Great job staying consistent with your focus sessions!"
  } else if (sessions > 5) {
    return "You're building a solid foundation. Keep it up!"
  } else {
    return "Every focus session counts. You're on the right track!"
  }
}

