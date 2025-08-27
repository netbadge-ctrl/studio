"use client"

import { useState, useRef, useMemo, useEffect } from 'react';
import type { WorkOrder, Component, Device } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Layers, Server as ServerIcon, HardDrive, MemoryStick, Cpu, ArrowUp, ArrowDown, Network, Video, Image as ImageIcon, QrCode, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image';
import { ScanDeviceDialog } from './scan-device-dialog';
import { Badge } from '@/components/ui/badge';
import { ScanPartDialog } from './scan-part-dialog';
import { partScanner } from '@/lib/part-scanner';


const getComponentIcon = (type: Component['type']) => {
    const props = { className: "h-4 w-4 text-muted-foreground" };
    switch(type) {
        case 'SATA': return <HardDrive {...props} />;
        case 'SSD': return <HardDrive {...props} />;
        case '内存': return <MemoryStick {...props} />;
        case 'CPU': return <Cpu {...props} />;
        default: return <Layers {...props} />;
    }
}

const getDeviceIcon = (type: Device['type']) => {
    const props = { className: "h-5 w-5 text-primary" };
    switch(type) {
        case '服务器': return <ServerIcon {...props} />;
        case '交换机': return <Network {...props} />;
        case '存储设备': return <HardDrive {...props} />;
        default: return <Layers {...props} />;
    }
}

function DeviceOperation({ device }: { device: Device }) {
  const [isScanPartDialogOpen, setIsScanPartDialogOpen] = useState(false);
  const [highlightedPart, setHighlightedPart] = useState<string | null>(null);

  const operationDetails = useMemo(() => {
    const operations: { action: '装' | '卸', component: Component }[] = [];

    const currentSlotMap = new Map(device.currentConfig.map(c => [c.slot, c]));
    const targetSlotMap = new Map(device.targetConfig.map(c => [c.slot, c]));

    // Find components to remove
    for (const [slot, component] of currentSlotMap.entries()) {
      if (!targetSlotMap.has(slot) || targetSlotMap.get(slot)?.partNumber !== component.partNumber) {
        operations.push({ action: '卸', component });
      }
    }

    // Find components to add
    for (const [slot, component] of targetSlotMap.entries()) {
      if (!currentSlotMap.has(slot) || currentSlotMap.get(slot)?.partNumber !== component.partNumber) {
        operations.push({ action: '装', component });
      }
    }
    
    return operations.sort((a, b) => {
        if (a.action !== b.action) {
            return a.action === '卸' ? -1 : 1;
        }
        return a.component.slot.localeCompare(b.component.slot);
    });
  }, [device.currentConfig, device.targetConfig]);

  const partRefs = useRef<Record<string, HTMLTableRowElement | null>>({});

  useEffect(() => {
    const handleScan = (partNumber: string) => {
      const found = operationDetails.some(op => op.component.partNumber === partNumber);
      if (found) {
        setHighlightedPart(partNumber);
        setTimeout(() => {
          const element = partRefs.current[partNumber];
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    };

    partScanner.on('scan', handleScan);
    return () => {
      partScanner.off('scan', handleScan);
    };
  }, [operationDetails]);

  return (
    <>
      <div className="space-y-6 mt-4">
        <Card>
          <CardHeader>
              <CardTitle className='text-xl'>可视化指南</CardTitle>
              <CardDescription>查看图片或视频以获取操作指导。</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="image" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="image"><ImageIcon className="mr-2" /> 图片指引</TabsTrigger>
                <TabsTrigger value="video"><Video className="mr-2" /> 视频教程</TabsTrigger>
              </TabsList>
              <TabsContent value="image" className="mt-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                  <Image 
                      src="https://storage.googleapis.com/maker-studio-project-files-prod/v1/scenes/bRKM4o3t0mB-M-b-rI46-/resources/image_0.jpeg"
                      alt="操作指引图片"
                      fill
                      data-ai-hint="server motherboard"
                      className="object-contain"
                    />
                </div>
              </TabsContent>
              <TabsContent value="video" className="mt-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <video
                      src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                      controls
                      className="w-full h-full rounded-lg"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {operationDetails.length > 0 && (
          <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className='text-xl'>配件操作明细</CardTitle>
                    <CardDescription>根据下表完成配件的安装与卸载。</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsScanPartDialogOpen(true)}>
                    <QrCode className="mr-2 h-4 w-4" />
                    扫描配件
                  </Button>
              </CardHeader>
              <CardContent>
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>配件</TableHead>
                              <TableHead>槽位</TableHead>
                              <TableHead className="text-right">操作</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {operationDetails.map(({ action, component }, index) => (
                              <TableRow 
                                key={component.partNumber + index}
                                ref={el => partRefs.current[component.partNumber] = el}
                                className={cn(
                                  action === '装' ? 'bg-green-50/50' : 'bg-red-50/50',
                                  {'ring-2 ring-primary ring-offset-2 rounded-lg': highlightedPart === component.partNumber}
                                )}
                                onAnimationEnd={() => setHighlightedPart(null)}
                                >
                                  <TableCell>
                                      <div className="flex items-center gap-2">
                                          {getComponentIcon(component.type)}
                                          <div>
                                              <p className="font-medium text-xs sm:text-sm">{component.model}</p>
                                              <p className="text-xs text-muted-foreground">{component.partNumber}</p>
                                          </div>
                                      </div>
                                  </TableCell>
                                  <TableCell className="font-mono text-xs sm:text-sm">{component.slot}</TableCell>
                                  <TableCell className="text-right">
                                    <Badge variant={action === '装' ? 'default' : 'destructive'} className='whitespace-nowrap'>
                                      {action === '装' ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
                                      {action}
                                    </Badge>
                                  </TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </CardContent>
          </Card>
        )}
         <Card className="bg-green-50 border-green-200 text-green-900">
          <CardContent className="p-4 flex items-center gap-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-semibold">硬件改配完成，开始带外配置</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <ScanPartDialog
        isOpen={isScanPartDialogOpen}
        setIsOpen={setIsScanPartDialogOpen}
      />
    </>
  );
}

export function WorkOrderOperateClient({ workOrder }: { workOrder: WorkOrder }) {
  const { toast } = useToast();
  const router = useRouter();
  const [openAccordionItem, setOpenAccordionItem] = useState<string>('');
  const [isScanDeviceDialogOpen, setIsScanDeviceDialogOpen] = useState(false);
  const deviceRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleFindDevice = (serialNumberInput: string) => {
    if (!serialNumberInput) return;

    const device = workOrder.devices.find(d => d.serialNumber.toLowerCase() === serialNumberInput.toLowerCase());

    if (device) {
      setOpenAccordionItem(device.id);
      
      setTimeout(() => {
        const element = deviceRefs.current[device.id];
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

      toast({
        title: "定位成功",
        description: `已展开设备 ${device.serialNumber}`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: "未找到设备",
        description: `序列号 "${serialNumberInput}" 不在此工单中。`,
      });
    }
  };

  const handleCompleteWorkOrder = () => {
    toast({
      title: "工单已完成",
      description: "工单已成功标记为“已完成”。",
      variant: 'default',
    });
    router.push('/');
  }

  return (
    <>
      <Card>
          <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div>
                    <CardTitle className="text-xl md:text-2xl">{workOrder.title}</CardTitle>
                    <CardDescription>工单 #{workOrder.id} - 步骤 2/2: 操作</CardDescription>
                </div>
              </div>
          </CardHeader>
          <CardContent>
            {workOrder.devices.length > 0 ? (
               <Accordion 
                  type="single"
                  collapsible
                  value={openAccordionItem} 
                  onValueChange={setOpenAccordionItem}
                  className="w-full space-y-2"
                >
                {workOrder.devices.map(device => (
                    <div key={device.id} ref={el => (deviceRefs.current[device.id] = el)}>
                      <AccordionItem 
                        value={device.id} 
                        className="border-b-0 rounded-lg border bg-card text-card-foreground shadow-sm transition-all data-[state=open]:shadow-lg data-[state=open]:border-primary"
                      >
                          <AccordionTrigger className="px-4 py-3 hover:no-underline text-base">
                              <div className="flex items-center gap-3">
                                  {getDeviceIcon(device.type)}
                                  <div className='text-left'>
                                      <p className='font-semibold'>{device.type} ({device.model})</p>
                                      <p className="text-xs font-normal text-muted-foreground font-code">{device.serialNumber}</p>
                                  </div>
                              </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <DeviceOperation device={device} />
                          </AccordionContent>
                      </AccordionItem>
                    </div>
                ))}
              </Accordion>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">此工单没有关联的设备。</p>
            )}
          </CardContent>
           <CardFooter className="flex-col sm:flex-row sm:justify-between gap-2">
              <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => setIsScanDeviceDialogOpen(true)}>
                  <QrCode className="mr-2 h-5 w-5" />
                  扫描设备
              </Button>
              <Button size="lg" className="w-full sm:w-auto" onClick={handleCompleteWorkOrder}>
                  完成工单
              </Button>
          </CardFooter>
      </Card>
      <ScanDeviceDialog 
        isOpen={isScanDeviceDialogOpen}
        setIsOpen={setIsScanDeviceDialogOpen}
        onFindDevice={handleFindDevice}
      />
    </>
  )
}
