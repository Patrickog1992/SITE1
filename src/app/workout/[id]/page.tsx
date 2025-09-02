import { AuthGuard } from "@/components/auth-guard";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";
import { WorkoutLogClient } from "./_components/workout-log-client";

type WorkoutPageProps = {
    params: {
        id: string;
    }
}

export default function WorkoutPage({ params }: WorkoutPageProps) {
    const { id } = params;

    return (
        <AuthGuard>
            <AppLayout>
                <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                    <Card>
                        <CardHeader>
                             <div className="flex items-center gap-4">
                                <Dumbbell className="h-8 w-8 text-primary"/>
                                <div>
                                    <CardTitle className="font-headline">Hora do Treino!</CardTitle>
                                    <CardDescription>Registre seu progresso para cada exercício.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <WorkoutLogClient workoutId={id} />
                        </CardContent>
                    </Card>
                </main>
            </AppLayout>
        </AuthGuard>
    )
}
