"use client";

import { BookOpen, Users, Clock, AlertCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { supabase } from "@/lib/supabase";

interface Batch {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface BatchStats {
  [batchId: string]: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  };
}

export default function BatchesList() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [stats, setStats] = useState<BatchStats>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch batches
      const { data: batchesData, error: batchesError } = await supabase
        .from("batches")
        .select("id, name, price, category")
        .order("created_at", { ascending: false });

      if (batchesError) throw batchesError;
      setBatches(batchesData || []);

      // Fetch order stats
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("batch_id, status");

      if (ordersError) throw ordersError;

      const newStats: BatchStats = {};
      ordersData?.forEach((order) => {
        if (!order.batch_id) return;
        if (!newStats[order.batch_id]) {
          newStats[order.batch_id] = { pending: 0, approved: 0, rejected: 0, total: 0 };
        }
        const s = newStats[order.batch_id];
        s.total++;
        if (order.status === "pending") s.pending++;
        else if (order.status === "approved") s.approved++;
        else if (order.status === "rejected") s.rejected++;
      });

      setStats(newStats);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1400px] mx-auto p-4 md:p-0">
      <div>
        <h2 className="text-2xl font-bold text-foreground">ব্যাচ সিলেকশন</h2>
        <p className="text-sm text-muted-foreground">
          অর্ডার ভেরিফাই করার জন্য একটি ব্যাচ সিলেক্ট করুন
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-muted/20 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch) => {
            const batchStats = stats[batch.id] || { pending: 0, approved: 0, rejected: 0, total: 0 };
            return (
              <Link
                key={batch.id}
                href={`/admin/orders/${batch.id}`}
                className="group relative bg-card hover:bg-muted/50 border border-border rounded-xl p-6 transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    {batchStats.pending > 0 && (
                      <Badge variant="warning" className="gap-1 animate-pulse">
                        <AlertCircle className="h-3 w-3" />
                        {batchStats.pending} Pending
                      </Badge>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {batch.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 capitalize">
                      {batch.category} • ৳{batch.price}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5" title="Total Orders">
                    <Users className="h-3.5 w-3.5" />
                    <span>{batchStats.total} Orders</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="text-green-600 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        {batchStats.approved}
                     </span>
                     <span className="text-red-500 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        {batchStats.rejected}
                     </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}