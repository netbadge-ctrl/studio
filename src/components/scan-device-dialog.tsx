
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

interface ScanDeviceDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onFindDevice: (serialNumber: string) => void;
  defaultSerialNumber?: string;
}

export function ScanDeviceDialog({
  isOpen,
  setIsOpen,
  onFindDevice,
  defaultSerialNumber = "",
}: ScanDeviceDialogProps) {
  const [serialNumber, setSerialNumber] = React.useState(defaultSerialNumber);

  React.useEffect(() => {
    if (isOpen) {
      setSerialNumber(defaultSerialNumber);
    }
  }, [isOpen, defaultSerialNumber]);

  const handleSubmit = () => {
    onFindDevice(serialNumber);
    setSerialNumber("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            查找设备
          </DialogTitle>
          <DialogDescription>
            扫描或输入设备的序列号以快速定位。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="serial-number">序列号</Label>
            <Input
              id="serial-number"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="例如: SN-A7B3C9D1E5"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={!serialNumber}>
            <Search className="mr-2 h-4 w-4" />
            查找
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
