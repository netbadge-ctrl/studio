
"use client";

import * as React from "react";
import type { WorkOrder, Employee, EmployeeWithStats } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import { Card } from "./ui/card";

type SortKey = "name" | "activeOrders" | "completedToday";
type SortDirection = "asc" | "desc";

interface AssignWorkOrderDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  workOrder: WorkOrder;
  employees: EmployeeWithStats[];
  onAssign: (orderId: string, assignedEmployees: Employee[]) => void;
}

export function AssignWorkOrderDialog({
  isOpen,
  setIsOpen,
  workOrder,
  employees,
  onAssign,
}: AssignWorkOrderDialogProps) {
  const [selectedEmployees, setSelectedEmployees] = React.useState<string[]>(
    () => workOrder.assignedTo.map((e) => e.id)
  );
  const [sortConfig, setSortConfig] = React.useState<{ key: SortKey; direction: SortDirection }>({
    key: "activeOrders",
    direction: "asc",
  });

  const handleSelectEmployee = (employeeId: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };
  
  const handleSubmit = () => {
    const assigned = employees.filter(e => selectedEmployees.includes(e.id));
    onAssign(workOrder.id, assigned);
    setIsOpen(false);
  };

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedEmployees = React.useMemo(() => {
    const sortableEmployees = [...employees];
    sortableEmployees.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    return sortableEmployees;
  }, [employees, sortConfig]);

  React.useEffect(() => {
    setSelectedEmployees(workOrder.assignedTo.map((e) => e.id));
  }, [workOrder]);

  const SortButton = ({ sortKey, label }: { sortKey: SortKey, label: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(sortKey)}
      className={cn("text-muted-foreground", sortConfig.key === sortKey && "text-primary")}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>分配工单: {workOrder.title}</DialogTitle>
          <DialogDescription>
            选择员工并查看其当前负载，以实现高效分配。
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-start gap-1 py-2">
            <span className="text-sm text-muted-foreground ml-2">排序:</span>
            <SortButton sortKey="activeOrders" label="进行中" />
            <SortButton sortKey="completedToday" label="今日完成" />
        </div>
        <div className="flex-1 -mx-6 px-2 overflow-hidden">
          <ScrollArea className="h-full px-4">
            <div className="space-y-3">
            {sortedEmployees.map((employee) => (
                <Card 
                    key={employee.id} 
                    onClick={() => handleSelectEmployee(employee.id)}
                    className={cn(
                        "p-4 flex items-center gap-4 transition-all cursor-pointer",
                        selectedEmployees.includes(employee.id) && "bg-primary/10 border-primary"
                    )}
                >
                    <Checkbox
                        id={`emp-${employee.id}`}
                        checked={selectedEmployees.includes(employee.id)}
                        className="h-5 w-5"
                    />
                    <div className="flex-grow">
                        <p className="font-semibold text-foreground">{employee.name}</p>
                    </div>
                    <div className="flex flex-col items-end text-sm">
                        <p className="text-foreground">{employee.activeOrders}</p>
                        <p className="text-muted-foreground text-xs">进行中</p>
                    </div>
                    <div className="flex flex-col items-end text-sm">
                        <p className="text-foreground">{employee.completedToday}</p>
                        <p className="text-muted-foreground text-xs">今日完成</p>
                    </div>
                </Card>
            ))}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter className="mt-auto border-t pt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit}>保存分配</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
