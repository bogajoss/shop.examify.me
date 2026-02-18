"use client";

import {
  Calendar,
  Clock,
  Copy,
  Edit,
  Eye,
  Layers,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { supabase } from "@/lib/supabase";
import { calculateBatchPrice } from "@/lib/utils";

interface Batch {
  id: string;
  name: string;
  description: string;
  status: "live" | "ended";
  created_at: string;
  is_public: boolean;
  price: number;
  old_price: number;
  offer_expires_at?: string;
  category: string;
}

export default function AdminBatches() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const fetchBatches = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই ব্যাচটি ডিলিট করতে চান?")) return;

    try {
      const { error } = await supabase.from("batches").delete().eq("id", id);
      if (error) throw error;

      setBatches(batches.filter((b) => b.id !== id));
      showToast("ব্যাচটি ডিলিট করা হয়েছে", "success");
    } catch (error) {
      console.error("Error deleting batch:", error);
      showToast("ডিলিট করতে সমস্যা হয়েছে", "error");
    }
  };

  const handleCopyLink = (id: string, type: "checkout" | "courses") => {
    const link = `${window.location.origin}/${type}/${id}`;
    navigator.clipboard.writeText(link);
    showToast(
      type === "checkout"
        ? "এনরোল লিংক কপি করা হয়েছে"
        : "কোর্স লিংক কপি করা হয়েছে",
      "success",
    );
  };

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-6 items-start sm:items-center px-4 sm:px-0">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            ব্যাচ ম্যানেজমেন্ট
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            আপনার সকল একটিভ এবং আর্কাভড কোর্স ব্যাচগুলো পরিচালনা করুন
          </p>
        </div>
        <Link href="/admin/batches/create" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto gap-2 h-12 sm:h-10 rounded-xl sm:rounded-lg font-bold shadow-lg shadow-primary/20">
            <Plus className="h-5 w-5" /> নতুন ব্যাচ তৈরি করুন
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 rounded-3xl bg-card border border-border p-6 space-y-4"
            >
              <div className="flex justify-between">
                <div className="h-12 w-12 bg-muted animate-pulse rounded-2xl" />
                <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
              </div>
              <div className="h-6 w-3/4 bg-muted animate-pulse rounded-lg" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
                <div className="h-4 w-5/6 bg-muted animate-pulse rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : batches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
          {batches.map((batch) => {
            const { currentPrice, displayOldPrice, isExpired } =
              calculateBatchPrice(batch);

            return (
              <div
                key={batch.id}
                className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] transition-colors group-hover:bg-primary/10" />

                <div className="space-y-5 relative">
                  <div className="flex justify-between items-start">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                      <Layers className="h-7 w-7" />
                    </div>
                    <div className="flex gap-2 mr-8">
                      <Badge
                        variant={
                          batch.status === "live" ? "success" : "secondary"
                        }
                        className="uppercase tracking-widest text-[9px] px-2 py-0.5"
                      >
                        {batch.status === "live" ? "Live" : "Ended"}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-black text-xl text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {batch.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 items-center">
                      <Badge
                        variant="outline"
                        className="text-[10px] font-bold border-primary/20 text-primary bg-primary/5"
                      >
                        {batch.category || "General"}
                      </Badge>
                      <div className="flex items-center gap-1.5 ml-auto">
                        {displayOldPrice > 0 && (
                          <span className="text-[10px] text-destructive line-through font-bold opacity-60">
                            ৳{displayOldPrice}
                          </span>
                        )}
                        <span className="text-lg font-black text-primary">
                          ৳{currentPrice}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium line-clamp-2 leading-relaxed">
                      {batch.description ||
                        "এই ব্যাচটির জন্য কোনো বিবরণ দেওয়া হয়নি।"}
                    </p>
                    {!isExpired && batch.offer_expires_at && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-md w-fit mt-1">
                        <Clock className="h-3 w-3" />
                        Offer Ends:{" "}
                        {new Date(batch.offer_expires_at).toLocaleString()}
                      </div>
                    )}
                    {isExpired && batch.offer_expires_at && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md w-fit mt-1">
                        <Clock className="h-3 w-3" />
                        Offer Expired
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-border/50 flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary/60" />
                    {new Date(batch.created_at).toLocaleDateString("en-GB")}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck
                      className={`h-3.5 w-3.5 ${batch.is_public ? "text-green-500" : "text-amber-500"}`}
                    />
                    {batch.is_public ? "Public" : "Private"}
                  </div>
                </div>

                {/* Float Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyLink(batch.id, "courses")}
                    className="p-2 bg-background border border-border rounded-xl hover:text-sky-500 hover:border-sky-500 transition-all shadow-sm text-muted-foreground"
                    title="কোর্স লিংক কপি করুন"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyLink(batch.id, "checkout")}
                    className="p-2 bg-background border border-border rounded-xl hover:text-emerald-500 hover:border-emerald-500 transition-all shadow-sm text-muted-foreground"
                    title="এনরোল লিংক কপি করুন"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <Link href={`/admin/batches/edit/${batch.id}`}>
                    <button
                      type="button"
                      className="p-2 bg-background border border-border rounded-xl hover:text-primary hover:border-primary transition-all shadow-sm text-muted-foreground"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(batch.id)}
                    className="p-2 bg-background border border-border rounded-xl hover:text-destructive hover:border-destructive transition-all shadow-sm text-muted-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mx-4 sm:mx-0 text-center py-24 border-2 border-dashed border-border rounded-[2.5rem] bg-muted/10 space-y-4">
          <Layers className="h-16 w-16 text-muted-foreground opacity-20 mx-auto" />
          <div className="space-y-1">
            <p className="text-foreground font-bold text-xl">
              কোনো ব্যাচ পাওয়া যায়নি
            </p>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              নতুন একটি ব্যাচ তৈরি করতে উপরের "নতুন ব্যাচ তৈরি করুন" বাটনে ক্লিক করুন।
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
