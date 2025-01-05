import express from 'express'
import { Pool } from 'pg'
import { RedisClientType } from 'redis'
import { Logger } from 'winston'
import { Prometheus } from 'prom-client'
import { authenticateJWT } from '../middleware/auth'

export default function(pool: Pool, redisClient: RedisClientType, logger: Logger, metrics: Prometheus) {
  const router = express.Router()

  router.post('/', authenticateJWT, async (req, res) => {
    const { duration } = req.body
    const userId = req.user.id

    try {
      const result = await pool.query(
        'INSERT INTO focus_sessions (user_id, duration, timestamp) VALUES ($1, $2, NOW()) RETURNING *',
        [userId, duration]
      )

      // Update Redis cache
      await redisClient.incr(`user:${userId}:daily_sessions`)
      await redisClient.incrBy(`user:${userId}:daily_focus_time`, duration)

      // Update Prometheus metrics
      metrics.focusSessionsCompleted.inc()
      metrics.totalFocusTime.inc(duration)

      res.status(201).json(result.rows[0])
    } catch (error) {
      logger.error('Error logging focus session:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  })

  return router
}

