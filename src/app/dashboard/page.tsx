
import FocusDashboard from '@/components/FocusDashboard'
import GamificationElements from '@/components/GamificationElements'
import PomodoroTimer from '@/components/PomodoroTimer'
import { Providers } from '@/providers/provider'

export default function Home() {
  return (
    <Providers>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Time Management and Focus Tracker</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PomodoroTimer />
          <FocusDashboard />
        </div>
        <GamificationElements />
      </main>
    </Providers>
  )
}

