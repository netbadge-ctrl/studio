"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { suggestStockLocations, type SuggestStockLocationsOutput } from '@/ai/flows/suggest-stock-locations';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Lightbulb } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

const formSchema = z.object({
  componentType: z.string().min(1, "组件类型是必填项。"),
  stockLocationCriteria: z.string().min(1, "标准是必填项。"),
  availableOptions: z.string().min(1, "可用选项是必填项。"),
});

export function ComponentSuggester() {
  const [suggestion, setSuggestion] = useState<SuggestStockLocationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      componentType: '内存',
      stockLocationCriteria: '离机架 R12 最近，必须至少有 4 个可用单元。',
      availableOptions: 'Box-A1 (机架 A01, 10 个单元), Box-B3 (机架 B05, 2 个单元), Box-C7 (机架 R11, 5 个单元), Box-D2 (机架 R25, 20 个单元)',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setSuggestion(null);
    try {
      const result = await suggestStockLocations(values);
      setSuggestion(result);
    } catch (e) {
      setError("获取建议失败。请重试。");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="componentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>组件类型</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择一个组件类型" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SATA">SATA 硬盘</SelectItem>
                    <SelectItem value="SSD">SSD 硬盘</SelectItem>
                    <SelectItem value="内存">内存模块</SelectItem>
                    <SelectItem value="网卡">网卡</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stockLocationCriteria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>库存位置标准</FormLabel>
                <FormControl>
                  <Input placeholder="例如：离机架 R12 最近" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="availableOptions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>可用库存位置</FormLabel>
                <FormControl>
                  <Textarea placeholder="列出可用的盒子及其位置..." {...field} rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            <Bot className="mr-2 h-4 w-4" />
            {isLoading ? '思考中...' : '获取 AI 建议'}
          </Button>
        </form>
      </Form>

      {isLoading && (
         <Card className="bg-muted/50">
            <CardContent className="p-4 space-y-2">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </CardContent>
         </Card>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
      
      {suggestion && (
        <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-primary">建议位置</h4>
                        <p className="text-lg font-bold font-mono text-primary-dark">{suggestion.suggestedLocations}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{suggestion.reasoning}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
