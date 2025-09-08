
"use client";

import * as React from "react";
import type { WorkOrder, Component } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { PackageMinus, Send } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface ReturnPartsDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  workOrder: WorkOrder;
}

export function ReturnPartsDialog({
  isOpen,
  setIsOpen,
  workOrder,
}: ReturnPartsDialogProps) {
  const { toast } = useToast();

  const removedParts = React.useMemo(() => {
    const parts: { component: Component, serialNumber: string }[] = [];
    workOrder.devices.forEach(device => {
      const targetPartNumbersInSlots = new Map(device.targetConfig.map(c => [c.slot, c.partNumber]));
      device.currentConfig.forEach(component => {
        if (targetPartNumbersInSlots.get(component.slot) !== component.partNumber) {
          parts.push({ component, serialNumber: `SN-FAULT-${device.serialNumber.slice(-4)}-${component.slot}` });
        }
      });
    });
    return parts.sort((a,b) => a.component.model.localeCompare(b.component.model));
  }, [workOrder]);

  const handleSubmit = () => {
    if (removedParts.length === 0) {
      toast({
        variant: "default",
        title: "没有需要回库的备件",
        description: "本次工单没有替换任何备件。",
      });
      return;
    }
    
    console.log("Submitting part returns:", removedParts);

    toast({
      title: "回库请求已提交",
      description: `共 ${removedParts.length} 个故障件已提交回库处理。`,
    });
    
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-3xl h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <PackageMinus />
            故障件回库
          </DialogTitle>
          <DialogDescription>
            请将以下从设备上拆除的故障件，根据其部件号（仓库盒号）放回指定位置。
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full border rounded-lg">
                {removedParts.length > 0 ? (
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>故障件</TableHead>
                                <TableHead>序列号 (SN)</TableHead>
                                <TableHead className="text-right">回库盒号</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {removedParts.map(({ component, serialNumber }, index) => (
                                <TableRow key={`${component.partNumber}-${index}`}>
                                    <TableCell>
                                        <p className="font-semibold">{component.model}</p>
                                        <p className="text-xs text-muted-foreground">{component.type}</p>
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-mono text-sm">{serialNumber}</p>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <p className="font-mono text-sm font-semibold">{component.partNumber}</p>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                     </Table>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-muted-foreground text-center">此工单无需回库任何故障件。</p>
                    </div>
                )}
            </ScrollArea>
        </div>
        <DialogFooter className="mt-auto pt-4 border-t">
            <DialogClose asChild>
                <Button variant="outline">关闭</Button>
            </DialogClose>
            <Button onClick={handleSubmit}>
                <Send className="mr-2 h-4 w-4" />
                确认回库 ({removedParts.length}件)
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
