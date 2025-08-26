"use client"

import { useState } from 'react';
import type { WorkOrder, Component } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { ComponentSuggester } from './component-suggester';
import { Lightbulb, LightbulbOff, QrCode, MapPin, Layers, Server, HardDrive, MemoryStick, Cpu, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

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
        default: return <Server {...props} />;
    }
}

export function WorkOrderDetailClient({ workOrder }: { workOrder: WorkOrder }) {
  const [locatorLight, setLocatorLight] = useState<'off' | 'flashing' | 'on'>('off');
  const device = workOrder.devices[0]; // Assuming one device per order for this UI

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
  });

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
              <div>
                <CardTitle className="text-xl md:text-2xl">{workOrder.title}</CardTitle>
                <CardDescription>工单 #{workOrder.id}</CardDescription>
              </div>
              <Badge className={cn("text-base whitespace-nowrap w-fit", getStatusClass(workOrder.status))}>{workOrder.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                        <h4 className="font-semibold">位置</h4>
                        <p className="text-muted-foreground font-mono">{device.location.module} / {device.location.rack} / U{device.location.uPosition}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Server className="h-5 w-5 text-primary mt-1" />
                    <div>
                        <h4 className="font-semibold">设备序列号</h4>
                        <p className="text-muted-foreground font-mono font-code">{device.serialNumber}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3 col-span-full">
                    <QrCode className="h-5 w-5 text-primary mt-1" />
                    <div>
                        <h4 className="font-semibold">验证</h4>
                        <Button variant="outline" size="sm" className="mt-1">扫描序列号</Button>
                    </div>
                </div>
            </div>
          </CardContent>
          <CardFooter className='flex-wrap gap-2'>
             <Button size="sm" variant={locatorLight === 'flashing' ? 'default' : 'outline'} onClick={() => setLocatorLight('flashing')}>
                {locatorLight === 'flashing' ? <Lightbulb className="mr-2" /> : <LightbulbOff className="mr-2" />}
                闪灯
            </Button>
             <Button size="sm" variant={locatorLight === 'on' ? 'default' : 'outline'} onClick={() => setLocatorLight('on')}>
                {locatorLight === 'on' ? <Lightbulb className="mr-2" /> : <LightbulbOff className="mr-2" />}
                开灯
            </Button>
          </CardFooter>
        </Card>

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
                            <TableRow key={index} className={cn(item.currentQty !== item.targetQty && "bg-yellow-50")}>
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
                                    {item.currentQty > item.targetQty && <ArrowRight className="h-4 w-4 text-red-500 rotate-180"/>}
                                    {item.targetQty}
                                  </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className='text-xl'>所需组件和 AI 建议</CardTitle>
                <CardDescription>查找并获取此操作所需的部件。</CardDescription>
            </CardHeader>
            <CardContent>
                <ComponentSuggester />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className='text-xl'>可视化操作指南</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="diagram">
                    <TabsList className='grid w-full grid-cols-2'>
                        <TabsTrigger value="diagram">插槽示意图</TabsTrigger>
                        <TabsTrigger value="video">视频指南</TabsTrigger>
                    </TabsList>
                    <TabsContent value="diagram" className="mt-4">
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                           <Image src="https://picsum.photos/600/400" alt="主板示意图" fill className="object-cover" data-ai-hint="motherboard schematic" />
                        </div>
                    </TabsContent>
                    <TabsContent value="video" className="mt-4">
                       <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-slate-200 flex items-center justify-center">
                           <p className="text-muted-foreground">操作视频占位符。</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
