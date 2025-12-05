
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
import { Search, QrCode, Camera, AlertTriangle } from 'lucide-react';
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";

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
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setSerialNumber(defaultSerialNumber);

      const getCameraPermission = async () => {
        if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
          setHasCameraPermission(false);
          return;
        }
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
  
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
        }
      };
  
      getCameraPermission();
      
      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [isOpen, defaultSerialNumber]);

  const handleSimulatedScan = () => {
    if (defaultSerialNumber) {
        handleSubmit(defaultSerialNumber);
    }
  }

  const handleSubmit = (sn: string) => {
    if (!sn.trim()) return;
    onFindDevice(sn);
    setSerialNumber("");
    setIsOpen(false);
  };
  
  const renderCameraView = () => {
    if (hasCameraPermission === null) {
      return (
        <div className="w-full h-48">
            <Skeleton className="h-full w-full rounded-md" />
            <p className="text-sm text-muted-foreground mt-2 text-center">正在请求摄像头权限...</p>
        </div>
      )
    }

    if (hasCameraPermission === false) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>摄像头访问受限</AlertTitle>
          <AlertDescription>
            无法访问摄像头。请在浏览器设置中授予权限，或使用下方的“手动输入”功能。
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="relative w-full h-48 bg-black rounded-lg overflow-hidden border">
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
          <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3/4 h-1/2 border-4 border-dashed border-white/50 rounded-lg" />
          </div>
           <p className="text-center text-xs text-white/80 bg-black/50 p-1 absolute bottom-0 w-full">
             请将设备的SN条码对准扫描框
           </p>
        </div>
        <Button 
          variant="secondary" 
          className="w-full" 
          onClick={handleSimulatedScan}
          disabled={!hasCameraPermission}
        >
          <Camera className="mr-2" />
          模拟扫码成功
        </Button>
      </div>
    );
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
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
          {renderCameraView()}
          <div className="space-y-2">
            <Label htmlFor="serial-number">无法扫描？请手动输入</Label>
            <div className="flex gap-2">
                <Input
                id="serial-number"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(serialNumber)}
                placeholder="在此输入序列号"
                />
                <Button onClick={() => handleSubmit(serialNumber)} disabled={!serialNumber}>
                    <Search className="h-4 w-4" />
                </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            取消
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
