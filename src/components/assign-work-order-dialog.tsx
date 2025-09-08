
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const handleSelectEmployee = (employeeId: string, checked: boolean) => {
    setSelectedEmployees((prev) =>
      checked ? [...prev, employeeId] : prev.filter((id) => id !== employeeId)
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

  const SortableHeader = ({ sortKey, label }: { sortKey: SortKey, label: string }) => (
    <TableHead
      className="cursor-pointer hover:bg-muted"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center gap-2">
        {label}
        <ArrowUpDown className={cn("h-3 w-3", sortConfig.key === sortKey ? "text-primary" : "text-muted-foreground")} />
      </div>
    </TableHead>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>分配工单: {workOrder.title}</DialogTitle>
          <DialogDescription>
            选择员工并查看其当前负载，以实现高效分配。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <SortableHeader sortKey="name" label="员工" />
                  <SortableHeader sortKey="activeOrders" label="进行中" />
                  <SortableHeader sortKey="completedToday" label="今日完成" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="px-4">
                       <Checkbox
                          id={`emp-${employee.id}`}
                          checked={selectedEmployees.includes(employee.id)}
                          onCheckedChange={(checked) =>
                            handleSelectEmployee(employee.id, !!checked)
                          }
                        />
                    </TableCell>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.activeOrders}</TableCell>
                    <TableCell>{employee.completedToday}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit}>保存分配</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
