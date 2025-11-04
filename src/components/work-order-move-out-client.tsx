
"use client";

import type { WorkOrder } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function WorkOrderMoveOutClient({ workOrder }: { workOrder: WorkOrder }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>搬出操作</CardTitle>
      </CardHeader>
      <CardContent>
        <p>此页面用于工单 #{workOrder.id} 的服务器搬出操作。</p>
        <p className="mt-4 text-muted-foreground">功能正在开发中...</p>
      </CardContent>
    </Card>
  );
}
