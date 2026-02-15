"use client";

import {
  AlignLeft,
  ArrowLeft,
  FileText,
  Globe,
  Image as ImageIcon,
  Save,
  Type,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { updateBlogAction } from "@/app/actions/blog-actions";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { supabase } from "@/lib/supabase";

export default function EditBlogPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    image_url: "",
    category: "General",
    author: "Admin",
    status: "published" as "draft" | "published",
  });

  useEffect(() => {
    async function fetchBlog() {
      try {
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (data) {
          setFormData({
            title: data.title,
            slug: data.slug || "",
            content: data.content,
            excerpt: data.excerpt || "",
            image_url: data.image_url || "",
            category: data.category || "General",
            author: data.author || "Admin",
            status: data.status as any,
          });
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        showToast("ব্লগটি খুঁজে পাওয়া যায়নি", "error");
        router.push("/admin/blogs");
      } finally {
        setIsLoading(false);
      }
    }
    fetchBlog();
  }, [id, router, showToast]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      showToast("টাইটেল এবং কন্টেন্ট অবশ্যই দিতে হবে", "error");
      return;
    }

    setIsSubmitting(true);
    const result = await updateBlogAction(id as string, formData);
    if (result.success) {
      showToast("ব্লগ সফলভাবে আপডেট হয়েছে", "success");
      router.push("/admin/blogs");
    } else {
      showToast(result.message || "ব্লগ আপডেট করতে সমস্যা হয়েছে", "error");
    }
    setIsSubmitting(false);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 animate-pulse font-bold text-muted-foreground">
        লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blogs">
            <button className="p-2 hover:bg-muted rounded-full transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </button>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            ব্লগ এডিট করুন
          </h2>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-[2rem] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2 text-muted-foreground ml-1">
                <Type className="h-4 w-4" /> শিরোনাম
              </label>
              <input
                type="text"
                placeholder="ব্লগ টাইটেল..."
                className="w-full h-14 px-6 rounded-2xl bg-muted/30 border border-border focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-lg font-bold"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2 text-muted-foreground ml-1">
                <Globe className="h-4 w-4" /> কাস্টম URL (Slug)
              </label>
              <div className="flex items-center">
                <span className="bg-muted px-4 h-12 flex items-center rounded-l-xl border border-r-0 border-border text-xs font-mono text-muted-foreground">
                  examify.me/
                </span>
                <input
                  type="text"
                  placeholder="custom-link-here"
                  className="flex-1 h-12 px-4 rounded-r-xl bg-muted/30 border border-border focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-mono"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2 text-muted-foreground ml-1">
                <AlignLeft className="h-4 w-4" /> মূল কন্টেন্ট (HTML/Text)
              </label>
              <textarea
                placeholder="ব্লগের বিস্তারিত লিখুন এখানে..."
                className="w-full min-h-[450px] p-6 rounded-2xl bg-muted/30 border border-border focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none leading-relaxed"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-[2rem] p-6 shadow-sm space-y-6 sticky top-8">
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2 text-muted-foreground ml-1">
                <ImageIcon className="h-4 w-4" /> কভার ইমেজ URL
              </label>
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                className="w-full h-11 px-4 rounded-xl bg-muted/30 border border-border focus:border-primary transition-all text-sm"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2 text-muted-foreground ml-1">
                <FileText className="h-4 w-4" /> ছোট বিবরণ (Excerpt)
              </label>
              <textarea
                placeholder="সংক্ষেপে ব্লগের বিষয়বস্তু..."
                className="w-full h-24 p-4 rounded-xl bg-muted/30 border border-border focus:border-primary transition-all text-sm resize-none"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground ml-1">
                  লেখক
                </label>
                <input
                  type="text"
                  className="w-full h-11 px-4 rounded-xl bg-muted/30 border border-border focus:border-primary transition-all text-sm"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground ml-1">
                  স্ট্যাটাস
                </label>
                <select
                  className="w-full h-11 px-4 rounded-xl bg-muted/30 border border-border focus:border-primary transition-all text-sm appearance-none"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 rounded-2xl font-black text-lg gap-2 shadow-xl shadow-primary/20"
            >
              {isSubmitting ? (
                "আপডেট হচ্ছে..."
              ) : (
                <>
                  <Save className="h-5 w-5" /> আপডেট সেভ করুন
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
