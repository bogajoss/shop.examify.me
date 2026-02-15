"use client";

import {
  Calendar,
  Edit,
  Eye,
  FileText,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteBlogAction } from "@/app/actions/blog-actions";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { supabase } from "@/lib/supabase";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      showToast("ব্লগগুলো লোড করতে সমস্যা হয়েছে", "error");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই ব্লগটি ডিলিট করতে চান?")) return;

    const result = await deleteBlogAction(id);
    if (result.success) {
      showToast("ব্লগটি ডিলিট করা হয়েছে", "success");
      setBlogs(blogs.filter((b) => b.id !== id));
    } else {
      showToast("ডিলিট করতে সমস্যা হয়েছে", "error");
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-6 items-start sm:items-center">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            ব্লগ ম্যানেজমেন্ট
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            আপনার ওয়েবসাইটের সব ব্লগ পোস্ট এখানে পরিচালনা করুন।
          </p>
        </div>
        <Link href="/admin/blogs/create">
          <Button className="gap-2 h-11 rounded-xl font-bold shadow-lg shadow-primary/20">
            <Plus className="h-5 w-5" /> নতুন ব্লগ তৈরি করুন
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 rounded-3xl bg-card border border-border animate-pulse"
            />
          ))}
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col"
            >
              {/* Image Preview */}
              <div className="h-48 bg-muted relative overflow-hidden">
                {blog.image_url ? (
                  <img
                    src={blog.image_url}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground/30">
                    <FileText className="h-16 w-16" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <Badge
                    variant={
                      blog.status === "published" ? "success" : "secondary"
                    }
                  >
                    {blog.status === "published" ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col">
                <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(blog.created_at).toLocaleDateString("en-GB")}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {blog.author}
                  </span>
                </div>

                <h3 className="font-black text-xl text-foreground line-clamp-2 leading-tight">
                  {blog.title}
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {blog.excerpt || "বিবরণ দেওয়া হয়নি"}
                </p>

                <div className="pt-4 mt-auto border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link href={`/blogs/${blog.id}`} target="_blank">
                      <button
                        className="p-2 hover:text-primary transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </Link>
                    <Link href={`/admin/blogs/edit/${blog.id}`}>
                      <button
                        className="p-2 hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </Link>
                  </div>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="p-2 hover:text-destructive transition-colors text-muted-foreground"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/10 rounded-[2.5rem] border-2 border-dashed border-border">
          <FileText className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-xl font-bold">কোনো ব্লগ পাওয়া যায়নি</p>
          <p className="text-muted-foreground text-sm">
            নতুন একটি ব্লগ তৈরি করে শুরু করুন।
          </p>
        </div>
      )}
    </div>
  );
}
