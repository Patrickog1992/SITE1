'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export function RestTimer() {
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            if(intervalRef.current) clearInterval(intervalRef.current);
            // Optional: Play a sound
            new Audio('/alarm.mp3').play().catch(e => console.log("Audio play failed"));
        }
        return () => {
            if(intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, timeLeft]);
    
    const startTimer = (seconds: number) => {
        if(intervalRef.current) clearInterval(intervalRef.current);
        setTimeLeft(seconds);
        setIsActive(true);
    };

    const stopTimer = () => {
        if(intervalRef.current) clearInterval(intervalRef.current);
        setIsActive(false);
        setTimeLeft(0);
    }
    
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Card className="mb-4 bg-secondary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Timer className="h-5 w-5"/>
                    Timer de Descanso
                </CardTitle>
                <div className="text-2xl font-mono font-bold text-primary">
                    {formatTime(timeLeft)}
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2">
                    <Button size="sm" onClick={() => startTimer(60)} disabled={isActive}>60s</Button>
                    <Button size="sm" onClick={() => startTimer(90)} disabled={isActive}>90s</Button>
                    <Button size="sm" onClick={() => startTimer(120)} disabled={isActive}>120s</Button>
                    {isActive && <Button size="sm" variant="destructive" onClick={stopTimer}>Parar</Button>}
                </div>
            </CardContent>
        </Card>
    )
}
