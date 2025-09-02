import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Target, BrainCircuit, Activity } from 'lucide-react';

const featureCards = [
  {
    icon: <Target className="w-8 h-8 text-primary" />,
    title: 'Treinos Personalizados',
    description: 'Receba planos de treino gerados por IA, adaptados ao seu objetivo: hipertrofia, emagrecimento ou força.',
  },
  {
    icon: <Dumbbell className="w-8 h-8 text-primary" />,
    title: 'Adaptação de Equipamentos',
    description: 'Não importa se você treina em casa ou na academia. Nossos treinos se ajustam aos equipamentos que você tem.',
  },
  {
    icon: <BrainCircuit className="w-8 h-8 text-primary" />,
    title: 'Diário de Carga Inteligente',
    description: 'Registre seus pesos e repetições. Acompanhe sua evolução com gráficos e veja sua força aumentar.',
  },
  {
    icon: <Activity className="w-8 h-8 text-primary" />,
    title: 'Foco Total',
    description: 'Use nosso timer de descanso integrado para manter a intensidade e o foco durante todo o seu treino.',
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Dumbbell className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold text-primary">FitFlow</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/signup">Criar Conta</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="relative py-20 md:py-32">
          <div
            aria-hidden="true"
            className="absolute inset-0 top-0 h-full w-full bg-background"
          />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground font-headline">
                Transforme seu corpo com treinos inteligentes
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
                FitFlow usa Inteligência Artificial para criar o plano de treino perfeito para você. Chega de adivinhar. É hora de evoluir.
              </p>
              <div className="mt-10">
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/signup">Comece Agora (É Grátis)</Link>
                </Button>
              </div>
            </div>
            <div className="mt-16">
              <div className="relative">
                <div className="absolute inset-0 h-1/2" />
                <div className="relative">
                  <Image
                    src="https://picsum.photos/1200/600"
                    alt="Pessoa se exercitando"
                    data-ai-hint="fitness workout"
                    width={1200}
                    height={600}
                    className="rounded-xl shadow-2xl mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 md:py-32 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-foreground font-headline">
                Tudo que você precisa para alcançar seus objetivos
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                FitFlow foi desenhado para ser seu parceiro de treino definitivo.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {featureCards.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-background">
                      {feature.icon}
                    </div>
                    <CardTitle className="mt-4 font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card border-t">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">&copy; {new Date().getFullYear()} FitFlow. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
