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
    case "Completed": return "bg-green-100 text-green-800 border-green-200";
    case "In Progress": return "bg-blue-100 text-primary border-blue-200";
    case "Blocked": return "bg-red-100 text-red-800 border-red-200";
    case "Assigned": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default: return "bg-muted text-muted-foreground";
  }
};

const getComponentIcon = (type: Component['type']) => {
    const props = { className: "h-4 w-4 text-muted-foreground" };
    switch(type) {
        case 'SATA': return <HardDrive {...props} />;
        case 'SSD': return <HardDrive {...props} />;
        case 'Memory': return <MemoryStick {...props} />;
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
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{workOrder.title}</CardTitle>
                <CardDescription>Work Order #{workOrder.id}</CardDescription>
              </div>
              <Badge className={cn("text-base", getStatusClass(workOrder.status))}>{workOrder.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                        <h4 className="font-semibold">Location</h4>
                        <p className="text-muted-foreground font-mono">{device.location.module} / {device.location.rack} / U{device.location.uPosition}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Server className="h-5 w-5 text-primary mt-1" />
                    <div>
                        <h4 className="font-semibold">Device SN</h4>
                        <p className="text-muted-foreground font-mono font-code">{device.serialNumber}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <QrCode className="h-5 w-5 text-primary mt-1" />
                    <div>
                        <h4 className="font-semibold">Verification</h4>
                        <Button variant="outline" size="sm" className="mt-1">Scan SN Code</Button>
                    </div>
                </div>
            </div>
          </CardContent>
          <CardFooter>
             <div className="space-x-2">
                <Button variant={locatorLight === 'flashing' ? 'default' : 'outline'} onClick={() => setLocatorLight('flashing')}>
                    {locatorLight === 'flashing' ? <Lightbulb className="mr-2 h-4 w-4" /> : <LightbulbOff className="mr-2 h-4 w-4" />}
                    Flash Light
                </Button>
                 <Button variant={locatorLight === 'on' ? 'default' : 'outline'} onClick={() => setLocatorLight('on')}>
                    {locatorLight === 'on' ? <Lightbulb className="mr-2 h-4 w-4" /> : <LightbulbOff className="mr-2 h-4 w-4" />}
                    Turn On Light
                </Button>
            </div>
          </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Configuration Comparison</CardTitle>
                <CardDescription>Review changes between current and target configurations.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Component</TableHead>
                            <TableHead className="text-center">Current Qty</TableHead>
                            <TableHead className="text-center">Target Qty</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {comparisonData.map((item, index) => (
                            <TableRow key={index} className={cn(item.currentQty !== item.targetQty && "bg-yellow-50")}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {getComponentIcon(item.type!)}
                                        <div>
                                            <p className="font-medium">{item.type}</p>
                                            <p className="text-xs text-muted-foreground font-code">{item.model}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center font-medium">{item.currentQty}</TableCell>
                                <TableCell className={cn("text-center font-bold", item.currentQty !== item.targetQty && "text-accent-foreground")}>
                                  <div className="flex items-center justify-center gap-2">
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
                <CardTitle>Required Components & AI Suggestions</CardTitle>
                <CardDescription>Find and retrieve necessary parts for this operation.</CardDescription>
            </CardHeader>
            <CardContent>
                <ComponentSuggester />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Visual Operation Guides</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="diagram">
                    <TabsList>
                        <TabsTrigger value="diagram">Slot Diagram</TabsTrigger>
                        <TabsTrigger value="video">Video Guide</TabsTrigger>
                    </TabsList>
                    <TabsContent value="diagram" className="mt-4">
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                           <Image src="https://picsum.photos/600/400" alt="Motherboard diagram" fill className="object-cover" data-ai-hint="motherboard schematic" />
                        </div>
                    </TabsContent>
                    <TabsContent value="video" className="mt-4">
                       <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-slate-200 flex items-center justify-center">
                           <p className="text-muted-foreground">Operation video placeholder.</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
