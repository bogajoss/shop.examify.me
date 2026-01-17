"use client";

import { BookOpen, Calendar, Edit, Plus, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { supabase } from "@/lib/supabase";

interface Batch {
  id: string;
  name: string;
  description: string;
  status: "live" | "ended";
  created_at: string;
  is_public: boolean;
  price: number;
  old_price: number;
  category: string;
}

export default function AdminBatches() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const { data, error } = await supabase
        .from("batches")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBatches(data || []);
    } catch (error) {
      console.error("Error fetching batches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this batch?")) return;

    try {
      const { error } = await supabase.from("batches").delete().eq("id", id);
      if (error) throw error;
      
      setBatches(batches.filter(b => b.id !== id));
      showToast("Batch deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting batch:", error);
      showToast("Failed to delete batch", "error");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">ব্যাচ সমূহ</h2>
          <p className="text-sm text-muted-foreground">
            সকল কোর্স ও এক্সাম ব্যাচের তালিকা
          </p>
        </div>
        <Link href="/admin/batches/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> নতুন ব্যাচ
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-xl bg-muted/20 animate-pulse" />
          ))}
        </div>
      ) : batches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={batch.status === "live" ? "success" : "default"}>
                      {batch.status === "live" ? "চলমান" : "শেষ"}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {batch.name}
                  </h3>
                  <div className="flex gap-2 items-center mt-1">
                    <Badge variant="secondary" className="text-[10px]">
                      {batch.category || "No Category"}
                    </Badge>
                    <span className="text-xs font-bold text-primary">
                      ৳{batch.price} 
                      {batch.old_price > 0 && (
                        <span className="ml-1 text-[10px] text-muted-foreground line-through">
                          ৳{batch.old_price}
                        </span>
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {batch.description || "কোন বিবরণ নেই"}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(batch.created_at).toLocaleDateString("bn-BD")}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  পাবলিক: {batch.is_public ? "হ্যাঁ" : "না"}
                </div>
              </div>

              {/* Actions Overlay */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href={`/admin/batches/edit/${batch.id}`}>
                  <button className="p-1.5 bg-background border border-border rounded-md hover:text-primary transition-colors shadow-sm">
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                </Link>
                <button 
                  onClick={() => handleDelete(batch.id)}
                  className="p-1.5 bg-background border border-border rounded-md hover:text-destructive transition-colors shadow-sm"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl bg-muted/10">
          <p className="text-muted-foreground">কোনো ব্যাচ পাওয়া যায়নি।</p>
        </div>
      )}
    </div>
  );
}
