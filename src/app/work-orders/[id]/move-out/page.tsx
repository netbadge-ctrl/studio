
"use client"

import { useState } from 'react';
import { MainNav } from "@/components/main-nav";
import { DatacenterOpsDemo } from "@/components/datacenter-ops-demo";
import { workOrders, employees } from "@/lib/mock-data";

export default function MoveOutPage({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState(`搬出操作 #${params.id}`);
  const [showBackButton, setShowBackButton] = useState(true);
  const [backButtonLabel, setBackButtonLabel] = useState('返回准备页');
  const [handleBack, setHandleBack] = useState(() => () => {});

  const currentWorkOrder = workOrders.find(wo => wo.id === params.id);

  if (!currentWorkOrder) {
    return <div>工单未找到</div>;
  }
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <MainNav 
        title={title} 
        showBackButton={showBackButton}
        onBackClick={handleBack}
        backButtonLabel={backButtonLabel}
      />
      <main className="flex-1 bg-muted/40 p-4 md:p-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <DatacenterOpsDemo 
            initialWorkOrders={workOrders} 
            initialEmployees={employees}
            onTitleChange={setTitle}
            initialView={{ name: 'MOVE_OUT', workOrderId: params.id } as any}
            setShowBackButton={setShowBackButton}
            setBackButtonLabel={setBackButtonLabel}
            setHandleBack={setHandleBack}
          />
        </div>
      </main>
    </div>
  );
}
