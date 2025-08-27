"use client";

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { suggestStockLocations } from '@/ai/flows/suggest-stock-locations';
import type { SuggestStockLocationsOutput } from '@/ai/flows/suggest-stock-locations';
import type { Component } from '@/lib/types';
import { Loader2, Wand2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface GetPartsDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  requiredComponents: (Component & { model: string })[];
}

// Mock data for available stock locations
const MOCK_AVAILABLE_LOCATIONS = `
- 储藏室 A (Storage Room A): 靠近 A1-A3 模块. 库存:
  - MEM-32G-3200-B: 20件
  - SSD-1T-I-P4510: 15件
- 储藏室 B (Storage Room B): 靠近 B1-B3 模块. 库存:
  - MEM-32G-3200-B: 5件
  - SSD-960G-S-PM883: 30件
- 中央仓库 (Central Depot): 距离所有模块较远. 库存:
  - MEM-32G-3200-B: 100件
  - SSD-1T-I-P4510: 50件
  - SSD-960G-S-PM883: 200件
  - MEM-16G-2400-A: 50件
`;


export function GetPartsDialog({
  isOpen,
  setIsOpen,
  requiredComponents,
}: GetPartsDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [suggestion, setSuggestion] = React.useState<SuggestStockLocationsOutput | null>(null);

  const handleGetSuggestion = async () => {
    setIsLoading(true);
    setSuggestion(null);
    try {
      const result = await suggestStockLocations({
        components: requiredComponents.map(c => ({ partNumber: c.partNumber, model: `${c.manufacturer} ${c.model}`, quantity: c.quantity })),
        stockLocationCriteria: '找到满足数量需求的最少储藏室组合，并优先选择离A1模块最近的位置。',
        availableLocations: MOCK_AVAILABLE_LOCATIONS,
      });
      setSuggestion(result);
    } catch (error) {
      console.error('Failed to get stock location suggestions:', error);
      toast({
        variant: 'destructive',
        title: '获取建议失败',
        description: '无法连接到 AI 服务，请稍后重试。',
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    // Reset state when dialog is closed
    if (!isOpen) {
      setIsLoading(false);
      setSuggestion(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>AI 备件领取建议</DialogTitle>
          <DialogDescription>
            根据工单需求和当前库存，AI 会建议最佳的备件领取位置。
          </DialogDescription>
        </DialogHeader>
        
        {!suggestion && !isLoading && (
            <div className='py-8 flex flex-col items-center justify-center text-center'>
                <Wand2 className="h-12 w-12 text-primary/50 mb-4" />
                <h3 className='font-semibold mb-2'>准备好获取建议了吗？</h3>
                <p className='text-sm text-muted-foreground mb-6'>点击下方按钮，AI将开始为您分析最佳领取方案。</p>
                <Button onClick={handleGetSuggestion}>
                    <Wand2 className="mr-2 h-4 w-4" />
                    获取建议
                </Button>
            </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">AI 正在思考中...</p>
          </div>
        )}

        {suggestion && (
          <div className="py-4 space-y-4">
            <div>
              <h4 className="font-semibold mb-2">领取清单</h4>
              <div className='border rounded-lg'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>组件型号</TableHead>
                            <TableHead>数量</TableHead>
                            <TableHead>领取位置</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {suggestion.suggestedLocations.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <p className='font-medium'>{item.model}</p>
                                    <p className='text-xs text-muted-foreground font-mono'>部件号: {item.partNumber}</p>
                                </TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell className='font-medium'>{item.location}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </div>
            </div>
            <div>
                <h4 className="font-semibold mb-2">AI 分析</h4>
                <p className='text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg border'>
                    {suggestion.reasoning}
                </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            关闭
          </Button>
          {suggestion && (
             <Button onClick={handleGetSuggestion}>
                <Wand2 className="mr-2 h-4 w-4" />
                重新生成
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
