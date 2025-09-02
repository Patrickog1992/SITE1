'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { handleGenerateWorkout, saveWorkout } from '@/actions/workout-actions';
import { Loader2, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const workoutFormSchema = z.object({
  goal: z.enum(['hypertrophy', 'weight loss', 'strength'], {
    required_error: 'Você precisa selecionar um objetivo.',
  }),
  equipment: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'Você precisa selecionar pelo menos um equipamento.',
  }),
});

type WorkoutPlan = {
  exercises: {
    name: string;
    sets: number;
    reps: number;
  }[];
};

const equipmentOptions = [
  { id: 'dumbbells', label: 'Halteres' },
  { id: 'barbell', label: 'Barra' },
  { id: 'machine', label: 'Máquina' },
  { id: 'bodyweight', label: 'Peso Corporal' },
];

const goalOptions = [
    { value: 'hypertrophy', label: 'Hipertrofia' },
    { value: 'weight loss', label: 'Emagrecimento' },
    { value: 'strength', label: 'Força' },
]

export function WorkoutGenerator() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<WorkoutPlan | null>(null);
  const [formValues, setFormValues] = useState<{goal: string, equipment: string[]}| null>(null);

  const form = useForm<z.infer<typeof workoutFormSchema>>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      equipment: ['bodyweight'],
    },
  });

  async function onSubmit(data: z.infer<typeof workoutFormSchema>) {
    if (!user) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Você precisa estar logado.' });
      return;
    }

    setIsLoading(true);
    setGeneratedPlan(null);
    setFormValues(data);

    const result = await handleGenerateWorkout(user.uid, data as any);

    if (result.error) {
      toast({ variant: 'destructive', title: 'Limite Atingido', description: result.error });
    } else if (result.data) {
      setGeneratedPlan(result.data);
      toast({ title: 'Sucesso!', description: 'Seu treino foi gerado.' });
    }
    
    setIsLoading(false);
  }

  async function handleSaveWorkout() {
    if (!user || !generatedPlan || !formValues) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Nenhum treino para salvar.' });
        return;
    }
    setIsSaving(true);
    const result = await saveWorkout(user.uid, { ...formValues, exercises: generatedPlan.exercises });
    if (result.error) {
        toast({ variant: 'destructive', title: 'Erro ao Salvar', description: result.error });
    } else {
        toast({ title: 'Treino Salvo!', description: 'Seu novo treino está no seu histórico.' });
        setGeneratedPlan(null);
    }
    setIsSaving(false);
  }


  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-semibold">Gerando seu treino...</p>
            <p className="text-muted-foreground">Nossa IA está montando o plano perfeito para você.</p>
        </div>
    )
  }

  if (generatedPlan) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className='font-headline'>Seu Novo Treino!</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {generatedPlan.exercises.map((exercise, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                            <p className="font-semibold">{exercise.name}</p>
                            <p className="text-sm text-muted-foreground">{exercise.sets} séries x {exercise.reps} repetições</p>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 mt-6">
                    <Button onClick={handleSaveWorkout} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className='mr-2 h-4 w-4' />}
                        Salvar Treino
                    </Button>
                     <Button variant="outline" onClick={() => setGeneratedPlan(null)}>
                        Gerar Outro
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="goal"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className='text-lg font-semibold'>1. Qual seu objetivo?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                    {goalOptions.map(option => (
                        <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                            <RadioGroupItem value={option.value} />
                            </FormControl>
                            <FormLabel className="font-normal">{option.label}</FormLabel>
                        </FormItem>
                    ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Separator />

        <FormField
          control={form.control}
          name="equipment"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-lg font-semibold">2. Quais equipamentos você tem?</FormLabel>
                <FormDescription>
                  Selecione todos que se aplicam.
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {equipmentOptions.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="equipment"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Gerar Treino</Button>
      </form>
    </Form>
  );
}
