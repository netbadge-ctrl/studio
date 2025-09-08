"use client"

import { useState } from 'react';
import { MainNav } from "@/components/main-nav";
import { DatacenterOpsDemo } from "@/components/datacenter-ops-demo";
import { workOrders, employees } from "@/lib/mock-data";

export default function Home() {
  const [title, setTitle] = useState("我的工单");

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <MainNav title={title} />
      <main className="flex-1 bg-muted/40 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <DatacenterOpsDemo 
            initialWorkOrders={workOrders} 
            initialEmployees={employees}
            onTitleChange={setTitle}
          />
        </div>
      </main>
    </div>
  );
}
