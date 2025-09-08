"use client";

import * as React from "react";
import type { WorkOrder, Employee } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AssignWorkOrderDialog } from "./assign-work-order-dialog";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export function LeaderDashboardClient({
  initialWorkOrders,
  employees,
}: {
  initialWorkOrders: WorkOrder[];
  employees: Employee[];
}) {
  const [workOrders, setWorkOrders] = React.useState(initialWorkOrders);
  const [selectedOrder, setSelectedOrder] = React.useState<WorkOrder | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleOpenDialog = (order: WorkOrder) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleAssignment = (
    orderId: string,
    assignedEmployees: Employee[]
  ) => {
    setWorkOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              assignedTo: assignedEmployees,
              status: assignedEmployees.length > 0 ? "已分配" : "待处理",
            }
          : order
      )
    );
  };

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>标题</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>分配给</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.title}</TableCell>
                  <TableCell>{order.type}</TableCell>
                  <TableCell>
                    <Badge className={cn("whitespace-nowrap", getStatusClass(order.status))}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center -space-x-2">
                      {order.assignedTo.length > 0 ? (
                        order.assignedTo.map((emp) => (
                          <Avatar key={emp.id} className="h-8 w-8 border-2 border-card">
                            <AvatarFallback>{emp.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-xs">未分配</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(order)}
                    >
                      分配
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedOrder && (
        <AssignWorkOrderDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          workOrder={selectedOrder}
          employees={employees}
          onAssign={handleAssignment}
        />
      )}
    </>
  );
}
