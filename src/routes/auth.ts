import express from 'express'
import { Pool } from 'pg'
import { Logger } from 'winston'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default function(pool: Pool, logger: Logger) {
  const router = express.Router()

  router.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      const user = result.rows[0]
      const isValidPassword = await bcrypt.compare(password, user.password)

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '1d' })

      res.json({ token })
    } catch (error) {
      logger.error('Error during login:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  })

  return router
}

