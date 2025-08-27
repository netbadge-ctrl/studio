"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, QrCode } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { partScanner } from "@/lib/part-scanner";

interface ScanPartDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function ScanPartDialog({
  isOpen,
  setIsOpen,
}: ScanPartDialogProps) {
  const [partNumber, setPartNumber] = React.useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!partNumber) return;

    partScanner.emit('scan', partNumber);

    toast({
        title: "正在高亮配件",
        description: `已触发部件号 ${partNumber} 的高亮显示。`,
    });
    
    setPartNumber("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            查找配件
          </DialogTitle>
          <DialogDescription>
            扫描或输入配件的部件号以快速高亮定位。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="part-number">部件号</Label>
            <Input
              id="part-number"
              value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="例如: MEM-16G-2400-A"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit}>
            <Search className="mr-2 h-4 w-4" />
            查找
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
