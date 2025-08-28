"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { Building, User, GanttChartSquare, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
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

  const navLinks = (
    // Wrap buttons in a div to ensure SheetClose has a single valid child element.
    <div>
      <Button asChild variant="ghost" size="sm" className={cn("w-full justify-start text-muted-foreground", {"text-primary font-semibold bg-accent": pathname === '/'})}>
        <Link href="/" className="flex items-center gap-2">
          <GanttChartSquare className="h-4 w-4" /> 我的任务
        </Link>
      </Button>
      <Button asChild variant="ghost" size="sm" className={cn("w-full justify-start text-muted-foreground", {"text-primary font-semibold bg-accent": pathname === '/leader-dashboard'})}>
        <Link href="/leader-dashboard" className="flex items-center gap-2">
          <User className="h-4 w-4" /> 主管仪表盘
        </Link>
      </Button>
    </div>
  );

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary">
        <Building className="h-6 w-6" />
        <span className="font-bold hidden sm:inline-block">数据中心运维</span>
      </Link>
      <nav className="hidden md:flex items-center gap-2 mx-auto">
        {navLinks}
      </nav>
      <div className="ml-auto flex items-center gap-2">
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
                <p className="text-sm font-medium leading-none">爱丽丝</p>
                <p className="text-xs leading-none text-muted-foreground">
                  alice.j@idccorp.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>个人资料</DropdownMenuItem>
            <DropdownMenuItem>设置</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>登出</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">切换导航菜单</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader className="sr-only">
                  <SheetTitle>导航</SheetTitle>
                  <SheetDescription>应用主导航菜单</SheetDescription>
                </SheetHeader>
                <nav className="grid gap-4 text-lg font-medium mt-8">
                  <SheetClose asChild>
                    {navLinks}
                  </SheetClose>
                </nav>
            </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
