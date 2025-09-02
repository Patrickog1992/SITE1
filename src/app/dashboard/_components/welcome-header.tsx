"use client"

import { useAuth } from "@/context/auth-context"

export function WelcomeHeader() {
    const { user } = useAuth();
    
    return (
        <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight font-headline">
                Olá, {user?.displayName?.split(' ')[0] || 'Guerreiro(a)'}!
            </h2>
        </div>
    )
}