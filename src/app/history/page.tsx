import { AuthGuard } from "@/components/auth-guard";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";
import { WorkoutHistoryClient } from "./_components/workout-history-client";


export default function HistoryPage() {
    return (
        <AuthGuard>
            <AppLayout>
                <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                    <div className="flex items-center justify-between space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight font-headline">Histórico de Treinos</h2>
                    </div>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <History className="h-8 w-8 text-primary"/>
                                <div>
                                    <CardTitle>Sua Jornada Fitness</CardTitle>
                                    <CardDescription>Veja todos os seus treinos passados e acompanhe sua evolução.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                           <WorkoutHistoryClient />
                        </CardContent>
                    </Card>
                </main>
            </AppLayout>
        </AuthGuard>
    )
}