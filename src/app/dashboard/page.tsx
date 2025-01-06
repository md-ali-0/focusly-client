import FocusDashboard from "@/components/FocusDashboard";
import GamificationElements from "@/components/GamificationElements";
import PomodoroTimer from "@/components/PomodoroTimer";
import Navbar from "@/components/shared/Navbar";

export default function Home() {
    return (
        <>
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <PomodoroTimer />
                    <FocusDashboard />
                </div>
                <GamificationElements />
            </main>
        </>
    );
}
