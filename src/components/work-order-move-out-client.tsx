
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { WorkOrder } from "@/lib/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Send } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const moveOutFormSchema = z.object({
  destination: z.string(),
  moveOutDate: z.date({
    required_error: "请选择一个出库日期",
  }),
  shippingProvider: z.string().min(1, "请输入物流公司名称"),
  trackingNumber: z.string().min(1, "请输入物流单号"),
});

export function WorkOrderMoveOutClient({ workOrder }: { workOrder: WorkOrder }) {
  const { toast } = useToast();
  const router = useRouter();

  // For demo purposes, we'll assume the destination is the same for all devices
  // and hardcode it. A real app might have a destination field on the work order itself.
  const destination = "北京酒仙桥数据中心";

  const form = useForm<z.infer<typeof moveOutFormSchema>>({
    resolver: zodResolver(moveOutFormSchema),
    defaultValues: {
      destination: destination,
      shippingProvider: "",
      trackingNumber: "",
    },
  });

  function onSubmit(values: z.infer<typeof moveOutFormSchema>) {
    console.log("Move Out Details:", values);
    toast({
      title: "出库操作已完成",
      description: `工单 #${workOrder.id} 的设备已成功记录出库信息。`,
    });
    
    const navigateEvent = new CustomEvent('navigateTo', { detail: { target: `/work-orders/${workOrder.id}/operate` } });
    window.dispatchEvent(navigateEvent);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>搬出操作: {workOrder.title}</CardTitle>
            <CardDescription>
              请确认出库信息并填写物流详情。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>迁入机房</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="moveOutDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>选择出库时间</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>选择一个日期</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0,0,0,0)) 
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="shippingProvider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>物流公司</FormLabel>
                  <FormControl>
                    <Input placeholder="例如: 顺丰速运" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="trackingNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>物流单号</FormLabel>
                  <FormControl>
                    <Input placeholder="在此输入单号" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 z-40">
            <div className="max-w-7xl mx-auto">
                <Button type="submit" size="lg" className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    完成出库
                </Button>
            </div>
        </div>
      </form>
    </Form>
  );
}
