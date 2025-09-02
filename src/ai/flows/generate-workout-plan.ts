'use server';

/**
 * @fileOverview A workout plan generator AI agent.
 * 
 * - generateWorkoutPlan - A function that handles the workout plan generation process.
 * - GenerateWorkoutPlanInput - The input type for the generateWorkoutPlan function.
 * - GenerateWorkoutPlanOutput - The return type for the GenerateWorkoutPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWorkoutPlanInputSchema = z.object({
  goal: z
    .enum(['hypertrophy', 'weight loss', 'strength'])
    .describe('The fitness goal of the user.'),
  equipment: z
    .array(z.enum(['dumbbells', 'barbell', 'machine', 'bodyweight']))
    .describe('The equipment available to the user.'),
});
export type GenerateWorkoutPlanInput = z.infer<typeof GenerateWorkoutPlanInputSchema>;

const GenerateWorkoutPlanOutputSchema = z.object({
  exercises: z
    .array(
      z.object({
        name: z.string().describe('The name of the exercise.'),
        sets: z.number().describe('The number of sets for the exercise.'),
        reps: z.number().describe('The number of repetitions for the exercise.'),
      })
    )
    .describe('A list of exercises for the workout plan.'),
});
export type GenerateWorkoutPlanOutput = z.infer<typeof GenerateWorkoutPlanOutputSchema>;

export async function generateWorkoutPlan(
  input: GenerateWorkoutPlanInput
): Promise<GenerateWorkoutPlanOutput> {
  return generateWorkoutPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWorkoutPlanPrompt',
  input: {schema: GenerateWorkoutPlanInputSchema},
  output: {schema: GenerateWorkoutPlanOutputSchema},
  prompt: `You are a personal trainer who creates workout plans for users based on their goals and available equipment.

  The user's goal is: {{{goal}}}
  The user has the following equipment available: {{#each equipment}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Generate a simple workout plan with a list of exercises, sets, and reps, appropriate for the user's goal and equipment.
  Provide a variety of exercises so the user doesn't get bored.
  The output should be a JSON object.
  Do not explain the workout plan, only provide the JSON.`,
});

const generateWorkoutPlanFlow = ai.defineFlow(
  {
    name: 'generateWorkoutPlanFlow',
    inputSchema: GenerateWorkoutPlanInputSchema,
    outputSchema: GenerateWorkoutPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
