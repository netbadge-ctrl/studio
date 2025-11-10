
"use client";

import * as React from 'react';
import type { WorkOrder, Component as ComponentType } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  PackageSearch,
  ArrowRight,
  Server as ServerIcon,
  Layers,
  ArrowLeftRight,
  Zap,
  ChevronDown,
  List,
  ListChecks
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


const getStatusClass = (status: WorkOrder['status']) => {
  switch (status) {
    case '已完成':
      return 'bg-green-100 text-green-800 border-green-200';
    case '进行中':
      return 'bg-blue-100 text-primary border-blue-200';
    case '已阻塞':
      return 'bg-red-100 text-red-800 border-red-200';
    case '已分配':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getDeviceIcon = (type: WorkOrder['devices'][0]['type']) => {
  const props = { className: 'h-5 w-5 text-primary flex-shrink-0' };
  switch (type) {
    case '服务器':
      return <ServerIcon {...props} />;
    default:
      return <Layers {...props} />;
  }
};

const formatLocation = (location: NonNullable<WorkOrder['devices'][0]['location']>) => {
    const modulePrefix = location.module.includes('北京') ? 'BJ' : 'TJ';
    const rackNumber = location.rack.replace('R', '').padStart(2, '0');
    
    // Construct a consistent, yet dynamic rack identifier based on the mock data
    const rackIdentifier = `${modulePrefix}DC01-R${rackNumber}F01-JC-${rackNumber}-1`;

    return `${rackIdentifier} / U${location.uPosition}`;
};

export function WorkOrderDetailClient({ workOrder }: { workOrder: WorkOrder }) {
  const sortedDevices = React.useMemo(() => {
    return [...workOrder.devices].sort((a, b) => {
      const aIsOnline = !!a.location;
      const bIsOnline = !!b.location;

      if (aIsOnline && !bIsOnline) return 1;
      if (!aIsOnline && bIsOnline) return -1;
      
      if(a.location && b.location) {
        return formatLocation(a.location).localeCompare(formatLocation(b.location));
      }
      
      return a.serialNumber.localeCompare(b.serialNumber);
    });
  }, [workOrder.devices]);

  const completionStatus = React.useMemo(() => {
    const totalDevices = workOrder.devices.length;
    if (totalDevices === 0) {
      return "";
    }
    const completedDevices = workOrder.devices.filter(d => d.status === '改配完成').length;
    return `(完成度: ${completedDevices}/${totalDevices})`;
  }, [workOrder.devices]);


  const requiredComponents = React.useMemo(() => {
    const componentsMap = new Map<string, { component: ComponentType, quantity: number }>();

    const sortedDevices = [...workOrder.devices].sort((a, b) => a.id.localeCompare(b.id));

    sortedDevices.forEach((device) => {
      const targetComponents = new Map<string, number>();
      device.targetConfig.forEach(c => {
        targetComponents.set(c.partNumber, (targetComponents.get(c.partNumber) || 0) + 1);
      });

      const currentComponents = new Map<string, number>();
      device.currentConfig.forEach(c => {
        currentComponents.set(c.partNumber, (currentComponents.get(c.partNumber) || 0) + 1);
      });
      
      const allPartNumbers = Array.from(new Set([...targetComponents.keys(), ...currentComponents.keys()])).sort();

      allPartNumbers.forEach(partNumber => {
        const targetQty = targetComponents.get(partNumber) || 0;
        const currentQty = currentComponents.get(partNumber) || 0;
        const requiredQty = targetQty - currentQty;
        
        if (requiredQty > 0) {
           const componentInfo = device.targetConfig.find(c => c.partNumber === partNumber) || device.currentConfig.find(c => c.partNumber === partNumber);
           if(componentInfo) {
              const existing = componentsMap.get(partNumber);
              if (existing) {
                existing.quantity += requiredQty;
              } else {
                componentsMap.set(partNumber, { component: componentInfo, quantity: requiredQty });
              }
           }
        }
      });
    });

    return Array.from(componentsMap.values()).sort((a, b) => a.component.model.localeCompare(b.component.model));
  }, [workOrder.devices]);

  const handleNavigate = (e: React.MouseEvent, path: string) => {
      e.preventDefault();
      const event = new CustomEvent('navigateTo', { detail: { target: path } });
      window.dispatchEvent(event);
  }

  const renderFooter = () => {
    if (workOrder.type === '服务器搬迁') {
      return (
        <Button onClick={(e) => handleNavigate(e, `/work-orders/${workOrder.id}/move-out`)} size="lg" className="gap-2 w-full">
          开始搬出
          <ArrowRight />
        </Button>
      )
    }

    return (
      <Button onClick={(e) => handleNavigate(e, `/work-orders/${workOrder.id}/operate`)} size="lg" className='gap-2 w-full'>
          开始操作
          <ArrowRight />
      </Button>
    )
  }

  return (
    <>
      <div className='space-y-4'>
        <Card>
          <CardHeader className="px-4 py-2 bg-muted/50 rounded-t-lg">
            <CardTitle className='text-base'>设备清单 {completionStatus}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-72">
              <Table>
                <TableBody>
                  {sortedDevices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell className="p-4">
                        <div className="flex items-center gap-3">
                          {getDeviceIcon(device.type)}
                          <div className="flex flex-col">
                              <p className="font-mono text-sm text-foreground font-semibold">{device.serialNumber}</p>
                              <p className="font-mono text-xs text-muted-foreground">
                                 {device.location ? (
                                      formatLocation(device.location)
                                  ) : (
                                      <span className="text-muted-foreground">线下设备</span>
                                  )}
                              </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-4 py-2 bg-muted/50 rounded-t-lg">
            <div className="flex items-center gap-2">
                <CardTitle className='flex items-center gap-2 text-base'>
                  <PackageSearch className="h-5 w-5 text-primary" />
                  所需备件
                </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
              {requiredComponents.length > 0 ? (
                <ScrollArea className="h-72">
                  <Accordion type="single" collapsible className="w-full">
                    <ul className="space-y-2 p-4">
                      {requiredComponents.map(({ component: comp, quantity }, index) => {
                        const isHighPerformance = comp.type === '网卡';
                        const modelName = `备件Model号${index + 1}`;

                        if (isHighPerformance) {
                          return (
                            <li key={comp.partNumber} className="border-b last:border-b-0">
                              <AccordionItem value={comp.partNumber} className="border-b-0">
                                <AccordionTrigger className="py-2 hover:no-underline">
                                  <div className="flex items-center justify-between gap-x-4 w-full">
                                    <div className="flex-grow text-left">
                                      <div className='flex items-center gap-2'>
                                        <p className='font-mono text-sm text-foreground font-semibold'>{modelName}</p>
                                        <div className="flex items-center gap-1 text-red-500">
                                          <Zap className="h-4 w-4 text-yellow-500 fill-current" />
                                          <span className="text-xs font-semibold">有性能要求</span>
                                        </div>
                                      </div>
                                      <p className='text-xs text-muted-foreground'>{comp.type} / {comp.manufacturer}</p>
                                    </div>
                                    <div className='flex flex-col items-end flex-shrink-0'>
                                      <span className="font-mono text-sm text-foreground font-semibold">x {quantity}</span>
                                      <p className='text-xs font-mono text-muted-foreground mt-1'>仓库盒号: {comp.partNumber}</p>
                                    </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-4 pt-2 bg-muted/50 rounded-b-lg px-4">
                                  <div className="space-y-3">
                                      <div>
                                        <h4 className="text-sm font-semibold flex items-center gap-2 mb-2"><List className="h-4 w-4 text-primary" />性能要求</h4>
                                        <div className="pl-6 text-xs text-muted-foreground space-y-1">
                                            <p>• 网络延迟 &lt; 10us P99</p>
                                            <p>• 吞吐量 &gt; 90Gbps</p>
                                        </div>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-semibold flex items-center gap-2 mb-2"><ListChecks className="h-4 w-4 text-primary" />推荐备件SN清单</h4>
                                        <div className="pl-6 text-xs text-muted-foreground font-mono space-y-1">
                                            <p>SN-NIC-23A8F-001</p>
                                            <p>SN-NIC-23A8F-002</p>
                                            <p>SN-NIC-23A8F-005</p>
                                        </div>
                                      </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </li>
                          );
                        }
                        
                        return (
                          <li key={comp.partNumber} className="flex items-center justify-between gap-x-4 py-2 border-b last:border-b-0">
                            <div className="flex-grow">
                              <p className='font-mono text-sm text-foreground font-semibold'>{modelName}</p>
                              <p className='text-xs text-muted-foreground'>{comp.type} / {comp.manufacturer}</p>
                            </div>
                            <div className='flex flex-col items-end flex-shrink-0'>
                              <span className="font-mono text-sm text-foreground font-semibold">x {quantity}</span>
                              <p className='text-xs font-mono text-muted-foreground mt-1'>仓库盒号: {comp.partNumber}</p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </Accordion>
                </ScrollArea>
              ) : (
                <div className="flex items-center justify-center h-full p-4">
                  <p className="text-sm text-muted-foreground text-center py-4">
                    此工单无需更换或添加备件。
                  </p>
                </div>
              )}
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 z-40">
        <div className="max-w-7xl mx-auto">
          {renderFooter()}
        </div>
      </div>
    </>
  );
}

    