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
  componentType: z.string().min(1, "Component type is required."),
  stockLocationCriteria: z.string().min(1, "Criteria is required."),
  availableOptions: z.string().min(1, "Available options are required."),
});

export function ComponentSuggester() {
  const [suggestion, setSuggestion] = useState<SuggestStockLocationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      componentType: 'Memory',
      stockLocationCriteria: 'Closest to rack R12, must have at least 4 units available.',
      availableOptions: 'Box-A1 (Rack A01, 10 units), Box-B3 (Rack B05, 2 units), Box-C7 (Rack R11, 5 units), Box-D2 (Rack R25, 20 units)',
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
      setError("Failed to get suggestions. Please try again.");
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
                <FormLabel>Component Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a component type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SATA">SATA Drive</SelectItem>
                    <SelectItem value="SSD">SSD Drive</SelectItem>
                    <SelectItem value="Memory">Memory Module</SelectItem>
                    <SelectItem value="Network Card">Network Card</SelectItem>
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
                <FormLabel>Stock Location Criteria</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Closest to rack R12" {...field} />
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
                <FormLabel>Available Stock Locations</FormLabel>
                <FormControl>
                  <Textarea placeholder="List available boxes and their locations..." {...field} rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            <Bot className="mr-2 h-4 w-4" />
            {isLoading ? 'Thinking...' : 'Get AI Suggestion'}
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
                        <h4 className="font-semibold text-primary">Suggested Location</h4>
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
