
"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

interface BulkCheckDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  deviceCount: number;
  onConfirm: () => void;
}

export function BulkCheckDialog({
  isOpen,
  setIsOpen,
  deviceCount,
  onConfirm,
}: BulkCheckDialogProps) {

  const handleConfirmClick = () => {
    onConfirm();
    toast({
      title: "批量检测已启动",
      description: `已对 ${deviceCount} 台服务器发起结单检测。`,
    });
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认批量结单检测？</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <p className="mb-2">
                将对工单内 <span className="font-bold text-primary">{deviceCount}</span> 台“待检测”服务器批量发起结单检测。
              </p>
              <p className="mb-2">
                - 若检测通过，则服务器状态更新为 <span className="font-semibold text-green-600">“改配完成”</span>。
              </p>
              <p>
                - 如不通过，服务器状态将更新为 <span className="font-semibold text-orange-600">“检测异常”</span>，您需要对“检测异常”的服务器进行单独处理。
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmClick}>确认发起</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
