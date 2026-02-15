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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBlogAction } from "@/app/actions/blog-actions";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function CreateBlogPage() {
  const router = useRouter();
  const { showToast } = useToast();
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      showToast("টাইটেল এবং কন্টেন্ট অবশ্যই দিতে হবে", "error");
      return;
    }

    setIsSubmitting(true);
    const result = await createBlogAction(formData);
    if (result.success) {
      showToast("ব্লগ সফলভাবে তৈরি হয়েছে", "success");
      router.push("/admin/blogs");
    } else {
      showToast(result.message || "ব্লগ তৈরি করতে সমস্যা হয়েছে", "error");
    }
    setIsSubmitting(false);
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
            নতুন ব্লগ লিখুন
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
                <Type className="h-4 w-4" /> ব্লগের শিরোনাম
              </label>
              <input
                type="text"
                placeholder="ব্লগ টাইটেল..."
                className="w-full h-14 px-6 rounded-2xl bg-muted/30 border border-border focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-lg font-bold"
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  const slug = title
                    .toLowerCase()
                    .replace(/ /g, "-")
                    .replace(/[^\w-]+/g, "");
                  setFormData({ ...formData, title, slug });
                }}
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
              <p className="text-[10px] text-muted-foreground ml-1 italic">
                * এটি ব্লগের পার্মানেন্ট লিঙ্ক হিসেবে কাজ করবে।
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2 text-muted-foreground ml-1">
                <AlignLeft className="h-4 w-4" /> ব্লগের মূল কন্টেন্ট (HTML/Text)
              </label>
              <textarea
                placeholder="ব্লগের বিস্তারিত লিখুন এখানে..."
                className="w-full min-h-[400px] p-6 rounded-2xl bg-muted/30 border border-border focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none leading-relaxed"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
              <p className="text-[10px] text-muted-foreground ml-1 italic">
                * আপনি চাইলে HTML ট্যাগ ব্যবহার করে ডিজাইন করতে পারেন।
              </p>
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
              className="w-full h-14 rounded-2xl font-black text-lg gap-2 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]"
            >
              {isSubmitting ? (
                "তৈরি হচ্ছে..."
              ) : (
                <>
                  <Save className="h-5 w-5" /> ব্লগ সেভ করুন
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
