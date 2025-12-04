
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
import { PackageMinus, Send, ChevronDown } from "lucide-react";
import { Badge } from "./ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface ReturnPartsDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  workOrder: WorkOrder;
}

type AggregatedPart = {
  component: Component;
  serialNumbers: string[];
}

export function ReturnPartsDialog({
  isOpen,
  setIsOpen,
  workOrder,
}: ReturnPartsDialogProps) {
  const { toast } = useToast();
  const [openCollapsible, setOpenCollapsible] = React.useState<string | null>(null);

  const aggregatedParts = React.useMemo(() => {
    const partsMap = new Map<string, AggregatedPart>();
    
    workOrder.devices.forEach(device => {
      const targetPartNumbersInSlots = new Map(device.targetConfig.map(c => [c.slot, c.partNumber]));
      
      device.currentConfig.forEach(component => {
        if (targetPartNumbersInSlots.get(component.slot) !== component.partNumber) {
          const serialNumber = `SN-FAULT-${device.serialNumber.slice(-4)}-${component.slot}`;
          const existing = partsMap.get(component.partNumber);
          if (existing) {
            existing.serialNumbers.push(serialNumber);
          } else {
            partsMap.set(component.partNumber, {
              component: component,
              serialNumbers: [serialNumber],
            });
          }
        }
      });
    });

    return Array.from(partsMap.values()).sort((a,b) => a.component.model.localeCompare(b.component.model));
  }, [workOrder]);

  const totalPartsCount = React.useMemo(() => {
    return aggregatedParts.reduce((acc, group) => acc + group.serialNumbers.length, 0);
  }, [aggregatedParts]);


  const handleSubmit = () => {
    if (totalPartsCount === 0) {
      toast({
        variant: "default",
        title: "没有需要回库的备件",
        description: "本次工单没有替换任何备件。",
      });
      return;
    }
    
    console.log("Submitting part returns:", aggregatedParts);

    toast({
      title: "回库请求已提交",
      description: `共 ${totalPartsCount} 个备件已提交回库处理。`,
    });
    
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <PackageMinus />
            备件回库
          </DialogTitle>
          <DialogDescription>
            请将以下从设备上拆除的备件，根据其部件号（仓库盒号）放回指定位置。
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden -mx-6 px-2">
            <ScrollArea className="h-full px-4">
                {aggregatedParts.length > 0 ? (
                     <div className="space-y-4">
                        {aggregatedParts.map(({ component, serialNumbers }, index) => (
                           <Collapsible 
                              key={component.partNumber} 
                              className="p-4 border rounded-lg bg-card data-[state=open]:shadow-md"
                              open={openCollapsible === component.partNumber}
                              onOpenChange={(isOpen) => setOpenCollapsible(isOpen ? component.partNumber : null)}
                            >
                              <CollapsibleTrigger className="flex items-start justify-between gap-4 w-full group">
                                <div className="flex-grow text-left">
                                  <p className="font-semibold text-foreground">备件Model号{index + 1}</p>
                                  <p className='text-sm text-muted-foreground'>回库盒号: <span className="font-mono">{component.partNumber}</span></p>
                                </div>
                                <div className="flex items-center gap-4">
                                  <Badge variant="secondary">数量: {serialNumbers.length}</Badge>
                                  <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="space-y-2 pt-4 mt-4 border-t">
                                  {serialNumbers.map(sn => (
                                      <li key={sn} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded-md list-none">
                                          <span className="text-muted-foreground">序列号:</span>
                                          <span className="font-mono text-foreground">{sn}</span>
                                      </li>
                                  ))}
                              </CollapsibleContent>
                           </Collapsible>
                        ))}
                     </div>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-muted-foreground text-center">此工单无需回库任何备件。</p>
                    </div>
                )}
            </ScrollArea>
        </div>
        <DialogFooter className="mt-auto pt-4 border-t">
            <DialogClose asChild>
                <Button variant="outline">关闭</Button>
            </DialogClose>
            <Button onClick={handleSubmit} disabled={totalPartsCount === 0}>
                <Send className="mr-2 h-4 w-4" />
                确认回库 ({totalPartsCount}件)
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
