
"use client";

import * as React from "react";
import type { WorkOrder, Component } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { QrCode, Send, XCircle, Package, ListChecks } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RequestPartsPageProps {
  workOrder: WorkOrder;
  onBack: () => void;
  onScan: (component: Component) => void;
  initialPartRequests: Map<string, { component: Component; serials: string[] }>;
}

type PartRequest = {
  component: Component;
  serials: string[];
};

export function RequestPartsPage({
  workOrder,
  onBack,
  onScan,
  initialPartRequests,
}: RequestPartsPageProps) {
  const { toast } = useToast();
  const [partRequests, setPartRequests] = React.useState<Map<string, PartRequest>>(initialPartRequests);

  const availableParts = React.useMemo(() => {
    const partsMap = new Map<string, Component>();

    workOrder.devices.forEach(device => {
      const currentSlotMap = new Map(device.currentConfig.map(c => [c.slot, c.partNumber]));
      
      device.targetConfig.forEach(comp => {
        const currentPartInSlot = currentSlotMap.get(comp.slot);
        if (!currentPartInSlot || currentPartInSlot !== comp.partNumber) {
          if (!partsMap.has(comp.partNumber)) {
            partsMap.set(comp.partNumber, comp);
          }
        }
      });
    });

    return Array.from(partsMap.values()).sort((a,b) => a.model.localeCompare(b.model));
  }, [workOrder]);
  
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
            title: "未申领任何备件",
            description: "请先扫描坏件以添加申领请求。",
        });
        return;
    }
    
    console.log("Submitting part requests:", Array.from(partRequests.values()));

    toast({
      title: "申领请求已提交",
      description: `成功申领 ${Array.from(partRequests.values()).reduce((acc, item) => acc + item.serials.length, 0)} 个备件。`,
    });
    
    setPartRequests(new Map());
    onBack();
  };
  
  const totalItems = Array.from(partRequests.values()).reduce((acc, item) => acc + item.serials.length, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5" />
                备件清单
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
                扫描或手动添加故障件以申领新的备件。系统将记录坏件并生成领料单。仅用于领用的备件中出现坏件的替补领用。
            </p>
            {availableParts.length > 0 ? (
                <ul className="space-y-3">
                    {availableParts.map((comp, index) => (
                    <li key={comp.partNumber} className="flex items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg border">
                        <div className="flex-grow">
                            <p className='font-semibold text-foreground'>备件Model号{index + 1}</p>
                            <p className='text-xs text-muted-foreground'>仓库盒号: {comp.partNumber}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => onScan(comp)}>
                            <QrCode className="mr-2 h-4 w-4" />
                            扫码坏件
                        </Button>
                    </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-4">此工单无需领用新备件。</p>
            )}
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <ListChecks className="h-5 w-5" />
                    坏件与申领列表
                </CardTitle>
            </CardHeader>
            <CardContent>
                {partRequests.size > 0 ? (
                    <div className="space-y-4">
                        {Array.from(partRequests.values()).map(({ component, serials }, index) => (
                        <div key={component.partNumber} className="p-4 border rounded-lg bg-card">
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex-grow">
                                    <p className='font-semibold text-foreground'>备件Model号{index + 1}</p>
                                    <p className='text-xs text-muted-foreground'>仓库盒号: {component.partNumber}</p>
                                </div>
                                <Badge variant="secondary">坏件: {serials.length}</Badge>
                            </div>
                            <ul className="space-y-2 pt-2 border-t">
                                {serials.map(sn => (
                                    <li key={sn} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded-md">
                                        <span className="font-mono text-muted-foreground">{sn}</span>
                                        <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeSerial(component.partNumber, sn)}>
                                            <XCircle className="h-4 w-4"/>
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center py-8">
                        <p className="text-muted-foreground text-center">请从上方列表扫码添加坏件...</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 z-40">
        <div className="max-w-7xl mx-auto">
          <Button onClick={handleSubmit} disabled={totalItems === 0} size="lg" className="w-full">
            <Send className="mr-2 h-4 w-4" />
            提交申领 ({totalItems}件)
          </Button>
        </div>
      </div>
    </div>
  );
}
