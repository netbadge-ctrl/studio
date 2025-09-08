"use client"

import { useState } from 'react';
import { MainNav } from "@/components/main-nav";
import { DatacenterOpsDemo } from "@/components/datacenter-ops-demo";
import { workOrders, employees } from "@/lib/mock-data";
import { CardDescription } from '@/components/ui/card';

export default function LeaderDashboardPage() {
  const [title, setTitle] = useState("主管仪表盘");

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <MainNav title={title} />
      <main className="flex-1 bg-muted/40 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4">
            <p className="text-muted-foreground">监控并分配所有工单。</p>
          </div>
          <DatacenterOpsDemo 
            initialWorkOrders={workOrders} 
            initialEmployees={employees}
            onTitleChange={setTitle}
            initialView="LEADER_DASHBOARD"
          />
        </div>
      </main>
    </div>
  );
}
