'use client'

import { completeFocusSession } from '@/redux/features/focus/focusSlice'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

const FOCUS_TIME = 25 * 60
const BREAK_TIME = 5 * 60

export default function PomodoroTimer() {
  const [time, setTime] = useState(FOCUS_TIME)
  const [isActive, setIsActive] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)
  const dispatch = useDispatch()

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (time === 0) {
      if (!isBreak) {
        setSessionCount((prevCount) => prevCount + 1)
        dispatch(completeFocusSession())
        playNotificationSound()
        setIsBreak(true)
        setTime(BREAK_TIME)
      } else {
        setIsBreak(false)
        setTime(FOCUS_TIME)
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, time, isBreak, dispatch])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setIsBreak(false)
    setTime(FOCUS_TIME)
  }

  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3')
    audio.play()
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Pomodoro Timer</h2>
      <div className="text-6xl font-bold mb-6 text-center">{formatTime(time)}</div>
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={toggleTimer}
          className={`px-6 py-2 rounded-full ${
            isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          } text-white font-semibold`}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="px-6 py-2 rounded-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold"
        >
          Reset
        </button>
      </div>
      <div className="text-center">
        <p className="text-lg font-medium">
          {isBreak ? 'Break Time' : 'Focus Time'}
        </p>
        <p className="text-sm text-gray-600">
          Sessions Completed: {sessionCount}
        </p>
      </div>
    </div>
  )
}

