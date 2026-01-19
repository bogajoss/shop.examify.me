"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function approveOrderAction(orderId: string) {
  try {
    // 1. Get the order details
    const { data: order, error: orderFetchError } = await supabaseAdmin
      .from("orders")
      .select("student_id, batch_id")
      .eq("id", orderId)
      .single();

    if (orderFetchError || !order) {
      return { success: false, message: "Order not found" };
    }

    // 2. Update order status
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({ status: "approved" })
      .eq("id", orderId);

    if (updateError) {
      return { success: false, message: "Failed to update order status" };
    }

    // 3. Get user's current batches
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("enrolled_batches")
      .eq("uid", order.student_id)
      .single();

    if (userError) {
      return { success: false, message: "Order approved but failed to fetch user for enrollment" };
    }

    const currentBatches = user.enrolled_batches || [];
    
    // 4. Update user's enrolled_batches if not already enrolled
    if (!currentBatches.includes(order.batch_id)) {
      const { error: enrollError } = await supabaseAdmin
        .from("users")
        .update({
          enrolled_batches: [...currentBatches, order.batch_id],
        })
        .eq("uid", order.student_id);

      if (enrollError) {
        return { success: false, message: "Order approved but failed to enroll user: " + enrollError.message };
      }
    }

    revalidatePath("/admin/orders");
    return { success: true, message: "Order approved and user enrolled successfully" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function rejectOrderAction(orderId: string) {
  try {
    const { error } = await supabaseAdmin
      .from("orders")
      .update({ status: "rejected" })
      .eq("id", orderId);

    if (error) {
      return { success: false, message: "Failed to reject order: " + error.message };
    }

    revalidatePath("/admin/orders");
    return { success: true, message: "Order rejected successfully" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
