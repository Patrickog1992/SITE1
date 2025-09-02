'use client';
import {
    SidebarProvider,
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarInset,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dumbbell, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';

function getInitials(name: string | null | undefined) {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

export function AppLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await auth.signOut();
        router.push('/login');
    };

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <div className="flex items-center gap-2 p-2">
                        <Dumbbell className="w-8 h-8 text-primary" />
                        <span className="text-xl font-bold text-primary">FitFlow</span>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarNav />
                </SidebarContent>
            </Sidebar>
            <SidebarInset>
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                     <SidebarTrigger className="sm:hidden" />
                     <div className="flex-1"></div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="relative h-8 w-8 rounded-full"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} />
                                    <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user?.displayName}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Sair</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
