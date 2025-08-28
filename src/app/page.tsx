"use client"

import { MainNav } from "@/components/main-nav";
import { DatacenterOpsDemo } from "@/components/datacenter-ops-demo";
import { workOrders, employees } from "@/lib/mock-data";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <MainNav />
      <main className="flex-1 bg-muted/40 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <DatacenterOpsDemo initialWorkOrders={workOrders} initialEmployees={employees} />
        </div>
      </main>
    </div>
  );
}