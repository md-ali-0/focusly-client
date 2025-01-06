"use client";

import config from "@/config";
import { format } from "date-fns"; // For date formatting
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]; // Pie chart colors

export default function FocusDashboard() {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
    }, []);

    const currentDate = format(new Date(), "yyyy-MM-dd");

    const {
        data: metrics,
        isLoading,
        error,
    } = useQuery(
        ["focusMetrics", currentDate],
        async () => {
            if (!token) {
                throw new Error("Authorization token not available.");
            }

            const res = await fetch(`${config.host}/api/focus-metrics?date=${currentDate}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                cache: "no-store",
            });

            if (!res.ok) {
                throw new Error(`Error fetching data: ${res.statusText}`);
            }

            const result = await res.json();
            return result.data;
        },
        {
            enabled: !!token, // Run query only when the token is available
        }
    );

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{`Error fetching focus metrics`}</div>;

    // Daily metrics data for bar chart
    const dailyData = metrics?.daily.map(
        (day: { date: Date; totalFocusTime: number }) => ({
            name: day.date,
            focusTime: day.totalFocusTime / 60, // Convert minutes to hours
        })
    );

    // Weekly metrics data for pie chart
    const weeklyData = [
        {
            name: "Focus Time (min)",
            value: metrics?.weekly.totalFocusTime / 60,
        }, // Convert to hours
        { name: "Sessions Completed", value: metrics?.weekly.totalSessions },
    ];

    return (
        <div className="mt-8 bg-white p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4">Focus Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Daily Bar Chart */}
                <div className="h-64 mb-6">
                    <h3 className="text-xl font-medium mb-2">
                        Daily Focus Time
                    </h3>
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

                {/* Weekly Pie Chart */}
                <div className="h-64 mb-6">
                    <h3 className="text-xl font-medium mb-2">
                        Weekly Overview
                    </h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={weeklyData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                label
                            >
                                {weeklyData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Motivational Message */}
            <div className="text-center text-lg font-medium text-green-600 pt-5">
                {metrics?.motivationalMessage}
            </div>
        </div>
    );
}
