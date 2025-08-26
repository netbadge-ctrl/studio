import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import { workOrders } from "@/lib/mock-data";
import type { WorkOrder } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowRight, Server, Wrench, HardDrive } from "lucide-react";

const getStatusClass = (status: WorkOrder["status"]) => {
  switch (status) {
    case "已完成":
      return "bg-green-100 text-green-800 border-green-200";
    case "进行中":
      return "bg-blue-100 text-primary border-blue-200";
    case "已阻塞":
      return "bg-red-100 text-red-800 border-red-200";
    case "已分配":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getTypeIcon = (type: WorkOrder["type"]) => {
  switch(type) {
    case '服务器改造':
      return <Wrench className="w-5 h-5" />;
    case '新服务器部署':
      return <Server className="w-5 h-5" />;
    case '交换机维护':
      return <HardDrive className="w-5 h-5" />;
    default:
      return <Wrench className="w-5 h-5" />;
  }
}

export default function Home() {
  const myWorkOrders = workOrders.filter((wo) =>
    wo.assignedTo.some((e) => e.id === "emp-001")
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <MainNav />
      <main className="flex-1 bg-muted/40 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <header>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              我的工单
            </h1>
            <p className="mt-1 text-muted-foreground">
              以下是分配给您的任务。
            </p>
          </header>
          <div className="grid gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-3">
            {myWorkOrders.map((order) => (
              <Link href={`/work-orders/${order.id}`} key={order.id} className="group">
                <Card className="h-full flex flex-col transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-base font-bold">{order.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 text-xs">
                          {getTypeIcon(order.type)}
                          {order.type}
                        </CardDescription>
                      </div>
                      <Badge className={cn("whitespace-nowrap text-xs", getStatusClass(order.status))}>
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">
                      需要操作 {order.devices.length} 台设备。
                    </p>
                    <div className="mt-2 text-xs text-foreground font-mono font-medium">
                      {order.devices.map(d => d.serialNumber).join(', ')}
                    </div>
                  </CardContent>
                  <CardFooter className="text-xs text-primary group-hover:text-accent-foreground font-medium flex items-center justify-end">
                    查看详情
                    <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
