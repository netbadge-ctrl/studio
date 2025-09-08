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
import { QrCode, PlusCircle, MinusCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface RequestPartsDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  workOrder: WorkOrder;
}

type PartRequest = {
  component: Component;
  count: number;
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
        // Consider both target and current configs for parts that might fail
        const allParts = [...device.currentConfig, ...device.targetConfig];
        allParts.forEach(comp => {
            if (!partsMap.has(comp.partNumber)) {
            partsMap.set(comp.partNumber, comp);
            }
        });
    });
    return Array.from(partsMap.values()).sort((a,b) => a.model.localeCompare(b.model));
  }, [workOrder]);

  const handleScan = (partNumber: string) => {
    const component = availableParts.find(p => p.partNumber === partNumber);
    if (!component) return;

    setPartRequests(prev => {
        const newRequests = new Map(prev);
        const existing = newRequests.get(partNumber);
        if (existing) {
            existing.count += 1;
        } else {
            newRequests.set(partNumber, { component, count: 1 });
        }
        return newRequests;
    });

    toast({
      title: "扫码成功",
      description: `已为 ${component.model} 增加一个故障件。`,
    });
  };
  
  const updateCount = (partNumber: string, delta: number) => {
    setPartRequests(prev => {
        const newRequests = new Map(prev);
        const existing = newRequests.get(partNumber);
        if (existing) {
            const newCount = existing.count + delta;
            if (newCount > 0) {
                existing.count = newCount;
            } else {
                newRequests.delete(partNumber);
            }
        }
        return newRequests;
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
      description: `成功申领 ${partRequests.size} 种备件。`,
    });
    
    setPartRequests(new Map());
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">增领备件</DialogTitle>
          <DialogDescription>
            扫描或手动添加故障件以申领新的备件。系统将记录坏件并生成领料单。
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
                                <p className='text-xs text-muted-foreground'>{comp.partNumber}</p>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => handleScan(comp.partNumber)}>
                                <QrCode className="mr-2 h-4 w-4" />
                                扫码
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
                         <ul className="p-4 space-y-2">
                            {Array.from(partRequests.values()).map(({ component, count }) => (
                            <li key={component.partNumber} className="flex items-center justify-between gap-4 p-3 bg-blue-50/50 rounded-md">
                                <div className="flex-grow">
                                    <p className='font-mono text-sm text-foreground font-semibold'>{component.model}</p>
                                    <p className='text-xs text-muted-foreground'>{component.partNumber}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => updateCount(component.partNumber, -1)}>
                                        <MinusCircle className="h-5 w-5" />
                                    </Button>
                                    <span className="font-bold text-lg w-8 text-center">{count}</span>
                                     <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => updateCount(component.partNumber, 1)}>
                                        <PlusCircle className="h-5 w-5" />
                                    </Button>
                                </div>
                            </li>
                            ))}
                        </ul>
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
            <Button onClick={handleSubmit} disabled={partRequests.size === 0}>
                <Send className="mr-2 h-4 w-4" />
                提交申领 ({Array.from(partRequests.values()).reduce((acc, item) => acc + item.count, 0)}件)
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
