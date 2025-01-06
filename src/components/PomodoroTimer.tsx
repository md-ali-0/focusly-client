/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import config from "@/config";
import {
    pauseTimer,
    resetTimer,
    startTimer,
    toggleBreak,
    updateTotalMetrics,
} from "@/redux/features/focus/focusSlice";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function PomodoroTimer() {
    const dispatch = useDispatch();
    const { isRunning, remainingTime, totalSessions, totalFocusTime, isBreak } =
        useSelector((state: RootState) => state.focus);

    const WORK_TIME = 25 * 60;
    const BREAK_TIME = 5 * 60;

    const playNotificationSound = () => {
        const audio = new Audio("/notification.wav");
        audio.play();
    };
    const [token, setToken] = useState<string>("");

    const fetchTotalMetrics = async () => {
        try {
            const response = await fetch(`${config.host}/api/focus-session`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                cache: "no-store",
            });
            if (response.ok) {
                const data = await response.json();
                dispatch(
                    updateTotalMetrics({
                        totalSessions: data?.data?.totalSessions || 0,
                        totalFocusTime: data?.data?.totalFocusTime || 0,
                    })
                );
            }
        } catch (error) {
            console.error("Error fetching session metrics:", error);
        }
    };

    const postCompletedSession = async (duration: number) => {
        try {
            const response = await fetch(`${config.host}/api/focus-session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify({
                    duration,
                }),
                cache: "no-store",
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Session logged:", data);
            } else {
                console.error("Failed to log session.");
            }
        } catch (error) {
            console.error("Error posting completed session:", error);
        }
    };

    const handleStart = () => {
        // Dispatch the current remaining time to start/resume
        dispatch(startTimer(remainingTime));
    };

    const handlePause = () => {
        dispatch(pauseTimer());
    };

    const handleReset = () => {
        dispatch(resetTimer());
        dispatch(toggleBreak(false));
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isRunning && remainingTime > 0) {
            interval = setInterval(() => {
                dispatch(startTimer(remainingTime - 1));
            }, 1000);
        } else if (remainingTime === 0 && isRunning) {
            if (!isBreak) {
                dispatch(toggleBreak(true));
                playNotificationSound();
                fetchTotalMetrics();
                postCompletedSession(WORK_TIME);
                dispatch(startTimer(BREAK_TIME));
            } else {
                dispatch(toggleBreak(false));
                fetchTotalMetrics();
                dispatch(startTimer(WORK_TIME));
                playNotificationSound();
            }
            handlePause();
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, remainingTime, dispatch, isBreak]);

    useEffect(() => {
        const storedToken = localStorage.getItem("token") || "";
        setToken(storedToken);
    }, []);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
            .toString()
            .padStart(2, "0")}`;
    };

    return (
        <div className="bg-white p-8 rounded-lg border">
            <h2 className="text-3xl font-semibold mb-4 text-center">
                {isBreak ? "Break Time" : "Pomodoro Timer"}
            </h2>
            <div className="text-6xl font-bold mb-6 text-center">
                {formatTime(remainingTime)}
            </div>
            <div className="flex justify-center space-x-4 mb-6">
                {isRunning ? (
                    <button
                        onClick={handlePause}
                        className="px-6 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold"
                    >
                        Pause
                    </button>
                ) : (
                    <button
                        onClick={handleStart}
                        className="px-6 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold"
                    >
                        Start
                    </button>
                )}
                <button
                    onClick={handleReset}
                    className="px-6 py-2 rounded-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold"
                >
                    Reset
                </button>
            </div>
            <div className="text-center">
                <p className="text-lg font-medium">
                    Sessions Completed: {totalSessions}
                </p>
                <p className="text-lg font-medium">
                    Total Focus Time: {formatTime(totalFocusTime)}
                </p>
            </div>
        </div>
    );
}
