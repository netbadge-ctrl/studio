"use client";

import * as React from "react";
import type { WorkOrder, Employee } from "@/lib/types";
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
import { Label } from "@/components/ui/label";

interface AssignWorkOrderDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  workOrder: WorkOrder;
  employees: Employee[];
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

  React.useEffect(() => {
    setSelectedEmployees(workOrder.assignedTo.map((e) => e.id));
  }, [workOrder]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Work Order</DialogTitle>
          <DialogDescription>
            Select employees to assign to "{workOrder.title}".
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Available Employees</h4>
            <div className="space-y-3 rounded-md border p-4 max-h-60 overflow-y-auto">
              {employees.map((employee) => (
                <div key={employee.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`emp-${employee.id}`}
                    checked={selectedEmployees.includes(employee.id)}
                    onCheckedChange={(checked) =>
                      handleSelectEmployee(employee.id, !!checked)
                    }
                  />
                  <Label htmlFor={`emp-${employee.id}`} className="font-normal">
                    {employee.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Assignment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
