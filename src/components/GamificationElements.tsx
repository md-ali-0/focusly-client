"use client";

import config from "@/config";
import {
    AwaitedReactNode,
    JSXElementConstructor,
    Key,
    ReactElement,
    ReactNode,
    ReactPortal,
} from "react";
import { useQuery } from "react-query";

export default function GamificationElements() {
    const {
        data: streaks,
        isLoading,
        error,
    } = useQuery("streaks", async () => {
        const res = await fetch(
            `${config.host}/api/focus-metric/daily-metrics`
        );
        const result = await res.json();
        return result.data;
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching streaks</div>;

    const { currentStreak, longestStreak, badges } = streaks || {};

    return (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Your Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <h3 className="text-lg font-medium mb-2">Current Streak</h3>
                    <div className="text-3xl font-bold text-blue-600">
                        {currentStreak} days
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">Longest Streak</h3>
                    <div className="text-3xl font-bold text-green-600">
                        {longestStreak} days
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">Badges</h3>
                    <div className="flex flex-wrap gap-2">
                        {badges?.map(
                            (
                                badge:
                                    | string
                                    | number
                                    | bigint
                                    | boolean
                                    | ReactElement<
                                          unknown,
                                          | string
                                          | JSXElementConstructor<unknown>
                                      >
                                    | Iterable<ReactNode>
                                    | ReactPortal
                                    | Promise<AwaitedReactNode>
                                    | null
                                    | undefined,
                                index: Key | null | undefined
                            ) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                                >
                                    {badge}
                                </span>
                            )
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Streak Progress</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${(currentStreak / 30) * 100}%` }}
                    ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                    {currentStreak} days towards your next milestone (30 days)
                </p>
            </div>
        </div>
    );
}
