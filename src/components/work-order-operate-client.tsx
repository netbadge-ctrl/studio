"use client"

import { useState, useRef, useEffect, useMemo } from 'react';
import type { WorkOrder, Component, Device, SOPStep } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Layers, Server as ServerIcon, HardDrive, MemoryStick, Cpu, ArrowRight, Network, Search, Video, Image as ImageIcon, QrCode, ArrowLeft, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image';


const getStatusClass = (status: WorkOrder["status"]) => {
  switch (status) {
    case "已完成": return "bg-green-100 text-green-800 border-green-200";
    case "进行中": return "bg-blue-100 text-primary border-blue-200";
    case "已阻塞": return "bg-red-100 text-red-800 border-red-200";
    case "已分配": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default: return "bg-muted text-muted-foreground";
  }
};

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

function SOPList({ sop, deviceId }: { sop: SOPStep[], deviceId: string }) {
  const [steps, setSteps] = useState(sop);

  const handleStepToggle = (step: number) => {
    setSteps(prevSteps => 
      prevSteps.map(s => 
        s.step === step ? { ...s, completed: !s.completed } : s
      )
    );
  };
  
  if (steps.length === 0) {
    return <p className="text-sm text-muted-foreground">此设备没有标准作业程序。</p>;
  }

  const completedCount = steps.filter(s => s.completed).length;
  const totalCount = steps.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-4">
       <div>
        <div className="flex justify-between items-center mb-1">
          <Label>进度</Label>
          <span className="text-xs font-medium">{completedCount} / {totalCount}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <div className="space-y-3">
        {steps.map(step => (
          <div key={step.step} className="flex items-center space-x-3">
            <Checkbox 
              id={`sop-${deviceId}-${step.step}`}
              checked={step.completed}
              onCheckedChange={() => handleStepToggle(step.step)}
            />
            <Label 
              htmlFor={`sop-${deviceId}-${step.step}`}
              className={cn("text-sm font-normal", step.completed && "line-through text-muted-foreground")}
            >
              {step.action}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}

function DeviceOperation({ device }: { device: Device }) {
  const operationDetails = useMemo(() => {
    const operations: { action: '装' | '卸', component: Component }[] = [];
    const currentMap = new Map(device.currentConfig.map(c => [`${c.partNumber}-${c.slot}`, c]));
    const targetMap = new Map(device.targetConfig.map(c => [`${c.partNumber}-${c.slot}`, c]));

    // Find components to remove
    for (const [key, component] of currentMap.entries()) {
      if (!targetMap.has(key)) {
        operations.push({ action: '卸', component });
      }
    }

    // Find components to add
    for (const [key, component] of targetMap.entries()) {
      if (!currentMap.has(key)) {
        operations.push({ action: '装', component });
      }
    }
    
    // Find components to swap (remove old, add new in same slot)
    for (const [key, currentComponent] of currentMap.entries()) {
        const targetComponent = targetMap.get(key);
        // This logic handles a swap as a separate case. If a component with a different partNumber is in the same slot.
        if(targetComponent && currentComponent.partNumber !== targetComponent.partNumber) {
            // It's a swap, which means one is removed, one is added.
            // Check if we already added these operations.
            const hasRemoveOp = operations.some(op => op.action === '卸' && op.component.slot === currentComponent.slot && op.component.partNumber === currentComponent.partNumber);
            const hasAddOp = operations.some(op => op.action === '装' && op.component.slot === targetComponent.slot && op.component.partNumber === targetComponent.partNumber);
            
            if (!hasRemoveOp) {
                operations.push({ action: '卸', component: currentComponent });
            }
            if (!hasAddOp) {
                 operations.push({ action: '装', component: targetComponent });
            }
        }
    }


    return operations.sort((a,b) => a.component.slot.localeCompare(b.component.slot));
  }, [device.currentConfig, device.targetConfig]);


  return (
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
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                 <Image 
                    src="https://picsum.photos/600/400"
                    alt="操作指引图片"
                    width={600}
                    height={400}
                    data-ai-hint="server maintenance"
                    className="rounded-lg object-cover"
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

      <Card>
        <CardHeader>
            <CardTitle className='text-xl'>操作步骤 (SOP)</CardTitle>
            <CardDescription>请按顺序完成以下步骤。</CardDescription>
        </CardHeader>
        <CardContent>
          <SOPList sop={device.sop} deviceId={device.id} />
        </CardContent>
      </Card>

      {operationDetails.length > 0 && (
        <Card>
            <CardHeader>
                <CardTitle className='text-xl'>配件操作明细</CardTitle>
                <CardDescription>根据下表完成配件的安装与卸载。</CardDescription>
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
                            <TableRow key={index} className={cn(action === '装' ? 'bg-green-50/50' : 'bg-red-50/50')}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {getComponentIcon(component.type)}
                                        <div>
                                            <p className="font-medium text-xs sm:text-sm">{component.model}</p>
                                            <p className="text-xs text-muted-foreground">{component.type}</p>
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
    </div>
  );
}

export function WorkOrderOperateClient({ workOrder }: { workOrder: WorkOrder }) {
  const { toast } = useToast();
  const router = useRouter();
  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>([]);
  const [serialNumberInput, setSerialNumberInput] = useState('');
  const deviceRefs = useRef<Record<string, HTMLDivElement | null>>({});


  const handleFindDevice = () => {
    if (!serialNumberInput) return;

    const device = workOrder.devices.find(d => d.serialNumber.toLowerCase() === serialNumberInput.toLowerCase());

    if (device) {
      setOpenAccordionItems(prev => [...new Set([...prev, device.id])]);
      
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

  // Fallback icon for actions
  const ArrowDown = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14"/>
      <path d="m19 12-7 7-7-7"/>
    </svg>
  );

  return (
    <Card>
        <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
              <div>
                  <CardTitle className="text-xl md:text-2xl">{workOrder.title}</CardTitle>
                  <CardDescription>工单 #{workOrder.id} - 步骤 2/2: 操作</CardDescription>
              </div>
              <Badge className={cn("text-base whitespace-nowrap w-fit", getStatusClass(workOrder.status))}>{workOrder.status}</Badge>
            </div>
        </CardHeader>
        <CardContent>
           <div className="p-4 border rounded-lg bg-muted/50 mb-6">
                <Label htmlFor="serial-number-input" className="font-semibold flex items-center gap-2 mb-2">
                    <QrCode className="h-5 w-5" />
                    扫描或输入设备序列号
                </Label>
                <div className="flex gap-2">
                    <Input 
                        id="serial-number-input" 
                        placeholder="例如: SN-A7B3C9D1E5"
                        value={serialNumberInput}
                        onChange={(e) => setSerialNumberInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleFindDevice()}
                    />
                    <Button onClick={handleFindDevice}><Search className="mr-2 h-4 w-4" /> 查找</Button>
                </div>
            </div>

          {workOrder.devices.length > 0 ? (
             <Accordion 
                type="multiple" 
                value={openAccordionItems} 
                onValueChange={setOpenAccordionItems}
                className="w-full space-y-2"
              >
              {workOrder.devices.map(device => (
                  <div key={device.id} ref={el => (deviceRefs.current[device.id] = el)}>
                    <AccordionItem value={device.id} className="border-b-0 rounded-lg border bg-card text-card-foreground shadow-sm data-[state=open]:shadow-md">
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
         <CardFooter>
            <Button size="lg" className="w-full" onClick={handleCompleteWorkOrder}>
                完成工单
            </Button>
        </CardFooter>
    </Card>
  )
}
