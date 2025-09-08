
"use client"

import { useState, useRef, useMemo, useEffect } from 'react';
import type { WorkOrder, Component, Device, DeviceStatus } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Layers, Server as ServerIcon, ArrowUp, ArrowDown, Video, Image as ImageIcon, QrCode, CheckCircle, AlertTriangle, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image';
import { ScanDeviceDialog } from './scan-device-dialog';
import { Badge } from '@/components/ui/badge';
import { partScanner } from '@/lib/part-scanner';


const getDeviceIcon = (type: Device['type']) => {
    const props = { className: "h-5 w-5 text-primary" };
    switch (type) {
      case '服务器':
        return <ServerIcon {...props} />;
      default:
        return <Layers {...props} />;
    }
}

const getStatusBadgeClass = (status: DeviceStatus) => {
    switch (status) {
      case '待处理':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case '改配中':
        return 'bg-blue-100 text-primary border-blue-200';
      case '等待配置':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case '待检测':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case '改配完成':
        return 'bg-green-100 text-green-800 border-green-200';
      case '检测异常':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

const formatLocation = (location: Device['location']) => {
    if (!location) return null;
    const modulePrefix = location.module.includes('北京') ? 'BJ' : 'TJ';
    const rackNumber = location.rack.replace('R', '').padStart(2, '0');
    const rackIdentifier = `${modulePrefix}DC01-R${rackNumber}F01-JC-${rackNumber}-1`;
    return `${rackIdentifier} / U${location.uPosition}`;
};


function DeviceOperation({ 
    device,
    onStatusChange
 }: { 
    device: Device,
    onStatusChange: (status: DeviceStatus) => void;
}) {
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

  const renderActionButton = () => {
    let mainAction: React.ReactNode = null;
   
    switch (device.status) {
      case '改配中':
        mainAction = (
          <Button size="lg" className="w-full" onClick={() => onStatusChange('等待配置')}>
            <CheckCircle className="mr-2 h-5 w-5" />
            硬件改配完成，开始带外配置
          </Button>
        );
        break;
      case '等待配置':
        mainAction = (
          <Button size="lg" className="w-full" onClick={() => onStatusChange('待检测')}>
            完成带外配置
          </Button>
        );
        break;
      case '待检测':
        mainAction = (
          <Button size="lg" variant="secondary" className="w-full" onClick={() => onStatusChange('改配完成')}>
            <Search className="mr-2 h-5 w-5" />
            发起结单检测
          </Button>
        );
        break;
      case '检测异常':
        mainAction = (
          <Button variant="destructive" size="lg" className="w-full" onClick={() => { /* Logic to view issue */ }}>
            <AlertTriangle className='mr-2 h-5 w-5' />
            查看异常
          </Button>
        );
        break;
    }

    if (!mainAction) {
        return null;
    }

    return (
        <div className="space-y-4">
            {mainAction}
        </div>
    )
  };

  return (
    <>
      <div className="space-y-6 mt-4">
        <Card>
          <CardContent className="p-4">
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
              <CardHeader>
                  <CardTitle className='text-xl'>配件按照下表操作</CardTitle>
              </CardHeader>
              <CardContent>
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>配件</TableHead>
                              <TableHead className="text-right">位置/操作</TableHead>
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
                                      <div>
                                          <p className="font-medium text-xs sm:text-sm">{component.model}</p>
                                          <p className="text-xs text-muted-foreground font-mono">{component.partNumber}</p>
                                      </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className='flex flex-col items-end gap-1'>
                                        <span className='font-mono text-xs sm:text-sm'>{component.slot}</span>
                                        <Badge variant={action === '装' ? 'default' : 'destructive'} className='whitespace-nowrap'>
                                          {action === '装' ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
                                          {action}
                                        </Badge>
                                    </div>
                                  </TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </CardContent>
          </Card>
        )}
        
        {renderActionButton()}
      </div>
    </>
  );
}

export function WorkOrderOperateClient({ workOrder }: { workOrder: WorkOrder }) {
  const { toast } = useToast();
  const [openAccordionItem, setOpenAccordionItem] = useState<string>('');
  const [isScanDeviceDialogOpen, setIsScanDeviceDialogOpen] = useState(false);
  const deviceRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [deviceStatuses, setDeviceStatuses] = useState<Record<string, DeviceStatus>>(
    Object.fromEntries(workOrder.devices.map(d => [d.id, d.status]))
  );

  const handleStatusChange = (deviceId: string, status: DeviceStatus) => {
    setDeviceStatuses(prev => ({ ...prev, [deviceId]: status }));
  };

  const handleFindDevice = (serialNumberInput: string) => {
    if (!serialNumberInput) return;

    const device = workOrder.devices.find(d => d.serialNumber.toLowerCase() === serialNumberInput.toLowerCase());

    if (device) {
      setOpenAccordionItem(device.id);
      if (deviceStatuses[device.id] === '待处理') {
        handleStatusChange(device.id, '改配中');
      }
      
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
    const event = new CustomEvent('navigateTo', { detail: { target: `/` } });
    window.dispatchEvent(event);
  }

  const devicesWithStatus = workOrder.devices.map(d => ({
    ...d,
    status: deviceStatuses[d.id] || d.status,
  }));

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
            {devicesWithStatus.length > 0 ? (
               <Accordion 
                  type="single"
                  collapsible
                  value={openAccordionItem} 
                  onValueChange={(value) => {
                    const device = devicesWithStatus.find(d => d.id === value);
                    if (device && device.status === '待处理') {
                        handleStatusChange(device.id, '改配中');
                    }
                    setOpenAccordionItem(value);
                  }}
                  className="w-full space-y-2"
                >
                {devicesWithStatus.map(device => (
                    <div key={device.id} ref={el => (deviceRefs.current[device.id] = el)}>
                      <AccordionItem 
                        value={device.id} 
                        className="border-b-0 rounded-lg border bg-card text-card-foreground shadow-sm transition-all data-[state=open]:shadow-lg data-[state=open]:border-primary"
                      >
                          <AccordionTrigger className="px-4 py-3 hover:no-underline text-base">
                              <div className="flex items-center gap-3 w-full">
                                  {getDeviceIcon(device.type)}
                                  <div className='text-left flex-grow'>
                                      <p className="font-mono text-sm font-semibold">{device.serialNumber}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {formatLocation(device.location) ?? <span className="text-muted-foreground">线下设备</span>}
                                    </p>
                                  </div>
                                  <Badge className={cn("whitespace-nowrap text-xs", getStatusBadgeClass(device.status))}>
                                     {device.status}
                                  </Badge>
                              </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <DeviceOperation 
                                device={device} 
                                onStatusChange={(newStatus) => handleStatusChange(device.id, newStatus)}
                            />
                          </AccordionContent>
                      </AccordionItem>
                    </div>
                ))}
              </Accordion>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">此工单没有关联的设备。</p>
            )}
          </CardContent>
      </Card>
      
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 z-40">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Button variant="outline" size="lg" className="flex-shrink-0" onClick={() => setIsScanDeviceDialogOpen(true)}>
              <QrCode className="mr-2 h-5 w-5" />
              扫描设备
          </Button>
          <Button size="lg" className="flex-grow" onClick={handleCompleteWorkOrder}>
              完成工单
          </Button>
        </div>
      </div>

      <ScanDeviceDialog 
        isOpen={isScanDeviceDialogOpen}
        setIsOpen={setIsScanDeviceDialogOpen}
        onFindDevice={handleFindDevice}
      />
    </>
  )
}
