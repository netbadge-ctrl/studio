"use client"

import React, { useState, useEffect } from 'react';
import type { WorkOrder, Employee } from "@/lib/types";
import { LeaderDashboardClient } from '@/components/leader-dashboard-client';
import { WorkOrderDetailClient } from '@/components/work-order-detail-client';
import { WorkOrderOperateClient } from '@/components/work-order-operate-client';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Server, Wrench, HardDrive, User, Calendar, Building2, UserSquare, Layers } from "lucide-react";

type View = 
  | { name: 'ENGINEER_DASHBOARD' }
  | { name: 'LEADER_DASHBOARD' }
  | { name: 'WORK_ORDER_DETAIL', workOrderId: string }
  | { name: 'WORK_ORDER_OPERATE', workOrderId: string };

const getStatusClass = (status: WorkOrder["status"]) => {
  switch (status) {
    case "已完成":
      return "bg-green-100 text-green-800 border-green-200";
    case "进行中":
      return "bg-blue-100 text-primary border-blue-200";
    case "已阻塞":
      return "bg-red-100 text-red-800 border-red-200";
    case "已分配":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getTypeIcon = (type: WorkOrder["type"]) => {
  switch(type) {
    case '服务器改造':
      return <Wrench className="w-5 h-5" />;
    case '新服务器部署':
      return <Server className="w-5 h-5" />;
    case '交换机维护':
      return <HardDrive className="w-5 h-5" />;
    default:
      return <Wrench className="w-5 h-5" />;
  }
}

export function DatacenterOpsDemo({
    initialWorkOrders,
    initialEmployees,
    onTitleChange,
}: {
    initialWorkOrders: WorkOrder[];
    initialEmployees: Employee[];
    onTitleChange: (title: string) => void;
}) {
    const [view, setView] = useState<View>({ name: 'ENGINEER_DASHBOARD' });
    const [workOrders, setWorkOrders] = useState(initialWorkOrders);
    const employees = initialEmployees;

    const currentWorkOrder = (view.name === 'WORK_ORDER_DETAIL' || view.name === 'WORK_ORDER_OPERATE') 
        ? workOrders.find(wo => wo.id === view.workOrderId)
        : null;

    const navigateTo = (newView: View) => {
        // This is a simple history mechanism. A more robust solution might use a state management library or URL hash.
        setView(newView);
    };

    useEffect(() => {
        switch (view.name) {
            case 'ENGINEER_DASHBOARD':
                onTitleChange("我的工单");
                break;
            case 'LEADER_DASHBOARD':
                onTitleChange("主管仪表盘");
                break;
            case 'WORK_ORDER_DETAIL':
                onTitleChange(`工单详情 #${view.workOrderId}`);
                break;
            case 'WORK_ORDER_OPERATE':
                onTitleChange(`工单操作 #${view.workOrderId}`);
                break;
            default:
                onTitleChange("数据中心运维");
        }
    }, [view, onTitleChange]);
    
    const EngineerDashboard = () => {
        const myWorkOrders = workOrders.filter((wo) =>
            wo.assignedTo.some((e) => e.id === "emp-001")
        );

        const getModulesForOrder = (order: WorkOrder) => {
            const modules = new Set(order.devices.map(d => d.location.module));
            return Array.from(modules).join(', ');
        }
        
        return (
            <div>
                 <header className="flex justify-between items-center mb-6">
                    <p className="text-muted-foreground">
                        以下是分配给您的任务。
                    </p>
                    <Button onClick={() => navigateTo({ name: 'LEADER_DASHBOARD' })}>切换到主管视图</Button>
                </header>
                <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                    {myWorkOrders.map((order) => (
                    <div onClick={() => navigateTo({ name: 'WORK_ORDER_DETAIL', workOrderId: order.id })} key={order.id} className="group cursor-pointer">
                        <Card className="flex flex-col transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-1">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold pr-4">{`[${order.id}] ${order.title}`}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                           <div className="grid grid-cols-1 gap-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <UserSquare className="h-4 w-4 flex-shrink-0" />
                                    <span>{order.initiator.name}</span>
                                    <Calendar className="h-4 w-4 ml-auto flex-shrink-0" />
                                    <span>{order.createdAt}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 flex-shrink-0" />
                                    <span className="flex-grow">{getModulesForOrder(order)}</span>
                                    <Layers className="h-4 w-4 ml-auto flex-shrink-0" />
                                    <span>{order.devices.length} 台设备</span>
                                </div>
                           </div>
                        </CardContent>
                        <CardFooter className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{order.assignedTo.map(e => e.name).join(', ')}</span>
                            </div>
                            <Badge className={cn("whitespace-nowrap text-xs", getStatusClass(order.status))}>
                                {order.status}
                            </Badge>
                        </CardFooter>
                        </Card>
                    </div>
                    ))}
                </div>
            </div>
        )
    };

    const LeaderDashboard = () => {
         return (
            <div>
                <header className="flex justify-between items-center mb-6">
                    <p className="text-muted-foreground">
                        监控并分配所有工单。
                    </p>
                     <Button onClick={() => navigateTo({ name: 'ENGINEER_DASHBOARD' })}>切换到工程师视图</Button>
                </header>
                <div>
                    <LeaderDashboardClient initialWorkOrders={workOrders} employees={employees} />
                </div>
            </div>
        )
    }

    const renderContent = () => {
        switch (view.name) {
            case 'ENGINEER_DASHBOARD':
                return <EngineerDashboard />;

            case 'LEADER_DASHBOARD':
                return <LeaderDashboard />;

            case 'WORK_ORDER_DETAIL':
                if (!currentWorkOrder) return <div>工单未找到</div>;
                return (
                    <div>
                        <div className="mb-4">
                            <Button onClick={() => navigateTo({ name: 'ENGINEER_DASHBOARD' })} variant="outline" size="sm" className='flex items-center gap-1'>
                                <ChevronLeft className="h-4 w-4" />
                                返回我的工单
                            </Button>
                        </div>
                        {/* We need to pass a "navigateToOperate" function to the detail client */}
                        <WorkOrderDetailClient workOrder={currentWorkOrder} />
                    </div>
                );

            case 'WORK_ORDER_OPERATE':
                if (!currentWorkOrder) return <div>工单未找到</div>;
                return (
                    <div>
                        <div className="mb-4">
                             <Button onClick={() => navigateTo({ name: 'WORK_ORDER_DETAIL', workOrderId: currentWorkOrder.id })} variant="outline" size="sm" className='flex items-center gap-1'>
                                <ChevronLeft className="h-4 w-4" />
                                返回准备页
                            </Button>
                        </div>
                        <WorkOrderOperateClient workOrder={currentWorkOrder} />
                    </div>
                );
                
            default:
                return <div>未知视图</div>;
        }
    };
    
    // Hack to navigate from detail to operate page, as we removed the router.
    // In a real app, this would be handled more cleanly with callbacks or context.
    React.useEffect(() => {
        const handleNavigate = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail.target.includes('/operate')) {
                const id = customEvent.detail.target.split('/')[2];
                navigateTo({ name: 'WORK_ORDER_OPERATE', workOrderId: id });
            }
        };

        window.addEventListener('navigateTo', handleNavigate);
        return () => window.removeEventListener('navigateTo', handleNavigate);
    }, []);


    return (
        <div className="w-full">
            {renderContent()}
        </div>
    );
}
