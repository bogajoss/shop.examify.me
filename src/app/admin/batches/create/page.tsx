"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

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
});

type BatchFormValues = z.infer<typeof batchSchema>;

export default function CreateBatch() {
  const router = useRouter();
  const { showToast } = useToast();
  const [allBatches, setAllBatches] = useState<{ id: string; name: string }[]>(
    []
  );
    const [batchStats, setBatchStats] = useState<{ label: string; value: string }[]>([
      { label: "To Do List Submission", value: "প্রতিদিন সকালে নির্দিষ্ট সময়ে To do List গ্রহন" },
      { label: "Task Submission", value: "প্রতিদিন ২ বার HW গ্রহন" },
      { label: "Website Exam", value: "GST গুচ্ছ স্ট্যান্ডার্ড ওয়েবসাইট এক্সাম" },
      { label: "Quiz", value: "অতিরিক্ত প্রাকটিসের জন্য Telegram Quiz" },
      { label: "Progress Report", value: "প্রতিদিনের To Do List, HW, Exam এর উপর Progress Report" },
      { label: "Doubt Solve Group", value: "পড়ার সময় তৈরি হওয়া সমস্যা গুলোর সমাধান" },
      { label: "Smart Circle", value: "Reading Zone এ স্মার্ট সার্কেল সুবিধা" },
    ]);
  
    const {
      register,
      handleSubmit,
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
        default_approval_message: "",
        linked_batch_ids: [],
      },
    });
  
    useEffect(() => {
      supabase
        .from("batches")
        .select("id, name")
        .then(({ data }) => {
          if (data) setAllBatches(data);
        });
    }, []);
  
    const onSubmit = async (data: BatchFormValues) => {
      try {
        const { error } = await supabase.from("batches").insert([
          {
            ...data,
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
      <div className="container mx-auto py-10 max-w-4xl space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="rounded-full h-10 w-10 p-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Batch</h1>
            <p className="text-muted-foreground">Fill in the details to launch a new course batch.</p>
          </div>
        </div>
  
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Main details that appear on the course cards and hero section.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Batch Name</Label>
                  <Input id="name" {...register("name")} placeholder="e.g. HSC 2026 Biology Cycle" />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" {...register("category")} placeholder="e.g. HSC Academic" />
                  {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
                </div>
              </div>
  
              <div className="space-y-2">
                <Label htmlFor="icon_url">Image URL (Batch Cover)</Label>
                <Input id="icon_url" {...register("icon_url")} placeholder="https://example.com/image.jpg" />
              </div>
  
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register("description")} placeholder="Describe what students will learn..." className="min-h-[100px]" />
              </div>
            </CardContent>
          </Card>
  
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Course Features</CardTitle>
                  <CardDescription>Add features that will appear on the course cards and sidebar.</CardDescription>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="font-bold"
                  onClick={() => setBatchStats([...batchStats, { label: "", value: "" }])}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Feature
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {batchStats.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {batchStats.map((stat, idx) => (
                    <div key={idx} className="relative bg-muted/30 p-4 rounded-xl border border-border group">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-7 w-7 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setBatchStats(batchStats.filter((_, i) => i !== idx))}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1 space-y-2">
                          <Label className="text-[10px] uppercase font-black opacity-60">Title</Label>
                          <Input 
                            value={stat.label}
                            onChange={(e) => {
                              const newStats = [...batchStats];
                              newStats[idx].label = e.target.value;
                              setBatchStats(newStats);
                            }}
                            placeholder="e.g. Live Classes"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label className="text-[10px] uppercase font-black opacity-60">Details</Label>
                          <Input 
                            value={stat.value}
                            onChange={(e) => {
                              const newStats = [...batchStats];
                              newStats[idx].value = e.target.value;
                              setBatchStats(newStats);
                            }}
                            placeholder="What makes this feature special?"
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
              <CardDescription>Control visibility and pricing for this batch.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (৳)</Label>
                  <Input id="price" type="number" {...register("price", { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="old_price">Old Price (৳)</Label>
                  <Input id="old_price" type="number" {...register("old_price", { valueAsNumber: true })} />
                </div>
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
                  <Label htmlFor="is_public" className="text-sm font-medium">Make Public?</Label>
                </div>
              </div>
            </CardContent>
          </Card>
  
          <Card>
            <CardHeader>
              <CardTitle>Automation</CardTitle>
              <CardDescription>Configure automatic messages for students.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="default_approval_message">Auto-Approve Message (Bengali)</Label>
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
          <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
            {isSubmitting ? "Creating..." : "Create Batch"}
          </Button>
        </div>
      </form>
    </div>
  );
}