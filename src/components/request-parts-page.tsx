
"use client";

import * as React from "react";
import type { WorkOrder, Component } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { QrCode, Send, XCircle, Package, ListChecks, Inbox, PackageSearch, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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

  // This represents all unique parts that *could* be replaced in this work order.
  const replaceableParts = React.useMemo(() => {
    const partsMap = new Map<string, Component>();
    workOrder.devices.forEach(device => {
      device.currentConfig.forEach(comp => {
        if (!partsMap.has(comp.partNumber)) {
          partsMap.set(comp.partNumber, comp);
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

  // This is a proxy for the scan button. In a real app, this would trigger the camera.
  // We'll just pick a random replaceable part to simulate a scan.
  const handleUnifiedScan = () => {
    if (replaceableParts.length > 0) {
      // For this demo, let's just pick the first replaceable part to scan.
      // A real implementation would involve a camera and QR code library.
      onScan(replaceableParts[0]);
    } else {
      toast({
        title: "无坏件可扫",
        description: "此工单没有可被替换的备件。",
      });
    }
  };


  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 pb-24">
        
        {/* Unified Scan Action */}
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-primary"/>
                    扫描坏件
                </CardTitle>
                <CardDescription>
                    点击下方按钮，开始扫描从设备上替换下来的故障备件序列号。
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button size="lg" className="w-full" onClick={handleUnifiedScan}>
                    <QrCode className="mr-2 h-5 w-5"/>
                    开始扫描
                </Button>
            </CardContent>
        </Card>

        {/* Area 1: Faulty Parts List */}
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Inbox className="h-5 w-5" />
                    区域1: 坏件清单
                </CardTitle>
                 <CardDescription>
                    已扫描的坏件将在此处列出，请确认信息并准备回库。
                </CardDescription>
            </CardHeader>
            <CardContent>
                {partRequests.size > 0 ? (
                    <ul className="space-y-3">
                        {Array.from(partRequests.entries()).flatMap(([partNumber, { component, serials }]) => 
                            serials.map(sn => (
                                <li key={sn} className="flex items-center justify-between gap-3 p-3 bg-muted/50 rounded-lg border">
                                    <div className="flex-grow">
                                        <p className="font-mono text-foreground text-sm">{sn}</p>
                                        <p className="text-xs text-muted-foreground">{component.model}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono text-xs text-primary font-semibold">{partNumber}</p>
                                        <p className="text-xs text-muted-foreground">回库盒号</p>
                                    </div>
                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeSerial(partNumber, sn)}>
                                        <XCircle className="h-4 w-4"/>
                                    </Button>
                                </li>
                            ))
                        )}
                    </ul>
                ) : (
                    <div className="h-full flex items-center justify-center py-8">
                        <p className="text-muted-foreground text-center">请扫描坏件以添加到此列表...</p>
                    </div>
                )}
            </CardContent>
        </Card>

        {/* Area 2: Replacement Request List */}
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <PackageSearch className="h-5 w-5" />
                    区域2: 申领清单
                </CardTitle>
                <CardDescription>
                    系统已根据您扫描的坏件自动生成需要领用的新备件清单。
                </CardDescription>
            </CardHeader>
            <CardContent>
                 {partRequests.size > 0 ? (
                    <ul className="space-y-3">
                        {Array.from(partRequests.values()).map(({ component, serials }) => (
                             <li key={component.partNumber} className="flex items-center justify-between gap-4 p-4 border rounded-lg">
                                <div className="flex-grow">
                                    <p className='font-semibold text-foreground'>{component.model}</p>
                                    <p className='text-xs font-mono text-muted-foreground'>领取盒号: {component.partNumber}</p>
                                </div>
                                <Badge variant="secondary" className="text-base">x {serials.length}</Badge>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="h-full flex items-center justify-center py-8">
                        <p className="text-muted-foreground text-center">扫描坏件后，将在此自动生成申领清单。</p>
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

    