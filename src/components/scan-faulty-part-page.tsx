
"use client";

import * as React from "react";
import type { Component } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Camera, AlertTriangle, Type, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface ScanFaultyPartPageProps {
  component: Component;
  onScanComplete: (serialNumber: string) => void;
}

export function ScanFaultyPartPage({ component, onScanComplete }: ScanFaultyPartPageProps) {
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);
  const [manualSerialNumber, setManualSerialNumber] = React.useState("");
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const getCameraPermission = async () => {
      // Check if running in a browser environment
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
    
    // Cleanup function to stop the video stream when the component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleManualSubmit = () => {
    if (!manualSerialNumber.trim()) {
      toast({
        variant: "destructive",
        title: "序列号不能为空",
        description: "请输入坏件的序列号。",
      });
      return;
    }
    toast({
        title: "录入成功",
        description: `已添加坏件 SN: ${manualSerialNumber}`
    });
    onScanComplete(manualSerialNumber.trim());
  };

  const renderCameraView = () => {
    if (hasCameraPermission === null) {
      return (
        <div className="aspect-video w-full">
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
            无法访问摄像头。请在浏览器设置中授予摄像头权限，或使用下方的“手动输入”功能。
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border">
        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-1/2 border-4 border-dashed border-white/50 rounded-lg" />
        </div>
        <p className="text-center text-xs text-white/80 bg-black/50 p-1 absolute bottom-0 w-full">
          请将序列号条码对准扫描框
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
            <CardTitle>扫描坏件: {component.model}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderCameraView()}
          <Button 
            variant="secondary" 
            className="w-full" 
            onClick={() => onScanComplete(`SN-FAULT-${Date.now()}`)}
            disabled={!hasCameraPermission}
          >
            <Camera className="mr-2" />
            模拟扫码成功
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>无法扫描？尝试手动输入</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="serial-number">坏件序列号</Label>
                <Input
                id="serial-number"
                value={manualSerialNumber}
                onChange={(e) => setManualSerialNumber(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
                placeholder="在此输入序列号"
                />
            </div>
            <Button className="w-full" onClick={handleManualSubmit}>
                <CheckCircle className="mr-2" />
                确认录入
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
