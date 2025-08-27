"use client";

import * as React from 'react';
import type { WorkOrder, Component as ComponentType } from '@/lib/types';
import Link from 'next/link';
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
  MapPin,
  ArrowRight,
  Server as ServerIcon,
  HardDrive,
  Network,
  Layers,
  Wand2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GetPartsDialog } from './get-parts-dialog';


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
  const props = { className: 'h-5 w-5 text-primary' };
  switch (type) {
    case '服务器':
      return <ServerIcon {...props} />;
    case '交换机':
      return <Network {...props} />;
    case '存储设备':
      return <HardDrive {...props} />;
    default:
      return <Layers {...props} />;
  }
};

export function WorkOrderDetailClient({ workOrder }: { workOrder: WorkOrder }) {
  const [isGetPartsDialogOpen, setIsGetPartsDialogOpen] = React.useState(false);

  const requiredComponents = React.useMemo(() => {
    const componentsMap = new Map<string, { component: ComponentType, model: string, quantity: number }>();

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
              const model = `${componentInfo.manufacturer} ${componentInfo.model}`
              if (existing) {
                existing.quantity += requiredQty;
              } else {
                componentsMap.set(partNumber, { component: componentInfo, model, quantity: requiredQty });
              }
           }
        }
      });
    });

    const components = Array.from(componentsMap.values());
    
    return components.sort((a, b) => {
        if (a.component.type !== b.component.type) {
            return a.component.type.localeCompare(b.component.type);
        }
        return a.component.partNumber.localeCompare(b.component.partNumber);
    });
  }, [workOrder.devices]);

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
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              设备位置
            </h3>
            <ScrollArea className="h-72 w-full p-4 bg-muted/50 rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>设备类型</TableHead>
                    <TableHead>型号</TableHead>
                    <TableHead>序列号</TableHead>
                    <TableHead>位置</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workOrder.devices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell>
                        <div className="flex items-center gap-2 font-medium">
                          {getDeviceIcon(device.type)}
                          <span>{device.type}</span>
                        </div>
                      </TableCell>
                       <TableCell className="text-xs">{device.model}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {device.serialNumber}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {device.location.module} / {device.location.rack} / U
                        {device.location.uPosition}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          <div className="space-y-4">
             <div className='flex justify-between items-center'>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <PackageSearch className="h-5 w-5 text-primary" />
                  所需备件
                </h3>
                {requiredComponents.length > 0 && (
                    <Button variant="outline" size="sm" onClick={() => setIsGetPartsDialogOpen(true)}>
                        <Wand2 className='mr-2 h-4 w-4' />
                        AI 领取建议
                    </Button>
                )}
             </div>
            {requiredComponents.length > 0 ? (
              <div className="p-4 bg-muted/50 rounded-lg border">
                <ul className="space-y-4">
                  {requiredComponents.map(({ component: comp, quantity, model }) => (
                    <li key={comp.partNumber} className="grid grid-cols-[1fr_auto] items-start gap-x-4">
                      <div>
                         <p className='font-semibold leading-tight'>{model}</p>
                         <p className='text-xs text-muted-foreground'>{comp.type} / {comp.manufacturer}</p>
                      </div>
                      <div className='flex flex-col items-end'>
                        <span className="font-bold text-primary text-lg">x {quantity}</span>
                         <p className='text-xs font-mono text-muted-foreground mt-1'>部件号: {comp.partNumber}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                此工单无需更换或添加备件。
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-2 md:flex-row-reverse">
          <Button asChild size="lg">
            <Link href={`/work-orders/${workOrder.id}/operate`}>
              开始操作
              <ArrowRight />
            </Link>
          </Button>
        </CardFooter>
      </Card>
      <GetPartsDialog 
        isOpen={isGetPartsDialogOpen}
        setIsOpen={setIsGetPartsDialogOpen}
        requiredComponents={requiredComponents}
      />
    </>
  );
}
