"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import Button from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
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
  routine_url: z.string().optional(),
  default_approval_message: z.string().optional(),
  offer_expires_at: z.string().nullable().optional(),
  linked_batch_ids: z.array(z.string()).optional(),
});

type BatchFormValues = z.infer<typeof batchSchema>;

export default function EditBatch() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [offerDuration, setOfferDuration] = useState<string>("none");
  const [allBatches, setAllBatches] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [batchStats, setBatchStats] = useState<
    { label: string; value: string }[]
  >([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
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
      routine_url: "",
      default_approval_message: "",
      offer_expires_at: null,
      linked_batch_ids: [],
    },
  });

  useEffect(() => {
    supabase
      .from("batches")
      .select("id, name")
      .neq("id", id)
      .then(({ data }) => {
        if (data) setAllBatches(data);
      });
  }, [id]);

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
        setValue("icon_url", data.icon_url || "");
        setValue("routine_url", data.routine_url || "");
        setValue(
          "default_approval_message",
          data.default_approval_message || "",
        );
        setValue("offer_expires_at", data.offer_expires_at);
        setValue("linked_batch_ids", data.linked_batch_ids || []);
        setBatchStats(data.batch_stats || []);

        if (data.offer_expires_at) {
          setOfferDuration("custom");
        }
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
          ...data,
          batch_stats: batchStats,
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
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="rounded-full h-10 w-10 p-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Batch</h1>
          <p className="text-muted-foreground">
            Modify the details and features of your course batch.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Main details that appear on the course cards and hero section.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Batch Name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="e.g. Crack GST A Unit"
                />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  {...register("category")}
                  placeholder="e.g. GST A Unit"
                />
                {errors.category && (
                  <p className="text-xs text-destructive">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="icon_url">Image URL (Batch Cover)</Label>
                <Input
                  id="icon_url"
                  {...register("icon_url")}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="routine_url">
                  Routine URL (Google Drive/PDF)
                </Label>
                <Input
                  id="routine_url"
                  {...register("routine_url")}
                  placeholder="https://drive.google.com/..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Course Features</CardTitle>
                <CardDescription>
                  Add features that will appear on the course cards and sidebar.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="font-bold"
                onClick={() =>
                  setBatchStats([...batchStats, { label: "", value: "" }])
                }
              >
                <Plus className="h-4 w-4 mr-2" /> Add Feature
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {batchStats.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {batchStats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="relative bg-muted/30 p-4 rounded-xl border border-border group"
                  >
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-7 w-7 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() =>
                        setBatchStats(batchStats.filter((_, i) => i !== idx))
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1 space-y-2">
                        <Label className="text-[10px] uppercase font-black opacity-60">
                          Title
                        </Label>
                        <Input
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...batchStats];
                            newStats[idx].label = e.target.value;
                            setBatchStats(newStats);
                          }}
                          placeholder="e.g. Daily Quiz"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label className="text-[10px] uppercase font-black opacity-60">
                          Details
                        </Label>
                        <Input
                          value={stat.value}
                          onChange={(e) => {
                            const newStats = [...batchStats];
                            newStats[idx].value = e.target.value;
                            setBatchStats(newStats);
                          }}
                          placeholder="Short description of the feature"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border-2 border-dashed rounded-xl text-muted-foreground">
                No features added yet. Click "Add Feature" to get started.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing & Status</CardTitle>
            <CardDescription>
              Control visibility and pricing for this batch.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Price (৳)</Label>
                <Input
                  id="price"
                  type="number"
                  {...register("price", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="old_price">Old Price (৳)</Label>
                <Input
                  id="old_price"
                  type="number"
                  {...register("old_price", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="offer_duration">Discount Duration</Label>
                <select
                  id="offer_duration"
                  value={offerDuration}
                  onChange={(e) => {
                    const duration = e.target.value;
                    setOfferDuration(duration);
                    if (duration === "none") {
                      setValue("offer_expires_at", null);
                    } else if (duration !== "custom") {
                      const now = new Date();
                      if (duration === "24h") now.setHours(now.getHours() + 24);
                      else if (duration === "3d")
                        now.setDate(now.getDate() + 3);
                      else if (duration === "7d")
                        now.setDate(now.getDate() + 7);
                      else if (duration === "15d")
                        now.setDate(now.getDate() + 15);
                      else if (duration === "30d")
                        now.setDate(now.getDate() + 30);
                      setValue("offer_expires_at", now.toISOString());
                    }
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="none">No Expiry (Permanent)</option>
                  <option value="custom">
                    {offerDuration === "custom"
                      ? "Custom/Current Expiry"
                      : "Set Custom Date"}
                  </option>
                  <option value="24h">Reset to 24 Hours</option>
                  <option value="3d">Reset to 3 Days</option>
                  <option value="7d">Reset to 7 Days</option>
                  <option value="15d">Reset to 15 Days</option>
                  <option value="30d">Reset to 30 Days</option>
                </select>

                {offerDuration === "custom" && (
                  <Input
                    type="datetime-local"
                    defaultValue={
                      watch("offer_expires_at")
                        ? new Date(
                            new Date(watch("offer_expires_at")!).getTime() -
                              new Date().getTimezoneOffset() * 60000,
                          )
                            .toISOString()
                            .slice(0, 16)
                        : ""
                    }
                    onChange={(e) => {
                      if (e.target.value) {
                        setValue(
                          "offer_expires_at",
                          new Date(e.target.value).toISOString(),
                        );
                      }
                    }}
                    className="mt-2"
                  />
                )}

                {watch("offer_expires_at") && (
                  <p className="text-[10px] text-primary font-bold">
                    Expires:{" "}
                    {new Date(watch("offer_expires_at") || "").toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  {...register("status")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="live">Live</option>
                  <option value="ended">Ended</option>
                </select>
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Controller
                  name="is_public"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="is_public"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="is_public" className="text-sm font-medium">
                  Make Public?
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Automation</CardTitle>
            <CardDescription>
              Configure automatic messages for students.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="default_approval_message">
                Auto-Approve Message (Bengali)
              </Label>
              <Textarea
                id="default_approval_message"
                {...register("default_approval_message")}
                placeholder="e.g. আপনাদের কোর্সটি সফলভাবে এনরোল হয়েছে..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[150px]"
          >
            {isSubmitting ? "Updating..." : "Update Batch"}
          </Button>
        </div>
      </form>
    </div>
  );
}
