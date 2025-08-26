"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { Building, User, GanttChartSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export function MainNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary">
        <Building className="h-6 w-6" />
        <span className="font-bold">IDC Ops Manager</span>
      </Link>
      <nav className="hidden md:flex items-center gap-2 mx-auto">
        <Button asChild variant="ghost" size="sm" className={cn("text-muted-foreground", {"text-primary font-semibold": pathname === '/'})}>
          <Link href="/" className="flex items-center gap-2">
            <GanttChartSquare className="h-4 w-4" /> My Tasks
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className={cn("text-muted-foreground", {"text-primary font-semibold": pathname === '/leader-dashboard'})}>
          <Link href="/leader-dashboard" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Leader Dashboard
          </Link>
        </Button>
      </nav>
      <div className="ml-auto">
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="@shadcn" />
                <AvatarFallback>AJ</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Alice Johnson</p>
                <p className="text-xs leading-none text-muted-foreground">
                  alice.j@idccorp.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
