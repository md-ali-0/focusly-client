"use client";

import config from "@/config";
import { useQuery } from "react-query";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

export default function FocusDashboard() {
    const {
        data: metrics,
        isLoading,
        error,
    } = useQuery("focusMetrics", async () => {
        const res = await fetch(`${config.host}/api/focus-metric/daily-metrics`)
        const result = await res.json()
        return result.data
    });



    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching focus metrics</div>;

    const dailyData = metrics?.daily.map(
        (day: { date: Date; totalFocusTime: number }) => ({
            name: day.date,
            focusTime: day.totalFocusTime / 60, // Convert minutes to hours
        })
    );

    const totalFocusTime = metrics?.weekly.totalFocusTime || 0;
    const totalSessions = metrics?.weekly.totalSessions || 0;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Focus Dashboard</h2>
            <div className="mb-6">
                <p className="text-lg font-medium">Weekly Summary</p>
                <p>
                    Total Focus Time: {(totalFocusTime / 60).toFixed(2)} hours
                </p>
                <p>Sessions Completed: {totalSessions}</p>
            </div>
            <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="focusTime" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="text-center text-lg font-medium text-green-600">
                {metrics?.motivationalMessage}
            </div>
        </div>
    );
}
