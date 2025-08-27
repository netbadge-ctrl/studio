"use client"

import { useState } from 'react';
import type { WorkOrder, Component, Device, SOPStep } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Lightbulb, LightbulbOff, QrCode, Layers, Server as ServerIcon, HardDrive, MemoryStick, Cpu, ArrowRight, Network } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


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
  const [locatorLight, setLocatorLight] = useState<'off' | 'flashing' | 'on'>('off');
  
  const allComponents = [...device.currentConfig, ...device.targetConfig];
  const uniqueKeys = Array.from(new Set(allComponents.map(c => c.partNumber)));
  
  const comparisonData = uniqueKeys.map(key => {
    const current = device.currentConfig.find(c => c.partNumber === key);
    const target = device.targetConfig.find(c => c.partNumber === key);
    return {
      type: current?.type || target?.type,
      model: current?.model || target?.model,
      currentQty: current?.quantity || 0,
      targetQty: target?.quantity || 0,
    };
  }).filter(item => item.type);

  return (
    <div className="space-y-6 mt-4">
       <div className="flex items-start gap-3">
            <QrCode className="h-5 w-5 text-primary mt-1" />
            <div>
                <h4 className="font-semibold">验证</h4>
                 <p className="text-xs text-muted-foreground mb-2">扫描设备SN码进行验证: {device.serialNumber}</p>
                <Button variant="outline" size="sm" className="mt-1">扫描序列号</Button>
            </div>
        </div>

      <div className='flex-wrap gap-2 flex'>
          <Button size="sm" variant={locatorLight === 'flashing' ? 'default' : 'outline'} onClick={() => setLocatorLight('flashing')}>
              {locatorLight === 'flashing' ? <Lightbulb className="mr-2" /> : <LightbulbOff className="mr-2" />}
              闪灯
          </Button>
            <Button size="sm" variant={locatorLight === 'on' ? 'default' : 'outline'} onClick={() => setLocatorLight('on')}>
              {locatorLight === 'on' ? <Lightbulb className="mr-2" /> : <LightbulbOff className="mr-2" />}
              开灯
          </Button>
      </div>

      <Card>
        <CardHeader>
            <CardTitle className='text-xl'>操作步骤 (SOP)</CardTitle>
            <CardDescription>请按顺序完成以下步骤。</CardDescription>
        </CardHeader>
        <CardContent>
          <SOPList sop={device.sop} deviceId={device.id} />
        </CardContent>
      </Card>

      {comparisonData.length > 0 && (
        <Card>
            <CardHeader>
                <CardTitle className='text-xl'>配置对比</CardTitle>
                <CardDescription>检查当前配置和目标配置之间的变更。</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>组件</TableHead>
                            <TableHead className="text-center">当前</TableHead>
                            <TableHead className="text-center">目标</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {comparisonData.map((item, index) => (
                            <TableRow key={index} className={cn(item.currentQty !== item.targetQty && "bg-yellow-50/50")}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {getComponentIcon(item.type!)}
                                        <div>
                                            <p className="font-medium text-xs sm:text-sm">{item.type}</p>
                                            <p className="text-xs text-muted-foreground font-code hidden sm:block">{item.model}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center font-medium">{item.currentQty}</TableCell>
                                <TableCell className={cn("text-center font-bold", item.currentQty !== item.targetQty && "text-accent-foreground")}>
                                  <div className="flex items-center justify-center gap-1 sm:gap-2">
                                    {item.currentQty < item.targetQty && <ArrowRight className="h-4 w-4 text-green-500"/>}
                                    {item.currentQty > item.targetQty && <ArrowRight className="h-4 w-4 text-red-500 -rotate-180"/>}
                                    {item.targetQty}
                                  </div>
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
  const defaultOpen = workOrder.devices.length > 0 ? [workOrder.devices[0].id] : [];
  const { toast } = useToast();
  const router = useRouter();

  const handleCompleteWorkOrder = () => {
    // Here you would typically handle the state update and API call
    toast({
      title: "工单已完成",
      description: "工单已成功标记为“已完成”。",
      variant: 'default',
    });
    router.push('/');
  }

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
          {workOrder.devices.length > 0 ? (
             <Accordion type="multiple" defaultValue={defaultOpen} className="w-full space-y-2">
              {workOrder.devices.map(device => (
                  <AccordionItem value={device.id} key={device.id} className="border-b-0 rounded-lg border bg-card text-card-foreground shadow-sm data-[state=open]:shadow-md">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline text-base">
                          <div className="flex items-center gap-3">
                              {getDeviceIcon(device.type)}
                              <div className='text-left'>
                                  <p className='font-semibold'>{device.type}</p>
                                  <p className="text-xs font-normal text-muted-foreground font-code">{device.serialNumber}</p>
                              </div>
                          </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                         <DeviceOperation device={device} />
                      </AccordionContent>
                  </AccordionItem>
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
