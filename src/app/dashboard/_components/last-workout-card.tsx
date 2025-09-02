"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { Dumbbell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Workout = {
    id: string;
    goal: string;
    createdAt: {
        toDate: () => Date;
    };
    exercises: any[];
}

const goalTranslations: { [key: string]: string } = {
    hypertrophy: 'Hipertrofia',
    'weight loss': 'Emagrecimento',
    strength: 'Força'
};

export function LastWorkoutCard() {
    const { user } = useAuth();
    const [lastWorkout, setLastWorkout] = useState<Workout | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchLastWorkout = async () => {
            try {
                const q = query(
                    collection(db, "users", user.uid, "workouts"),
                    orderBy("createdAt", "desc"),
                    limit(1)
                );
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const workoutDoc = querySnapshot.docs[0];
                    setLastWorkout({ id: workoutDoc.id, ...workoutDoc.data() } as Workout);
                }
            } catch (error) {
                console.error("Error fetching last workout: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLastWorkout();
    }, [user]);

    if (loading) {
        return (
            <Card className="col-span-1 lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Último Treino
                    </CardTitle>
                    <Dumbbell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-6 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-1/3" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Último Treino
                </CardTitle>
                <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {lastWorkout ? (
                    <>
                        <div className="text-2xl font-bold font-headline capitalize">
                            {goalTranslations[lastWorkout.goal] || lastWorkout.goal}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Realizado em {lastWorkout.createdAt.toDate().toLocaleDateString('pt-BR')}
                        </p>
                        <Link href={`/workout/${lastWorkout.id}`} className="text-sm text-primary hover:underline mt-2 inline-block">
                            Ver detalhes
                        </Link>
                    </>
                ) : (
                    <p className="text-sm text-muted-foreground mt-2">Você ainda não completou nenhum treino. Que tal gerar um agora?</p>
                )}
            </CardContent>
        </Card>
    );
}
