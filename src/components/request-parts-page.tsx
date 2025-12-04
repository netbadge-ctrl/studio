
"use client";

import * as React from "react";
import type { WorkOrder, Component } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { QrCode, Send, XCircle, Package, Inbox, PackageSearch, AlertTriangle, CheckCircle, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface RequestPartsPageProps {
  workOrder: WorkOrder;
  onScanComplete: (component: Component, serialNumber: string) => void;
  initialPartRequests: Map<string, { component: Component; serials: string[] }>;
}

type PartRequest = {
  component: Component;
  serials: string[];
};

export function RequestPartsPage({
  workOrder,
  onScanComplete,
  initialPartRequests,
}: RequestPartsPageProps) {
  const { toast } = useToast();
  const [partRequests, setPartRequests] = React.useState<Map<string, PartRequest>>(initialPartRequests);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);
  const [manualSerialNumber, setManualSerialNumber] = React.useState("");
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const getCameraPermission = async () => {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };

    getCameraPermission();
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const replaceableParts = React.useMemo(() => {
    const partsMap = new Map<string, Component>();
    workOrder.devices.forEach(device => {
      // Logic to determine which parts are replaceable
      const targetPartNumbers = new Set(device.targetConfig.map(c => c.partNumber));
      device.currentConfig.forEach(comp => {
        if (!targetPartNumbers.has(comp.partNumber)) {
          if (!partsMap.has(comp.partNumber)) {
            partsMap.set(comp.partNumber, comp);
          }
        }
      });
      device.targetConfig.forEach(comp => {
         if (!partsMap.has(comp.partNumber)) {
            partsMap.set(comp.partNumber, comp);
          }
      })
    });
    return Array.from(partsMap.values()).sort((a,b) => a.model.localeCompare(b.model));
  }, [workOrder]);

  const handleScan = (serialNumber: string) => {
    if (!serialNumber.trim()) return;

    // In a real app, you would decode the QR code to get component info.
    // For this demo, we'll find a replaceable part that matches a pattern, or just take the first.
    const partNumberFromSN = serialNumber.split('-')[1];
    let componentToReplace = replaceableParts.find(p => p.partNumber.includes(partNumberFromSN));
    if (!componentToReplace && replaceableParts.length > 0) {
      componentToReplace = replaceableParts[0];
    }
    
    if (componentToReplace) {
      const trimmedSerial = serialNumber.trim();
      onScanComplete(componentToReplace, trimmedSerial);

      // --- FIX: Update local state to re-render the UI ---
      setPartRequests(prev => {
        const newRequests = new Map(prev);
        const existing = newRequests.get(componentToReplace!.partNumber);
        if (existing) {
          if (!existing.serials.includes(trimmedSerial)) {
            existing.serials.push(trimmedSerial);
          }
        } else {
          newRequests.set(componentToReplace!.partNumber, { component: componentToReplace!, serials: [trimmedSerial] });
        }
        return newRequests;
      });
      // --- END FIX ---

      toast({
          title: "录入成功",
          description: `已添加坏件 SN: ${trimmedSerial}`
      });
      setManualSerialNumber("");
    } else {
      toast({
        variant: "destructive",
        title: "无备件信息",
        description: "无法关联扫描的坏件，因为此工单没有可替换的备件。",
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
    // Also notify parent
    // This part is complex as the parent only has an "add" function.
    // For this demo, we assume local removal is sufficient.
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
    // In a real app, you might want to call a function passed from parent to clear its state too.
  };
  
  const totalItems = Array.from(partRequests.values()).reduce((acc, item) => acc + item.serials.length, 0);

  const renderCameraView = () => {
    if (hasCameraPermission === null) {
      return (
        <div className="w-full h-60">
            <Skeleton className="h-full w-full rounded-md" />
            <p className="text-sm text-muted-foreground mt-2 text-center">正在请求摄像头权限...</p>
        </div>
      )
    }

    if (hasCameraPermission === false) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>摄像头访问受限</AlertTitle>
          <AlertDescription>
            无法访问摄像头。请在浏览器设置中授予摄像头权限，或使用下方的“手动输入”功能。
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
      <div className="relative w-full h-60 bg-black rounded-lg overflow-hidden border">
        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-1/2 border-4 border-dashed border-white/50 rounded-lg" />
        </div>
        <p className="text-center text-xs text-white/80 bg-black/50 p-1 absolute bottom-0 w-full">
          请将坏备件的SN条码对准扫描框
        </p>
      </div>
    );
  };


  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 pb-24">
        
        {/* Unified Scan Action */}
        <Card>
            <CardContent className="space-y-4 p-4 md:p-6">
              {renderCameraView()}
              <Button 
                variant="secondary" 
                className="w-full" 
                onClick={() => handleScan(`SN-FAULT-${Date.now()}`)}
                disabled={!hasCameraPermission}
              >
                <Camera className="mr-2" />
                模拟扫码成功
              </Button>
               <div className="space-y-2">
                  <Label htmlFor="serial-number">无法扫描？请手动输入</Label>
                  <div className="flex gap-2">
                  <Input
                    id="serial-number"
                    value={manualSerialNumber}
                    onChange={(e) => setManualSerialNumber(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleScan(manualSerialNumber)}
                    placeholder="在此输入坏件序列号"
                  />
                  <Button onClick={() => handleScan(manualSerialNumber)}><CheckCircle className="h-4 w-4" /></Button>
                  </div>
              </div>
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

    