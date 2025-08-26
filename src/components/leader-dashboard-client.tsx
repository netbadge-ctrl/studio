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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AssignWorkOrderDialog } from "./assign-work-order-dialog";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const getStatusClass = (status: WorkOrder["status"]) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "In Progress":
      return "bg-blue-100 text-primary border-blue-200";
    case "Blocked":
      return "bg-red-100 text-red-800 border-red-200";
    case "Assigned":
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
              status: assignedEmployees.length > 0 ? "Assigned" : "Pending",
            }
          : order
      )
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All Work Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                        <span className="text-muted-foreground text-xs">Unassigned</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(order)}
                    >
                      Assign / Modify
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
