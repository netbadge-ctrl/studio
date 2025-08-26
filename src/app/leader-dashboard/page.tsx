import { MainNav } from '@/components/main-nav';
import { LeaderDashboardClient } from '@/components/leader-dashboard-client';
import { workOrders, employees } from '@/lib/mock-data';

export default function LeaderDashboardPage() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <MainNav />
            <main className="flex-1 bg-muted/40 p-4 md:p-6">
               <div className="max-w-7xl mx-auto">
                 <header>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                        主管仪表盘
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        监控并分配所有工单。
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
