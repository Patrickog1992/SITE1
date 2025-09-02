import { AuthGuard } from "@/components/auth-guard";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Activity } from "lucide-react";
import Link from "next/link";
import { LastWorkoutCard } from "./_components/last-workout-card";
import { WelcomeHeader } from "./_components/welcome-header";

export default function DashboardPage() {
    return (
        <AuthGuard>
            <AppLayout>
                <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                    <WelcomeHeader />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Gerar Treino
                                </CardTitle>
                                <PlusCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground mb-4">
                                    Crie um novo plano de treino personalizado com IA.
                                </p>
                                <Button asChild size="sm">
                                    <Link href="/generate-workout">Gerar Novo Treino</Link>
                                </Button>
                            </CardContent>
                        </Card>
                        <LastWorkoutCard />
                        <Card>
                             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Ver Histórico
                                </CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                             <CardContent>
                                <p className="text-xs text-muted-foreground mb-4">
                                    Acompanhe seu progresso e veja treinos passados.
                                </p>
                                <Button asChild size="sm" variant="outline">
                                    <Link href="/history">Ver Histórico</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid gap-4">
                         <Card>
                            <CardHeader>
                                <CardTitle>Em breve...</CardTitle>
                                <CardDescription>Funcionalidades futuras para turbinar seus resultados.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                    <li>Gráficos de progressão de carga detalhados.</li>
                                    <li>Compartilhamento de treinos com amigos.</li>
                                    <li>Biblioteca de exercícios com vídeos.</li>
                                    <li>Metas e conquistas personalizadas.</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </AppLayout>
        </AuthGuard>
    )
}
