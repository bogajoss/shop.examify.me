"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function approveOrderAction(orderId: string) {
  try {
    console.log("Approving order:", orderId);

    // 1. Get the order details
    const { data: order, error: orderFetchError } = await supabaseAdmin
      .from("orders")
      .select("student_id, batch_id")
      .eq("id", orderId)
      .single();

    if (orderFetchError || !order) {
      console.error("Error fetching order:", orderFetchError);
      return { success: false, message: "Order not found or fetch error" };
    }

    console.log("Order found:", order);

    // 2. Update order status
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({ status: "approved" })
      .eq("id", orderId);

    if (updateError) {
      console.error("Error updating order status:", updateError);
      return { success: false, message: "Failed to update order status: " + updateError.message };
    }

    console.log("Order status approved.");

    // 3. Get user's current batches
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("enrolled_batches")
      .eq("uid", order.student_id)
      .single();

    if (userError) {
      console.error("Error fetching user:", userError);
      // Attempt to rollback? No, manually handle.
      return { success: false, message: "Order approved but failed to fetch user: " + userError.message };
    }

    const currentBatches = user.enrolled_batches || [];
    console.log("Current batches:", currentBatches);
    
    // 4. Update user's enrolled_batches if not already enrolled
    if (!currentBatches.includes(order.batch_id)) {
      const newBatches = [...currentBatches, order.batch_id];
      console.log("Updating batches to:", newBatches);

      const { error: enrollError } = await supabaseAdmin
        .from("users")
        .update({
          enrolled_batches: newBatches,
        })
        .eq("uid", order.student_id);

      if (enrollError) {
        console.error("Enrollment error:", enrollError);
        return { success: false, message: "Order approved but failed to enroll user: " + enrollError.message };
      }
      console.log("User enrolled successfully.");
    } else {
      console.log("User already enrolled in this batch.");
    }

    revalidatePath("/admin/orders");
    return { success: true, message: "Order approved and user enrolled successfully" };
  } catch (error: any) {
    console.error("Server action exception:", error);
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