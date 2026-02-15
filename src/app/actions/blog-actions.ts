"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function createBlogAction(formData: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  category?: string;
  author?: string;
  status: "draft" | "published";
}) {
  try {
    const { data, error } = await supabaseAdmin
      .from("blogs")
      .insert([formData])
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/blogs");
    revalidatePath("/blogs");
    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateBlogAction(
  id: string,
  formData: {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    image_url?: string;
    category?: string;
    author?: string;
    status?: "draft" | "published";
  },
) {
  try {
    const { data, error } = await supabaseAdmin
      .from("blogs")
      .update(formData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/blogs");
    revalidatePath(`/blogs/${id}`);
    revalidatePath("/blogs");
    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteBlogAction(id: string) {
  try {
    const { error } = await supabaseAdmin.from("blogs").delete().eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/blogs");
    revalidatePath("/blogs");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
