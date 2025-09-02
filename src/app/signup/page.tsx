import Link from 'next/link';
import { AuthForm } from '@/components/auth/auth-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <Dumbbell className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary">FitFlow</span>
          </Link>
          <CardTitle className="text-2xl font-headline">Crie sua conta</CardTitle>
          <CardDescription>Comece sua jornada fitness hoje mesmo</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="signup" />
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{' '}
            <Link href="/login" className="underline text-primary">
              Faça login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
