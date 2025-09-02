"use client"

import { useAuth } from "@/context/auth-context"
import { db } from "@/lib/firebase"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

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

export function WorkoutHistoryClient() {
    const { user } = useAuth();
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchWorkouts = async () => {
            try {
                const q = query(
                    collection(db, "users", user.uid, "workouts"),
                    orderBy("createdAt", "desc")
                );
                const querySnapshot = await getDocs(q);
                const workoutsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Workout));
                setWorkouts(workoutsData);
            } catch (error) {
                console.error("Error fetching workouts: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkouts();
    }, [user]);

    if (loading) {
        return (
            <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        )
    }

    if (workouts.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-muted-foreground">Você ainda não tem nenhum treino salvo.</p>
                <Button asChild className="mt-4">
                    <Link href="/generate-workout">Gerar meu primeiro treino</Link>
                </Button>
            </div>
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Objetivo</TableHead>
                    <TableHead>Exercícios</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {workouts.map(workout => (
                    <TableRow key={workout.id}>
                        <TableCell>{workout.createdAt.toDate().toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                            <Badge variant="secondary" className="capitalize">{goalTranslations[workout.goal] || workout.goal}</Badge>
                        </TableCell>
                        <TableCell>{workout.exercises.length}</TableCell>
                        <TableCell className="text-right">
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/workout/${workout.id}`}>Ver / Registrar</Link>
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
