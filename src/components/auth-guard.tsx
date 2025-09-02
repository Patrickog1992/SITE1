'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Skeleton } from './ui/skeleton';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 p-8 space-y-8">
                <Skeleton className="h-10 w-48" />
                <div className="grid gap-4 md:grid-cols-2">
                    <Skeleton className="h-48" />
                    <Skeleton className="h-48" />
                </div>
                <Skeleton className="h-64" />
            </div>
        </div>
    );
  }

  return <>{children}</>;
}
