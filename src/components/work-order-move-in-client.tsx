
"use client";

import type { WorkOrder } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function WorkOrderMoveInClient({ workOrder }: { workOrder: WorkOrder }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>迁入操作</CardTitle>
      </CardHeader>
      <CardContent>
        <p>此页面用于工单 #{workOrder.id} 的服务器迁入操作。</p>
        <p className="mt-4 text-muted-foreground">功能正在开发中...</p>
      </CardContent>
    </Card>
  );
}
