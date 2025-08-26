import { MainNav } from '@/components/main-nav';
import { LeaderDashboardClient } from '@/components/leader-dashboard-client';
import { workOrders, employees } from '@/lib/mock-data';

export default function LeaderDashboardPage() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <MainNav />
            <main className="flex-1 bg-muted/40 p-4 sm:px-6 sm:py-0 md:gap-8">
               <div className="max-w-7xl mx-auto py-6">
                 <header>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">
                        Leader Dashboard
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Monitor and assign all work orders.
                    </p>
                </header>
                <div className="mt-6">
                    <LeaderDashboardClient initialWorkOrders={workOrders} employees={employees} />
                </div>
               </div>
            </main>
        </div>
    )
}
