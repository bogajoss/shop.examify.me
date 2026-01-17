"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
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
  price: z.coerce.number().min(0, "Price must be positive"),
  old_price: z.coerce.number().min(0, "Old price must be positive").optional(),
  status: z.enum(["live", "ended"]),
  is_public: z.boolean(),
});

type BatchFormValues = z.infer<typeof batchSchema>;

export default function EditBatch() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BatchFormValues>({
    resolver: zodResolver(batchSchema) as any,
    defaultValues: {
      name: "",
      category: "",
      description: "",
      price: 0,
      old_price: 0,
      status: "live",
      is_public: false,
    },
  });

  useEffect(() => {
    async function fetchBatch() {
      try {
        const { data, error } = await supabase
          .from("batches")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        setValue("name", data.name);
        setValue("category", data.category || "");
        setValue("description", data.description || "");
        setValue("price", data.price || 0);
        setValue("old_price", data.old_price || 0);
        setValue("status", data.status);
        setValue("is_public", data.is_public);
      } catch (err) {
        console.error("Error fetching batch:", err);
        showToast("Failed to fetch batch details", "error");
        router.push("/admin/batches");
      } finally {
        setIsLoading(false);
      }
    }
    fetchBatch();
  }, [id, setValue, showToast, router]);

  const onSubmit = async (data: BatchFormValues) => {
    try {
      const { error } = await supabase
        .from("batches")
        .update({
          name: data.name,
          category: data.category,
          description: data.description,
          price: data.price,
          old_price: data.old_price,
          status: data.status,
          is_public: data.is_public,
        })
        .eq("id", id);

      if (error) throw error;

      showToast("Batch updated successfully!", "success");
      router.push("/admin/batches");
    } catch (error) {
      console.error("Error updating batch:", error);
      showToast("Failed to update batch", "error");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[50vh]">Loading...</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-muted rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold">Edit Batch</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4 bg-card p-6 rounded-xl border border-border shadow-sm">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Batch Name</label>
            <input
              {...register("name")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <input
              {...register("category")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {errors.category && (
              <p className="text-xs text-destructive">{errors.category.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              {...register("description")}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Price (৳)</label>
              <input
                type="number"
                {...register("price")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              {errors.price && (
                <p className="text-xs text-destructive">{errors.price.message}</p>
              )}
            </div>

            {/* Old Price */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Old Price (৳)</label>
              <input
                type="number"
                {...register("old_price")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
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
              <label htmlFor="is_public" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Make Public?
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Update Batch" : "Update Batch"}
          </Button>
        </div>
      </form>
    </div>
  );
}
