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
  | { name: 'WORK_ORDER_DETAIL', workOrderId: string, previousView: 'ENGINEER_DASHBOARD' | 'LEADER_DASHBOARD' }
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
    initialView,
    setShowBackButton,
    setBackButtonLabel,
    setHandleBack,
}: {
    initialWorkOrders: WorkOrder[];
    initialEmployees: Employee[];
    onTitleChange: (title: string) => void;
    initialView: 'ENGINEER_DASHBOARD' | 'LEADER_DASHBOARD';
    setShowBackButton: (show: boolean) => void;
    setBackButtonLabel: (label: string) => void;
    setHandleBack: (handler: () => void) => void;
}) {
    const [view, setView] = useState<View>({ name: initialView });
    const [workOrders, setWorkOrders] = useState(initialWorkOrders);
    const employees = initialEmployees;

    const currentWorkOrder = (view.name === 'WORK_ORDER_DETAIL' || view.name === 'WORK_ORDER_OPERATE') 
        ? workOrders.find(wo => wo.id === view.workOrderId)
        : null;

    const navigateTo = (newView: View) => {
        setView(newView);
    };

    useEffect(() => {
        const isDetailPage = view.name === 'WORK_ORDER_DETAIL' || view.name === 'WORK_ORDER_OPERATE';
        setShowBackButton(isDetailPage);

        let backLabel = '';
        let backView: View = { name: 'ENGINEER_DASHBOARD' };

        switch (view.name) {
            case 'ENGINEER_DASHBOARD':
                onTitleChange("我的工单");
                break;
            case 'LEADER_DASHBOARD':
                onTitleChange("主管分配工单");
                break;
            case 'WORK_ORDER_DETAIL':
                onTitleChange(`工单详情 #${view.workOrderId}`);
                backLabel = view.previousView === 'ENGINEER_DASHBOARD' ? '返回我的工单' : '返回主管仪表盘';
                backView = { name: view.previousView };
                break;
            case 'WORK_ORDER_OPERATE':
                const previousViewForOperate = workOrders.find(wo => wo.id === view.workOrderId)?.assignedTo.some(e => e.id === "emp-001") ? 'ENGINEER_DASHBOARD' : 'LEADER_DASHBOARD';
                onTitleChange(`工单操作 #${view.workOrderId}`);
                backLabel = '返回准备页';
                backView = { name: 'WORK_ORDER_DETAIL', workOrderId: view.workOrderId, previousView: previousViewForOperate };
                break;
            default:
                onTitleChange("数据中心运维");
        }

        setBackButtonLabel(backLabel);
        setHandleBack(() => () => navigateTo(backView));

    }, [view, onTitleChange, setShowBackButton, setBackButtonLabel, setHandleBack, workOrders]);
    
    const EngineerDashboard = () => {
        const myWorkOrders = workOrders.filter((wo) =>
            wo.assignedTo.some((e) => e.id === "emp-001")
        );

        const getModulesForOrder = (order: WorkOrder) => {
            const modules = new Set(
              order.devices
                .filter(d => d.location) // Filter out devices with no location
                .map(d => d.location!.module) // Safe to access module now
            );
            return Array.from(modules).join(', ');
        }
        
        return (
            <div>
                <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                    {myWorkOrders.map((order) => (
                    <div onClick={() => navigateTo({ name: 'WORK_ORDER_DETAIL', workOrderId: order.id, previousView: 'ENGINEER_DASHBOARD' })} key={order.id} className="group cursor-pointer">
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
            <LeaderDashboardClient initialWorkOrders={workOrders} employees={employees} />
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
                return <WorkOrderDetailClient workOrder={currentWorkOrder} />;

            case 'WORK_ORDER_OPERATE':
                if (!currentWorkOrder) return <div>工单未找到</div>;
                return <WorkOrderOperateClient workOrder={currentWorkOrder} />;
                
            default:
                return <div>未知视图</div>;
        }
    };
    
    React.useEffect(() => {
        const handleNavigate = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail.target.includes('/operate')) {
                const id = customEvent.detail.target.split('/')[2];
                navigateTo({ name: 'WORK_ORDER_OPERATE', workOrderId: id });
            } else if (customEvent.detail.target === '/') {
                navigateTo({ name: 'ENGINEER_DASHBOARD' });
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
