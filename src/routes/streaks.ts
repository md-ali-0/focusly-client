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
      // Fetch streak data from PostgreSQL
      const result = await pool.query(
        'SELECT current_streak, longest_streak FROM user_streaks WHERE user_id = $1',
        [userId]
      )

      if (result.rows.length === 0) {
        return res.json({ currentStreak: 0, longestStreak: 0, badges: [] })
      }

      const { current_streak, longest_streak } = result.rows[0]

      // Calculate badges
      const badges = calculateBadges(current_streak, longest_streak)

      res.json({
        currentStreak: current_streak,
        longestStreak: longest_streak,
        badges
      })

      // Update Prometheus metrics
      metrics.streakRequests.inc()
    } catch (error) {
      logger.error('Error fetching streaks:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  })

  return router
}

function calculateBadges(currentStreak: number, longestStreak: number): string[] {
  const badges = []

  if (currentStreak >= 3) badges.push('3-Day Streak')
  if (currentStreak >= 7) badges.push('7-Day Streak')
  if (currentStreak >= 30) badges.push('30-Day Streak')
  if (longestStreak >= 100) badges.push('100-Day Legend')

  return badges
}

