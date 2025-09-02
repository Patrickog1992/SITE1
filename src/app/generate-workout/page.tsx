import { AuthGuard } from "@/components/auth-guard";
import { AppLayout } from "@/components/layout/app-layout";
import { WorkoutGenerator } from "./_components/workout-generator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";

export default function GenerateWorkoutPage() {
  return (
    <AuthGuard>
      <AppLayout>
        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight font-headline">Gerador de Treino IA</h2>
          </div>
          <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <BrainCircuit className="h-8 w-8 text-primary"/>
                    <div>
                        <CardTitle>Crie seu Treino Personalizado</CardTitle>
                        <CardDescription>Defina seu objetivo, selecione seus equipamentos e deixe nossa IA montar o treino perfeito para você.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <WorkoutGenerator />
            </CardContent>
          </Card>
        </main>
      </AppLayout>
    </AuthGuard>
  );
}
