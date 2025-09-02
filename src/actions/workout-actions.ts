'use server';

import { generateWorkoutPlan } from '@/ai/flows/generate-workout-plan';
import { auth, db } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';

type GenerateWorkoutInput = {
  goal: 'hypertrophy' | 'weight loss' | 'strength';
  equipment: ('dumbbells' | 'barbell' | 'machine' | 'bodyweight')[];
};

export async function handleGenerateWorkout(userId: string, input: GenerateWorkoutInput) {
  try {
    const userDocRef = db.collection('users').doc(userId);
    const userDoc = await userDocRef.get();
    
    if (!userDoc.exists) {
      return { error: 'Usuário não encontrado.' };
    }
    
    const userData = userDoc.data();
    const workoutCount = userData?.workoutCount || 0;

    if (workoutCount >= 3) {
      return { error: 'Você atingiu o limite de 3 treinos gratuitos. Assine para treinos ilimitados!' };
    }

    const workoutPlan = await generateWorkoutPlan(input);

    // Increment workout count
    await userDocRef.update({
      workoutCount: workoutCount + 1,
    });

    return { data: workoutPlan };
  } catch (error: any) {
    return { error: `Falha ao gerar treino: ${error.message}` };
  }
}

type WorkoutData = {
    goal: string;
    equipment: string[];
    exercises: { name: string; sets: number; reps: number; log?: { weight: number, reps: number }[] }[];
}

export async function saveWorkout(userId: string, workoutData: WorkoutData) {
    try {
        const userWorkoutsRef = db.collection('users').doc(userId).collection('workouts');
        await userWorkoutsRef.add({
            ...workoutData,
            createdAt: new Date(),
        });

        revalidatePath('/dashboard');
        revalidatePath('/history');
        
        return { success: true };
    } catch (error: any) {
        return { error: `Falha ao salvar treino: ${error.message}` };
    }
}

export async function updateWorkoutLog(userId: string, workoutId: string, exerciseIndex: number, newLog: { weight: number, reps: number }) {
    try {
        const workoutRef = db.collection('users').doc(userId).collection('workouts').doc(workoutId);
        const workoutDoc = await workoutRef.get();

        if (!workoutDoc.exists) {
            return { error: 'Treino não encontrado.' };
        }

        const workoutData = workoutDoc.data() as any;
        const exercises = workoutData.exercises;

        if (!exercises[exerciseIndex].log) {
            exercises[exerciseIndex].log = [];
        }

        exercises[exerciseIndex].log.push(newLog);

        await workoutRef.update({ exercises });
        revalidatePath(`/workout/${workoutId}`);
        return { success: true };

    } catch(error: any) {
        return { error: `Falha ao salvar o log: ${error.message}` };
    }
}