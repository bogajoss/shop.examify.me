"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { supabase } from "@/lib/supabase";

const batchSchema = z.object({
  name: z.string().min(1, "Batch name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  old_price: z.number().min(0, "Old price must be positive").optional(),
  status: z.enum(["live", "ended"]),
  is_public: z.boolean(),
  icon_url: z.string().optional(),
  default_approval_message: z.string().optional(),
  linked_batch_ids: z.array(z.string()).optional(),
  live_exams: z.string().optional(),
  lecture_notes: z.string().optional(),
  standard_exams: z.string().optional(),
  solve_sheets: z.string().optional(),
});

type BatchFormValues = z.infer<typeof batchSchema>;

export default function CreateBatch() {
  const router = useRouter();
  const { showToast } = useToast();
  const [allBatches, setAllBatches] = useState<{ id: string; name: string }[]>(
    []
  );
  const [batchStats, setBatchStats] = useState<{ label: string; value: string }[]>([
    { label: "লাইভ এক্সাম", value: "০+" },
    { label: "লেকচার নোট", value: "০+" },
    { label: "স্ট্যান্ডার্ড এক্সাম", value: "০+" },
    { label: "সলভ শিট", value: "০+" },
  ]);

  useEffect(() => {
    supabase
      .from("batches")
      .select("id, name")
      .then(({ data }) => {
        if (data) setAllBatches(data);
      });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BatchFormValues>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      price: 0,
      old_price: 0,
      status: "live",
      is_public: false,
      icon_url: "",
      default_approval_message: "",
      linked_batch_ids: [],
      live_exams: "০+",
      lecture_notes: "০+",
      standard_exams: "০+",
      solve_sheets: "০+",
    },
  });

  const onSubmit = async (data: BatchFormValues) => {
    try {
      const { error } = await supabase.from("batches").insert([
        {
          name: data.name,
          category: data.category,
          description: data.description,
          price: data.price,
          old_price: data.old_price,
          status: data.status,
          is_public: data.is_public,
          icon_url: data.icon_url,
          default_approval_message: data.default_approval_message,
          linked_batch_ids: data.linked_batch_ids,
          live_exams: data.live_exams,
          lecture_notes: data.lecture_notes,
          standard_exams: data.standard_exams,
          solve_sheets: data.solve_sheets,
          batch_stats: batchStats,
        },
      ]);

      if (error) throw error;

      showToast("Batch created successfully!", "success");
      router.push("/admin/batches");
    } catch (error) {
      console.error("Error creating batch:", error);
      showToast("Failed to create batch", "error");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 hover:bg-muted rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold">Create New Batch</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4 bg-card p-6 rounded-xl border border-border shadow-sm">
          {/* Dynamic Stats Grid */}
          <div className="space-y-3 p-4 bg-muted/30 rounded-2xl border border-border">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary">কোর্স স্ট্যাটাস (Dynamic)</label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="h-6 text-[10px] px-2 font-bold"
                onClick={() => setBatchStats([...batchStats, { label: "", value: "" }])}
              >
                + নতুন যোগ করুন
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {batchStats.map((stat, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-background p-2 rounded-lg border">
                  <div className="flex-1 space-y-1">
                    <input 
                      placeholder="নাম" 
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = [...batchStats];
                        newStats[idx].label = e.target.value;
                        setBatchStats(newStats);
                      }}
                      className="w-full h-7 bg-transparent border-b border-border focus:border-primary outline-none text-[10px] px-1"
                    />
                    <input 
                      placeholder="মান" 
                      value={stat.value}
                      onChange={(e) => {
                        const newStats = [...batchStats];
                        newStats[idx].value = e.target.value;
                        setBatchStats(newStats);
                      }}
                      className="w-full h-7 bg-transparent focus:border-primary outline-none text-[10px] px-1 font-bold"
                    />
                  </div>
                  <button 
                    type="button" 
                    className="h-7 w-7 flex items-center justify-center text-destructive hover:bg-destructive/10 rounded"
                    onClick={() => setBatchStats(batchStats.filter((_, i) => i !== idx))}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden">
            <input {...register("live_exams")} />
            <input {...register("lecture_notes")} />
            <input {...register("standard_exams")} />
            <input {...register("solve_sheets")} />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Batch Name
            </label>
            <input
              id="name"
              {...register("name")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="e.g. Medical Admission 2026"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <input
              id="category"
              {...register("category")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="e.g. Medical, Engineering"
            />
            {errors.category && (
              <p className="text-xs text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <label htmlFor="icon_url" className="text-sm font-medium">
              Image URL (Batch Cover)
            </label>
            <input
              id="icon_url"
              {...register("icon_url")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              {...register("description")}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Batch details..."
            />
          </div>

          {/* Default Approval Message */}
          <div className="space-y-2">
            <label
              htmlFor="default_approval_message"
              className="text-sm font-medium text-primary"
            >
              Auto-Approve Message (অ্যাপ্রুভ হওয়ার পর এই কমেন্টটি অটোমেটিক যাবে)
            </label>
            <textarea
              id="default_approval_message"
              {...register("default_approval_message")}
              placeholder="e.g. আপনাদের কোর্সটি সফলভাবে এনরোল হয়েছে। ক্লাস লিংক: https://examify.me/..."
              className="flex min-h-[80px] w-full rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-sm focus:border-primary transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Price (৳)
              </label>
              <input
                id="price"
                type="number"
                {...register("price", { valueAsNumber: true })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              {errors.price && (
                <p className="text-xs text-destructive">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Old Price */}
            <div className="space-y-2">
              <label htmlFor="old_price" className="text-sm font-medium">
                Old Price (৳)
              </label>
              <input
                id="old_price"
                type="number"
                {...register("old_price", { valueAsNumber: true })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="linked_batches" className="text-sm font-medium">
              Linked Batches (Sync Exams)
            </label>
            <div
              id="linked_batches"
              className="grid grid-cols-1 sm:grid-cols-2 gap-2 border border-input p-4 rounded-md h-40 overflow-y-auto bg-background"
            >
              {allBatches.length > 0 ? (
                allBatches.map((b) => (
                  <label
                    key={b.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      value={b.id}
                      {...register("linked_batch_ids")}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{b.name}</span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-muted-foreground col-span-2 text-center py-4">
                  No other batches available
                </p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Select batches to show their exams in this batch automatically.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <select
                id="status"
                {...register("status")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="live">Live</option>
                <option value="ended">Ended</option>
              </select>
            </div>

            {/* Public */}
            <div className="flex items-center space-x-2 pt-8">
              <input
                type="checkbox"
                id="is_public"
                {...register("is_public")}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="is_public"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Make Public?
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Batch"}
          </Button>
        </div>
      </form>
    </div>
  );
}
