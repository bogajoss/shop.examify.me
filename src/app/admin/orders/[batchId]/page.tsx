"use client";

import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Calendar,
  Check,
  CreditCard,
  Hash,
  RotateCw,
  Search,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  approveOrderAction,
  rejectOrderAction,
} from "@/app/actions/order-actions";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdmin } from "@/context/AdminContext";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  created_at: string;
  amount: number;
  payment_method: string;
  payment_number: string;
  trx_id: string;
  status: "pending" | "approved" | "rejected";
  assigned_token?: string;
  admin_comment?: string;
  expires_at?: string | null;
  student: {
    name: string;
    roll: string;
  };
  batch: {
    name: string;
  };
}

const DURATIONS = [
  { label: "Lifetime", value: "lifetime" },
  { label: "3 Days", value: "3" },
  { label: "7 Days", value: "7" },
  { label: "15 Days", value: "15" },
  { label: "30 Days", value: "30" },
  { label: "60 Days", value: "60" },
  { label: "90 Days", value: "90" },
  { label: "180 Days", value: "180" },
  { label: "365 Days", value: "365" },
  { label: "Custom", value: "custom" },
];

const DAYS = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const MONTHS = [
  { label: "Jan", value: "01" },
  { label: "Feb", value: "02" },
  { label: "Mar", value: "03" },
  { label: "Apr", value: "04" },
  { label: "May", value: "05" },
  { label: "Jun", value: "06" },
  { label: "Jul", value: "07" },
  { label: "Aug", value: "08" },
  { label: "Sep", value: "09" },
  { label: "Oct", value: "10" },
  { label: "Nov", value: "11" },
  { label: "Dec", value: "12" },
];
const YEARS = ["2025", "2026", "2027", "2028", "2029", "2030"];

export default function BatchOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [batchName, setBatchName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const [selectedDurations, setSelectedDurations] = useState<{
    [key: string]: string;
  }>({});
  const [customDates, setCustomDates] = useState<{ [key: string]: string }>({});
  const [isLoadingAction, setIsLoadingAction] = useState<{
    [key: string]: boolean;
  }>({});
  
  const { showToast } = useToast();
  const { admin } = useAdmin();
  const params = useParams();
  const router = useRouter();
  const batchId = params?.batchId as string;

  const fetchBatchDetails = useCallback(async () => {
    if (!batchId) return;
    try {
      const { data, error } = await supabase
        .from("batches")
        .select("name")
        .eq("id", batchId)
        .single();

      if (data) {
        setBatchName(data.name);
      }
    } catch (error) {
      console.error("Error fetching batch details:", error);
    }
  }, [batchId]);

  const fetchOrders = useCallback(async () => {
    if (!batchId) return;
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          student:users(name, roll),
          batch:batches(name)
        `)
        .eq("batch_id", batchId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);

      // Initialize comments and durations state
      const initialComments: { [key: string]: string } = {};
      const initialDurations: { [key: string]: string } = {};
      const initialCustomDates: { [key: string]: string } = {};

      data?.forEach((o) => {
        if (o.admin_comment) {
          initialComments[o.id] = o.admin_comment;
        }

        if (o.expires_at) {
          initialDurations[o.id] = "custom";
          initialCustomDates[o.id] = new Date(o.expires_at)
            .toISOString()
            .split("T")[0];
        } else {
          initialDurations[o.id] = "lifetime";
        }
      });
      setComments(initialComments);
      setSelectedDurations(initialDurations);
      setCustomDates(initialCustomDates);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  }, [batchId]);

  useEffect(() => {
    fetchBatchDetails();
    fetchOrders();
  }, [fetchOrders, fetchBatchDetails]);

  const handleStatusChange = async (
    orderId: string,
    newStatus: "approved" | "rejected",
  ) => {
    if (!admin) {
      showToast("অ্যাডমিন লগইন প্রয়োজন", "error");
      return;
    }

    try {
      setIsLoadingAction((prev) => ({ ...prev, [orderId]: true }));
      const comment = comments[orderId];
      if (newStatus === "rejected") {
        const result = await rejectOrderAction(orderId, comment);
        if (result.success) {
          showToast(result.message || "অর্ডার রিজেক্ট করা হয়েছে", "success");
          fetchOrders();
        } else {
          showToast(result.message || "অর্ডার রিজেক্ট ব্যর্থ হয়েছে", "error");
        }
        return;
      }

      if (newStatus === "approved") {
        let expiresAt: string | null = null;
        const duration = selectedDurations[orderId];

        if (duration === "lifetime") {
          expiresAt = null;
        } else if (duration === "custom") {
          const customDate = customDates[orderId];
          if (!customDate) {
            showToast("কাস্টম তারিখ সিলেক্ট করুন", "error");
            return;
          }
          // Set to end of day (23:59:59) in local time
          expiresAt = new Date(`${customDate}T23:59:59`).toISOString();
        } else {
          const days = parseInt(duration);
          const date = new Date();
          date.setDate(date.getDate() + days);
          expiresAt = date.toISOString();
        }

        const result = await approveOrderAction(orderId, comment, expiresAt);
        if (result.success) {
          showToast(
            result.message || "অর্ডার অ্যাপ্রুভ এবং এনরোল করা হয়েছে!",
            "success",
          );
          fetchOrders();
        } else {
          showToast(result.message || "অর্ডার অ্যাপ্রুভ ব্যর্থ হয়েছে", "error");
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
      showToast("স্ট্যাটাস আপডেট ব্যর্থ হয়েছে", "error");
    } finally {
      setIsLoadingAction((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const handleCustomDateUpdate = (
    orderId: string,
    part: "day" | "month" | "year",
    value: string,
  ) => {
    const current = customDates[orderId] || "2026-01-01";
    const parts = current.split("-");
    let y = parts[0];
    let m = parts[1];
    let d = parts[2];

    if (part === "year") y = value;
    if (part === "month") m = value;
    if (part === "day") d = value;

    setCustomDates((prev) => ({
      ...prev,
      [orderId]: `${y}-${m}-${d}`,
    }));
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
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin/orders")}
              className="p-0 hover:bg-transparent -ml-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-2xl font-bold text-foreground">
              {batchName ? `${batchName} - অর্ডার` : "অর্ডার ম্যানেজমেন্ট"}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground ml-7">
            এই ব্যাচের সকল পেমেন্ট রিকোয়েস্ট ভেরিফাই করুন
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
      <div className="hidden lg:block bg-card border border-border rounded-xl shadow-sm overflow-hidden mx-4 md:mx-0">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-muted/30 text-muted-foreground font-semibold border-b border-border uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-4 whitespace-nowrap">শিক্ষার্থী</th>
                <th className="px-4 py-4 whitespace-nowrap">কোর্স/ব্যাচ</th>
                <th className="px-4 py-4 whitespace-nowrap">পেমেন্ট ডিটেইলস</th>
                <th className="px-4 py-4 whitespace-nowrap">TrxID</th>
                <th className="px-4 py-4 whitespace-nowrap">মেয়াদ</th>
                <th className="px-4 py-4 whitespace-nowrap">অ্যাডমিন নোট</th>
                <th className="px-4 py-4">স্ট্যাটাস</th>
                <th className="px-4 py-4 text-right whitespace-nowrap">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={8}
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
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 min-w-[140px]">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                          {order.student?.name?.charAt(0) || "U"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate max-w-[120px]">
                            {order.student?.name || "Unknown"}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                            <Hash className="h-2.5 w-2.5" />{" "}
                            {order.student?.roll}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-foreground font-medium min-w-[120px]">
                        <BookOpen className="h-3.5 w-3.5 text-primary/60 shrink-0" />
                        <span className="truncate">{order.batch?.name || "Unknown Batch"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col min-w-[130px]">
                        <span className="font-bold text-foreground text-sm">
                          ৳{order.amount}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 truncate">
                          <CreditCard className="h-2.5 w-2.5 text-[#25D366] shrink-0" />
                          {order.payment_method} • {order.payment_number}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-mono text-[10px] bg-muted px-2 py-1 rounded border border-border/50 text-foreground/80 whitespace-nowrap">
                        {order.trx_id}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1.5 min-w-[110px]">
                        <select
                          className="h-8 px-2 rounded-lg border border-border bg-background text-[10px] focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all w-full"
                          value={selectedDurations[order.id] || "lifetime"}
                          onChange={(e) =>
                            setSelectedDurations((prev) => ({
                              ...prev,
                              [order.id]: e.target.value,
                            }))
                          }
                        >
                          {DURATIONS.map((d) => (
                            <option key={d.value} value={d.value}>
                              {d.label}
                            </option>
                          ))}
                        </select>
                        {selectedDurations[order.id] === "custom" && (
                          <div className="flex gap-1">
                            <Select
                              value={(customDates[order.id] || "2026-01-01").split("-")[2]}
                              onValueChange={(val) => handleCustomDateUpdate(order.id, "day", val)}
                            >
                              <SelectTrigger className="h-8 w-[45px] px-1 text-[10px] focus:ring-1 focus:ring-primary/20">
                                <SelectValue placeholder="D" />
                              </SelectTrigger>
                              <SelectContent>
                                {DAYS.map((d) => (
                                  <SelectItem key={d} value={d} className="text-[10px]">{d}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select
                              value={(customDates[order.id] || "2026-01-01").split("-")[1]}
                              onValueChange={(val) => handleCustomDateUpdate(order.id, "month", val)}
                            >
                              <SelectTrigger className="h-8 w-[55px] px-1 text-[10px] focus:ring-1 focus:ring-primary/20">
                                <SelectValue placeholder="M" />
                              </SelectTrigger>
                              <SelectContent>
                                {MONTHS.map((m) => (
                                  <SelectItem key={m.value} value={m.value} className="text-[10px]">{m.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select
                              value={(customDates[order.id] || "2026-01-01").split("-")[0]}
                              onValueChange={(val) => handleCustomDateUpdate(order.id, "year", val)}
                            >
                              <SelectTrigger className="h-8 w-[65px] px-1 text-[10px] focus:ring-1 focus:ring-primary/20">
                                <SelectValue placeholder="Y" />
                              </SelectTrigger>
                              <SelectContent>
                                {YEARS.map((y) => (
                                  <SelectItem key={y} value={y} className="text-[10px]">{y}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="text"
                        placeholder="নোট লিখুন..."
                        className="w-full min-w-[120px] h-8 px-3 rounded-lg border border-border bg-background text-[10px] focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                        value={comments[order.id] || ""}
                        onChange={(e) =>
                          setComments((prev) => ({
                            ...prev,
                            [order.id]: e.target.value,
                          }))
                        }
                      />
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        variant={
                          order.status === "approved"
                            ? "success"
                            : order.status === "rejected"
                              ? "destructive"
                              : "warning"
                        }
                        className="uppercase text-[8px] px-1.5 py-0.5 tracking-tighter"
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-right">
                      {order.status === "pending" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white gap-1 px-2.5 h-7 text-[10px]"
                            onClick={() =>
                              handleStatusChange(order.id, "approved")
                            }
                            disabled={isLoadingAction[order.id]}
                          >
                            <Check className="h-3 w-3" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="gap-1 px-2.5 h-7 text-[10px]"
                            onClick={() =>
                              handleStatusChange(order.id, "rejected")
                            }
                            disabled={isLoadingAction[order.id]}
                          >
                            <X className="h-3 w-3" /> Reject
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          {order.status === "approved" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-[10px] gap-1 border-primary/20 text-primary hover:bg-primary/5 px-2"
                              onClick={() =>
                                handleStatusChange(order.id, "approved")
                              }
                              disabled={isLoadingAction[order.id]}
                            >
                              <RotateCw
                                className={cn(
                                  "h-2.5 w-2.5",
                                  isLoadingAction[order.id] && "animate-spin",
                                )}
                              />{" "}
                              Update
                            </Button>
                          )}
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${order.status === "approved" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}
                          >
                            {order.status}
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
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
      <div className="lg:hidden space-y-4 px-4 pb-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="h-8 w-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">অর্ডার লোড হচ্ছে...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 relative overflow-hidden"
            >
              {/* Status Ribbon */}
              <div
                className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[9px] font-bold uppercase tracking-widest ${
                  order.status === "approved"
                    ? "bg-green-500 text-white"
                    : order.status === "rejected"
                      ? "bg-red-500 text-white"
                      : "bg-orange-500 text-white"
                }`}
              >
                {order.status}
              </div>

              <div className="flex items-start gap-3 pt-1">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg font-bold shrink-0">
                  {order.student?.name?.charAt(0)}
                </div>
                <div className="min-w-0 pr-16">
                  <h3 className="font-bold text-base sm:text-lg text-foreground truncate">
                    {order.student?.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1 font-mono">
                      <Hash className="h-2.5 w-2.5" /> {order.student?.roll}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-2.5 w-2.5" />{" "}
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 py-3 border-y border-border/50">
                <div className="space-y-0.5">
                  <p className="text-[9px] uppercase text-muted-foreground font-bold tracking-wider">
                    কোর্স
                  </p>
                  <p className="text-xs font-semibold text-foreground line-clamp-1">
                    {order.batch?.name}
                  </p>
                </div>
                <div className="space-y-0.5 text-right sm:text-left">
                  <p className="text-[9px] uppercase text-muted-foreground font-bold tracking-wider">
                    পরিমান
                  </p>
                  <p className="text-base font-black text-primary">
                    ৳{order.amount}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[9px] uppercase text-muted-foreground font-bold tracking-wider">
                    পেমেন্ট মেথড
                  </p>
                  <p className="text-xs font-semibold text-foreground">
                    {order.payment_method}
                  </p>
                </div>
                <div className="space-y-0.5 text-right sm:text-left">
                  <p className="text-[9px] uppercase text-muted-foreground font-bold tracking-wider">
                    বিকাশ/নগদ নং
                  </p>
                  <p className="text-xs font-semibold text-foreground">
                    {order.payment_number}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[9px] uppercase text-muted-foreground font-bold tracking-wider">
                  Transaction ID (TrxID)
                </p>
                <div className="bg-muted rounded-lg p-2 font-mono text-xs font-bold text-center border border-border/50 select-all truncate">
                  {order.trx_id}
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-[9px] uppercase text-muted-foreground font-bold tracking-wider">
                  মেয়াদ (Access Duration)
                </p>
                <div className="flex flex-col gap-2">
                  <select
                    className="w-full h-10 px-3 rounded-xl border border-border bg-muted/30 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                    value={selectedDurations[order.id] || "lifetime"}
                    onChange={(e) =>
                      setSelectedDurations((prev) => ({
                        ...prev,
                        [order.id]: e.target.value,
                      }))
                    }
                  >
                    {DURATIONS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                  {selectedDurations[order.id] === "custom" && (
                    <div className="flex gap-2">
                      <Select
                        value={(customDates[order.id] || "2026-01-01").split("-")[2]}
                        onValueChange={(val) => handleCustomDateUpdate(order.id, "day", val)}
                      >
                        <SelectTrigger className="flex-1 h-10 px-3 rounded-xl border border-border bg-muted/30 text-xs focus:ring-1 focus:ring-primary/20">
                          <SelectValue placeholder="D" />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS.map((d) => (
                            <SelectItem key={d} value={d}>দিন: {d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={(customDates[order.id] || "2026-01-01").split("-")[1]}
                        onValueChange={(val) => handleCustomDateUpdate(order.id, "month", val)}
                      >
                        <SelectTrigger className="flex-1 h-10 px-3 rounded-xl border border-border bg-muted/30 text-xs focus:ring-1 focus:ring-primary/20">
                          <SelectValue placeholder="M" />
                        </SelectTrigger>
                        <SelectContent>
                          {MONTHS.map((m) => (
                            <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={(customDates[order.id] || "2026-01-01").split("-")[0]}
                        onValueChange={(val) => handleCustomDateUpdate(order.id, "year", val)}
                      >
                        <SelectTrigger className="flex-1 h-10 px-3 rounded-xl border border-border bg-muted/30 text-xs focus:ring-1 focus:ring-primary/20">
                          <SelectValue placeholder="Y" />
                        </SelectTrigger>
                        <SelectContent>
                          {YEARS.map((y) => (
                            <SelectItem key={y} value={y}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-[9px] uppercase text-muted-foreground font-bold tracking-wider">
                  অ্যাডমিন নোট
                </p>
                <input
                  type="text"
                  placeholder="নোট লিখুন..."
                  className="w-full h-10 px-3 rounded-xl border border-border bg-muted/30 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                  value={comments[order.id] || ""}
                  onChange={(e) =>
                    setComments((prev) => ({
                      ...prev,
                      [order.id]: e.target.value,
                    }))
                  }
                />
              </div>

              {order.status === "pending" ? (
                <div className="flex gap-3 pt-1">
                  <Button
                    type="button"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white h-10 rounded-xl shadow-lg shadow-green-500/20 text-xs"
                    onClick={() => handleStatusChange(order.id, "approved")}
                    disabled={isLoadingAction[order.id]}
                  >
                    <Check className="h-3.5 w-3.5 mr-1.5" /> Approve
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    className="flex-1 h-10 rounded-xl shadow-lg shadow-red-500/20 text-xs"
                    onClick={() => handleStatusChange(order.id, "rejected")}
                    disabled={isLoadingAction[order.id]}
                  >
                    <X className="h-3.5 w-3.5 mr-1.5" /> Reject
                  </Button>
                </div>
              ) : (
                order.status === "approved" && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-10 rounded-xl border-primary/20 text-primary font-bold shadow-sm text-xs"
                    onClick={() => handleStatusChange(order.id, "approved")}
                    disabled={isLoadingAction[order.id]}
                  >
                    <RotateCw
                      className={cn(
                        "h-3.5 w-3.5 mr-2",
                        isLoadingAction[order.id] && "animate-spin",
                      )}
                    />{" "}
                    Update Access Info
                  </Button>
                )
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl">
            <AlertCircle className="h-10 w-10 text-muted-foreground opacity-20 mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">কোনো অর্ডার পাওয়া যায়নি।</p>
          </div>
        )}
      </div>
    </div>
  );
}
