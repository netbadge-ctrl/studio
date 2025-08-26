import { MainNav } from '@/components/main-nav';
import { workOrders } from '@/lib/mock-data';
import { WorkOrderDetailClient } from '@/components/work-order-detail-client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WorkOrderDetailPage({ params }: { params: { id: string } }) {
  const workOrder = workOrders.find(wo => wo.id === params.id);

  if (!workOrder) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <MainNav />
      <main className="flex-1 bg-muted/40 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
            <div className="mb-4">
                <Button asChild variant="outline" size="sm">
                    <Link href="/" className='flex items-center gap-1'>
                        <ChevronLeft className="h-4 w-4" />
                        Back to All Orders
                    </Link>
                </Button>
            </div>
            <WorkOrderDetailClient workOrder={workOrder} />
        </div>
      </main>
    </div>
  );
}
