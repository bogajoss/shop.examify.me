"use client";

import { Check, X, Search, CreditCard, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAdmin } from "@/context/AdminContext";

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
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
  };

  const handleStatusChange = async (orderId: string, newStatus: "approved" | "rejected") => {
    if (!admin) {
      showToast("অ্যাডমিন লগইন প্রয়োজন", "error");
      return;
    }

    try {
      // 1. If rejecting, just update status
      if (newStatus === "rejected") {
        await supabase
          .from("orders")
          .update({ status: newStatus })
          .eq("id", orderId);
        
        showToast("অর্ডার রিজেক্ট করা হয়েছে", "success");
        fetchOrders();
        return;
      }

      // 2. If approving: Generate Token -> Save Token -> Update Order -> Enroll User
      if (newStatus === "approved") {
        const order = orders.find(o => o.id === orderId);
        // We need the full order details (student_id, batch_id) which might not be in the lightweight state
        const { data: fullOrder } = await supabase
          .from("orders")
          .select("student_id, batch_id")
          .eq("id", orderId)
          .single();

        if (!fullOrder) throw new Error("অর্ডার খুঁজে পাওয়া যায়নি");

        // Generate a random token
        const tokenString = `EXM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        // A. Insert into enrollment_tokens
        const { error: tokenError } = await supabase
          .from("enrollment_tokens")
          .insert({
            token: tokenString,
            batch_id: fullOrder.batch_id,
            created_by: admin.uid,
            is_used: true, // Auto-used since we auto-enroll
            used_by: fullOrder.student_id,
            used_at: new Date().toISOString(),
            max_uses: 1,
            current_uses: 1
          });

        if (tokenError) throw tokenError;

        // B. Update Order with Status and Token
        const { error: orderError } = await supabase
          .from("orders")
          .update({ 
            status: "approved",
            assigned_token: tokenString
          })
          .eq("id", orderId);

        if (orderError) throw orderError;

        // C. Auto-Enroll User (Update users table)
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
                enrolled_batches: [...currentBatches, fullOrder.batch_id]
              })
              .eq("uid", fullOrder.student_id);
        }

        showToast("অর্ডার অ্যাপ্রুভ এবং টোকেন জেনারেট করা হয়েছে!", "success");
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
      o.payment_number?.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">অর্ডার ম্যানেজমেন্ট</h2>
          <p className="text-sm text-muted-foreground">
            সকল পেমেন্ট রিকোয়েস্ট ভেরিফাই করুন
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="TrxID বা নাম খুঁজুন..."
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-3">শিক্ষার্থী</th>
                <th className="px-6 py-3">কোর্স/ব্যাচ</th>
                <th className="px-6 py-3">পেমেন্ট ডিটেইলস</th>
                <th className="px-6 py-3">TrxID</th>
                <th className="px-6 py-3">স্ট্যাটাস</th>
                <th className="px-6 py-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    অর্ডার লোড হচ্ছে...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-3">
                      <div>
                        <p className="font-medium text-foreground">{order.student?.name || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground font-mono">{order.student?.roll}</p>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-foreground">
                      {order.batch?.name || "Unknown Batch"}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">৳{order.amount}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <CreditCard className="h-3 w-3" />
                          {order.payment_method} - {order.payment_number}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3 font-mono text-xs font-medium text-foreground/80">
                      {order.trx_id}
                    </td>
                    <td className="px-6 py-3">
                      <Badge 
                        variant={
                          order.status === "approved" ? "success" : 
                          order.status === "rejected" ? "destructive" : "warning"
                        } 
                        className="uppercase text-[10px]"
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-right">
                      {order.status === "pending" && (
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            size="sm" 
                            className="h-8 w-8 p-0 rounded-full bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleStatusChange(order.id, "approved")}
                            title="Approve"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            className="h-8 w-8 p-0 rounded-full"
                            onClick={() => handleStatusChange(order.id, "rejected")}
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {order.status !== "pending" && (
                         <span className="text-xs text-muted-foreground italic">
                            {order.status === "approved" ? "Verified" : "Declined"}
                         </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="h-8 w-8 opacity-20" />
                    কোনো অর্ডার পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
