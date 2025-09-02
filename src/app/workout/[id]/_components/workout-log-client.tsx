'use client';

import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { updateWorkoutLog } from "@/actions/workout-actions";
import { Loader2 } from "lucide-react";
import { RestTimer } from "./rest-timer";
import { Badge } from "@/components/ui/badge";

type Exercise = {
    name: string;
    sets: number;
    reps: number;
    log?: { weight: number, reps: number }[];
}

type Workout = {
    id: string;
    goal: string;
    createdAt: { toDate: () => Date };
    exercises: Exercise[];
}

const logSchema = z.object({
    weight: z.preprocess(
      (a) => parseFloat(z.string().parse(a)),
      z.number().min(0, "Peso deve ser positivo")
    ),
    reps: z.preprocess(
      (a) => parseInt(z.string().parse(a), 10),
      z.number().int().min(1, "Repetições devem ser pelo menos 1")
    ),
});

export function WorkoutLogClient({ workoutId }: { workoutId: string }) {
    const { user } = useAuth();
    const [workout, setWorkout] = useState<Workout | null>(null);
    const [loading, setLoading] = useState(true);
    const [savingIndex, setSavingIndex] = useState<number | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (!user) return;

        const fetchWorkout = async () => {
            try {
                const docRef = doc(db, "users", user.uid, "workouts", workoutId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setWorkout({ id: docSnap.id, ...docSnap.data() } as Workout);
                } else {
                    toast({ variant: 'destructive', title: 'Erro', description: 'Treino não encontrado.' });
                }
            } catch (error) {
                console.error("Error fetching workout: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkout();
    }, [user, workoutId, toast]);
    
    const form = useForm<z.infer<typeof logSchema>>({
        resolver: zodResolver(logSchema),
        defaultValues: { weight: 0, reps: 0 }
    });

    async function handleLogSet(exerciseIndex: number, data: z.infer<typeof logSchema>) {
        if (!user) return;
        setSavingIndex(exerciseIndex);
        const result = await updateWorkoutLog(user.uid, workoutId, exerciseIndex, data);
        if (result.success) {
            toast({ title: 'Set registrado!', description: 'Continue assim!' });
            // Optimistically update UI
            const newWorkout = { ...workout! };
            if (!newWorkout.exercises[exerciseIndex].log) {
                newWorkout.exercises[exerciseIndex].log = [];
            }
            newWorkout.exercises[exerciseIndex].log!.push(data);
            setWorkout(newWorkout);
            form.reset({ weight: 0, reps: 0 });
        } else {
            toast({ variant: 'destructive', title: 'Erro', description: result.error });
        }
        setSavingIndex(null);
    }

    if (loading) {
        return <Skeleton className="h-96 w-full" />;
    }

    if (!workout) {
        return <p>Treino não encontrado.</p>;
    }

    return (
        <div className="space-y-4">
            <RestTimer />
            <Accordion type="single" collapsible className="w-full">
                {workout.exercises.map((exercise, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger>
                            <div className="flex justify-between items-center w-full pr-4">
                                <div>
                                    <p className="font-semibold text-lg">{exercise.name}</p>
                                    <p className="text-sm text-muted-foreground">{exercise.sets} séries x {exercise.reps} reps</p>
                                </div>
                                <Badge variant={exercise.log && exercise.log.length >= exercise.sets ? 'default' : 'secondary'}>
                                    {exercise.log?.length || 0}/{exercise.sets}
                                </Badge>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-4 p-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium">Sets Registrados:</h4>
                                    {exercise.log && exercise.log.length > 0 ? (
                                        <ul className="list-disc pl-5 text-muted-foreground">
                                            {exercise.log.map((log, logIndex) => (
                                                <li key={logIndex}>{log.weight} kg x {log.reps} reps</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Nenhum set registrado ainda.</p>
                                    )}
                                </div>

                                {(!exercise.log || exercise.log.length < exercise.sets) && (
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit((data) => handleLogSet(index, data))} className="flex items-end gap-4">
                                            <FormField
                                                control={form.control}
                                                name="weight"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Peso (kg)</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" step="0.5" {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="reps"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Reps</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit" disabled={savingIndex === index}>
                                                {savingIndex === index && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Registrar Set
                                            </Button>
                                        </form>
                                    </Form>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
