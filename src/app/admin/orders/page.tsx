"use client";

import {
  AlertCircle,
  BookOpen,
  Calendar,
  Check,
  CreditCard,
  Hash,
  Search,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAdmin } from "@/context/AdminContext";
import { supabase } from "@/lib/supabase";

interface Order {
  id: string;
  created_at: string;
  amount: number;
  payment_method: string;
  payment_number: string;
  trx_id: string;
  status: "pending" | "approved" | "rejected";
  assigned_token?: string;
  student: {
    name: string;
    roll: string;
  };
  batch: {
    name: string;
  };
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { showToast } = useToast();
  const { admin } = useAdmin();

  const fetchOrders = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          student:users(name, roll),
          batch:batches(name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (
    orderId: string,
    newStatus: "approved" | "rejected",
  ) => {
    if (!admin) {
      showToast("অ্যাডমিন লগইন প্রয়োজন", "error");
      return;
    }

    try {
      if (newStatus === "rejected") {
        await supabase
          .from("orders")
          .update({ status: newStatus })
          .eq("id", orderId);

        showToast("অর্ডার রিজেক্ট করা হয়েছে", "success");
        fetchOrders();
        return;
      }

      if (newStatus === "approved") {
        const { data: fullOrder } = await supabase
          .from("orders")
          .select("student_id, batch_id")
          .eq("id", orderId)
          .single();

        if (!fullOrder) throw new Error("অর্ডার খুঁজে পাওয়া যায়নি");

        const { error: orderError } = await supabase
          .from("orders")
          .update({ status: "approved" })
          .eq("id", orderId);

        if (orderError) throw orderError;

        const { data: uData } = await supabase
          .from("users")
          .select("enrolled_batches")
          .eq("uid", fullOrder.student_id)
          .single();

        const currentBatches = uData?.enrolled_batches || [];
        if (!currentBatches.includes(fullOrder.batch_id)) {
          await supabase
            .from("users")
            .update({
              enrolled_batches: [...currentBatches, fullOrder.batch_id],
            })
            .eq("uid", fullOrder.student_id);
        }

        showToast("অর্ডার অ্যাপ্রুভ এবং এনরোল করা হয়েছে!", "success");
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      showToast("স্ট্যাটাস আপডেট ব্যর্থ হয়েছে", "error");
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.trx_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.payment_number?.includes(searchTerm),
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center px-4 md:px-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground">অর্ডার ম্যানেজমেন্ট</h2>
          <p className="text-sm text-muted-foreground">
            সকল পেমেন্ট রিকোয়েস্ট ভেরিফাই করুন
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="TrxID, নাম বা ফোন খুঁজুন..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Desktop View Table */}
      <div className="hidden lg:block bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/30 text-muted-foreground font-semibold border-b border-border uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-4">শিক্ষার্থী</th>
                <th className="px-6 py-4">কোর্স/ব্যাচ</th>
                <th className="px-6 py-4">পেমেন্ট ডিটেইলস</th>
                <th className="px-6 py-4">TrxID</th>
                <th className="px-6 py-4">স্ট্যাটাস</th>
                <th className="px-6 py-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      অর্ডার লোড হচ্ছে...
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-muted/10 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                          {order.student?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">
                            {order.student?.name || "Unknown"}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                            <Hash className="h-2.5 w-2.5" />{" "}
                            {order.student?.roll}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-foreground font-medium">
                        <BookOpen className="h-3.5 w-3.5 text-primary/60" />
                        {order.batch?.name || "Unknown Batch"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground text-base">
                          ৳{order.amount}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <CreditCard className="h-3 w-3 text-[#25D366]" />
                          {order.payment_method} • {order.payment_number}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded border border-border/50 text-foreground/80">
                        {order.trx_id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          order.status === "approved"
                            ? "success"
                            : order.status === "rejected"
                              ? "destructive"
                              : "warning"
                        }
                        className="uppercase text-[9px] px-2 py-0.5 tracking-tighter"
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {order.status === "pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white gap-1 px-4 h-8 text-xs"
                            onClick={() =>
                              handleStatusChange(order.id, "approved")
                            }
                          >
                            <Check className="h-3 w-3" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="gap-1 px-4 h-8 text-xs"
                            onClick={() =>
                              handleStatusChange(order.id, "rejected")
                            }
                          >
                            <X className="h-3 w-3" /> Reject
                          </Button>
                        </div>
                      ) : (
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${order.status === "approved" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}
                        >
                          {order.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-20 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <AlertCircle className="h-10 w-10 opacity-20" />
                      <p className="font-medium">কোনো অর্ডার পাওয়া যায়নি।</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile & Tablet Card View */}
      <div className="lg:hidden space-y-4 px-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="h-8 w-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">অর্ডার লোড হচ্ছে...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden"
            >
              {/* Status Ribbon */}
              <div
                className={`absolute top-0 right-0 px-4 py-1 rounded-bl-xl text-[10px] font-bold uppercase tracking-widest ${
                  order.status === "approved"
                    ? "bg-green-500 text-white"
                    : order.status === "rejected"
                      ? "bg-red-500 text-white"
                      : "bg-orange-500 text-white"
                }`}
              >
                {order.status}
              </div>

              <div className="flex items-start gap-3 pt-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold shrink-0">
                  {order.student?.name?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-lg text-foreground truncate">
                    {order.student?.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1 font-mono">
                      <Hash className="h-3 w-3" /> {order.student?.roll}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />{" "}
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                    কোর্স
                  </p>
                  <p className="text-sm font-semibold text-foreground line-clamp-1">
                    {order.batch?.name}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                    পরিমান
                  </p>
                  <p className="text-lg font-black text-primary">
                    ৳{order.amount}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                    পেমেন্ট মেথড
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {order.payment_method}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                    বিকাশ/নগদ নং
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {order.payment_number}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                  Transaction ID (TrxID)
                </p>
                <div className="bg-muted rounded-lg p-3 font-mono text-sm font-bold text-center border border-border/50 select-all">
                  {order.trx_id}
                </div>
              </div>

              {order.status === "pending" && (
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white h-11 rounded-xl shadow-lg shadow-green-500/20"
                    onClick={() => handleStatusChange(order.id, "approved")}
                  >
                    <Check className="h-4 w-4 mr-2" /> Approve
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    className="flex-1 h-11 rounded-xl shadow-lg shadow-red-500/20"
                    onClick={() => handleStatusChange(order.id, "rejected")}
                  >
                    <X className="h-4 w-4 mr-2" /> Reject
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl">
            <AlertCircle className="h-12 w-12 text-muted-foreground opacity-20 mx-auto mb-4" />
            <p className="text-muted-foreground">কোনো অর্ডার পাওয়া যায়নি।</p>
          </div>
        )}
      </div>
    </div>
  );
}
