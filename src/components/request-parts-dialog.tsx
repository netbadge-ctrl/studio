
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
import { QrCode, Send, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface RequestPartsDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  workOrder: WorkOrder;
}

type PartRequest = {
  component: Component;
  serials: string[];
};

export function RequestPartsDialog({
  isOpen,
  setIsOpen,
  workOrder,
}: RequestPartsDialogProps) {
  const { toast } = useToast();
  const [partRequests, setPartRequests] = React.useState<Map<string, PartRequest>>(new Map());

  const availableParts = React.useMemo(() => {
    const partsMap = new Map<string, Component>();
    workOrder.devices.forEach(device => {
      const currentSlotMap = new Map(device.currentConfig.map(c => [c.slot, c]));
      device.targetConfig.forEach(comp => {
        const currentComp = currentSlotMap.get(comp.slot);
        // Only add if it's a new component or a different component in the same slot
        if (!currentComp || currentComp.partNumber !== comp.partNumber) {
          if (!partsMap.has(comp.partNumber)) {
            partsMap.set(comp.partNumber, comp);
          }
        }
      });
    });
    return Array.from(partsMap.values()).sort((a,b) => a.model.localeCompare(b.model));
  }, [workOrder]);

  const handleScan = (partNumber: string) => {
    const component = availableParts.find(p => p.partNumber === partNumber);
    if (!component) return;
    
    // Simulate scanning a serial number
    const serialNumber = window.prompt(`请输入坏件 ${component.model} 的序列号:`);

    if (serialNumber) {
        setPartRequests(prev => {
            const newRequests = new Map(prev);
            const existing = newRequests.get(partNumber);
            if (existing) {
                if (!existing.serials.includes(serialNumber)) {
                    existing.serials.push(serialNumber);
                    toast({
                      title: "扫码成功",
                      description: `已添加坏件SN: ${serialNumber}`,
                    });
                } else {
                     toast({
                        variant: "destructive",
                        title: "重复的序列号",
                        description: `SN: ${serialNumber} 已经存在于列表中。`,
                    });
                }
            } else {
                newRequests.set(partNumber, { component, serials: [serialNumber] });
                 toast({
                    title: "扫码成功",
                    description: `已添加坏件SN: ${serialNumber}`,
                });
            }
            return newRequests;
        });
    }
  };
  
  const removeSerial = (partNumber: string, serialToRemove: string) => {
    setPartRequests(prev => {
        const newRequests = new Map(prev);
        const existing = newRequests.get(partNumber);
        if (existing) {
            existing.serials = existing.serials.filter(s => s !== serialToRemove);
            if (existing.serials.length === 0) {
                newRequests.delete(partNumber);
            }
        }
        return newRequests;
    });
    toast({
        title: "坏件已移除",
        description: `SN: ${serialToRemove} 已从列表中删除。`,
    });
  };

  const handleSubmit = () => {
    if (partRequests.size === 0) {
        toast({
            variant: "destructive",
            title: "未选择任何备件",
            description: "请先通过扫码或点击按钮添加需要申领的备件。",
        });
        return;
    }
    
    // Logic to submit the request would go here
    console.log("Submitting part requests:", Array.from(partRequests.values()));

    toast({
      title: "申领请求已提交",
      description: `成功申领 ${Array.from(partRequests.values()).reduce((acc, item) => acc + item.serials.length, 0)} 个备件。`,
    });
    
    setPartRequests(new Map());
    setIsOpen(false);
  };
  
  const totalItems = Array.from(partRequests.values()).reduce((acc, item) => acc + item.serials.length, 0);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">增领备件</DialogTitle>
          <DialogDescription>
            扫描或手动添加故障件以申领新的备件。系统将记录坏件并生成领料单。仅用于领用的备件中出现坏件的替补领用。
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-hidden">
            <div className="flex flex-col gap-4">
                <h3 className="font-semibold text-lg">备件清单</h3>
                <ScrollArea className="flex-1 border rounded-lg">
                    <ul className="p-4 space-y-2">
                        {availableParts.map((comp) => (
                        <li key={comp.partNumber} className="flex items-center justify-between gap-4 p-3 bg-muted/50 rounded-md">
                            <div className="flex-grow">
                                <p className='font-mono text-sm text-foreground font-semibold'>{comp.model}</p>
                                <p className='text-xs text-muted-foreground'>仓库盒号: {comp.partNumber}</p>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => handleScan(comp.partNumber)}>
                                <QrCode className="mr-2 h-4 w-4" />
                                扫码坏件
                            </Button>
                        </li>
                        ))}
                    </ul>
                </ScrollArea>
            </div>
            <div className="flex flex-col gap-4">
                <h3 className="font-semibold text-lg">坏件与申领列表</h3>
                <ScrollArea className="flex-1 border rounded-lg">
                    {partRequests.size > 0 ? (
                         <div className="p-4 space-y-4">
                            {Array.from(partRequests.values()).map(({ component, serials }) => (
                            <div key={component.partNumber} className="p-3 bg-blue-50/50 rounded-md">
                                <div className="flex items-center justify-between gap-4 mb-3">
                                    <div className="flex-grow">
                                        <p className='font-mono text-sm text-foreground font-semibold'>{component.model}</p>
                                        <p className='text-xs text-muted-foreground'>仓库盒号: {component.partNumber}</p>
                                    </div>
                                    <Badge variant="secondary">坏件数量: {serials.length}</Badge>
                                </div>
                                <ul className="space-y-1 pl-2 border-l-2 border-blue-200">
                                    {serials.map(sn => (
                                        <li key={sn} className="flex items-center justify-between text-sm">
                                            <span className="font-mono text-muted-foreground">{sn}</span>
                                            <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeSerial(component.partNumber, sn)}>
                                                <XCircle className="h-4 w-4"/>
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-muted-foreground text-center">请从左侧列表扫码添加坏件...</p>
                        </div>
                    )}
                </ScrollArea>
            </div>
        </div>
        <DialogFooter className="mt-auto pt-4 border-t">
            <DialogClose asChild>
                <Button variant="outline">取消</Button>
            </DialogClose>
            <Button onClick={handleSubmit} disabled={totalItems === 0}>
                <Send className="mr-2 h-4 w-4" />
                提交申领 ({totalItems}件)
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
