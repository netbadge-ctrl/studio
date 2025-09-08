
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
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';


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
    const uPosition = `U${location.uPosition.toString().padStart(2, '0')}`;
    
    // Construct a consistent, yet dynamic rack identifier based on the mock data
    const rackIdentifier = `${modulePrefix}DC01-R${rackNumber}F01-JC-${rackNumber}-1`;

    return `${rackIdentifier} / ${uPosition}`;
};

export function WorkOrderDetailClient({ workOrder }: { workOrder: WorkOrder }) {
  const sortedDevices = React.useMemo(() => {
    return [...workOrder.devices].sort((a, b) => {
      if (!a.location && b.location) return -1; // a (offline) comes first
      if (a.location && !b.location) return 1;  // b (offline) comes first
      if (!a.location && !b.location) return a.serialNumber.localeCompare(b.serialNumber); // both offline, sort by SN

      // Both online, sort by location
      const locA = formatLocation(a.location!);
      const locB = formatLocation(b.location!);
      return locA.localeCompare(locB);
    });
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

  const handleNavigate = (e: React.MouseEvent) => {
      e.preventDefault();
      const event = new CustomEvent('navigateTo', { detail: { target: `/work-orders/${workOrder.id}/operate` } });
      window.dispatchEvent(event);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <div>
              <CardTitle className="text-xl md:text-2xl">{workOrder.title}</CardTitle>
              <CardDescription>
                工单 #{workOrder.id} - 步骤 1/2: 准备
              </CardDescription>
            </div>
            <Badge
              className={cn(
                'text-base whitespace-nowrap w-fit',
                getStatusClass(workOrder.status)
              )}
            >
              {workOrder.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                设备清单
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>设备</TableHead>
                      <TableHead>位置</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedDevices.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {getDeviceIcon(device.type)}
                            <div>
                                <p className="font-mono text-sm text-foreground">{device.serialNumber}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                           {device.location ? (
                                formatLocation(device.location)
                            ) : (
                                <span className="text-muted-foreground">线下设备</span>
                            )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex justify-between items-center text-lg'>
                <span className="flex items-center gap-2">
                  <PackageSearch className="h-5 w-5 text-primary" />
                  所需备件
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {requiredComponents.length > 0 ? (
                  <ul className="space-y-2">
                    {requiredComponents.map(({ component: comp, quantity }) => (
                      <li key={comp.partNumber} className="flex items-center justify-between gap-x-4 py-3 border-b last:border-b-0">
                        <div className="flex-grow">
                          <p className='font-semibold leading-tight whitespace-nowrap'>{comp.model}</p>
                          <p className='text-xs text-muted-foreground'>{comp.type} / {comp.manufacturer}</p>
                        </div>
                        <div className='flex flex-col items-end flex-shrink-0'>
                          <span className="font-bold text-primary text-lg">x {quantity}</span>
                          <p className='text-xs font-mono text-muted-foreground mt-1'>仓库盒号: {comp.partNumber}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-muted-foreground text-center py-4">
                      此工单无需更换或添加备件。
                    </p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </CardContent>
        <CardFooter className="flex justify-end pt-6">
          <Button onClick={handleNavigate} size="lg" className='gap-2'>
              开始操作
              <ArrowRight />
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
