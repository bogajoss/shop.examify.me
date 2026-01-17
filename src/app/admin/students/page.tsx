"use client";

import {
  Calendar,
  MoreVertical,
  Search,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { supabase } from "@/lib/supabase";

interface Student {
  uid: string;
  name: string;
  roll: string;
  created_at: string;
  enrolled_batches: string[] | null;
}

export default function AdminStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchStudents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.roll?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center px-4 sm:px-0">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            শিক্ষার্থী তালিকা
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            আপনার প্ল্যাটফর্মে নিবন্ধিত সকল শিক্ষার্থীদের তথ্য ও এনরোলমেন্ট পরিচালনা করুন
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="নাম বা রোল দিয়ে খুঁজুন..."
            className="w-full h-12 pl-10 pr-4 rounded-2xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Desktop View Table */}
      <div className="hidden lg:block bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/30 text-muted-foreground font-black border-b border-border uppercase tracking-widest text-[10px]">
              <tr>
                <th className="px-8 py-5">শিক্ষার্থী</th>
                <th className="px-6 py-5">রোল নম্বর</th>
                <th className="px-6 py-5">এনরোল ব্যাচ</th>
                <th className="px-6 py-5">নিবন্ধন তারিখ</th>
                <th className="px-8 py-5 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-16 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      তথ্য লোড হচ্ছে...
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr
                    key={student.uid}
                    className="hover:bg-muted/10 transition-colors group"
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm group-hover:scale-110 transition-transform">
                          {student.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-base">
                            {student.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                            Student User
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm bg-muted px-2.5 py-1 rounded-lg border border-border/50 text-foreground/80">
                        {student.roll}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="font-mono bg-primary/5 text-primary border-primary/10"
                        >
                          {student.enrolled_batches?.length || 0}
                        </Badge>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                          Batches
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground font-medium">
                        <Calendar className="h-3.5 w-3.5 opacity-60" />
                        {new Date(student.created_at).toLocaleDateString(
                          "en-GB",
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button
                        type="button"
                        className="h-9 px-4 rounded-xl border border-border hover:bg-primary hover:text-white hover:border-primary transition-all text-xs font-black uppercase tracking-widest"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-20 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Search className="h-10 w-10 opacity-20" />
                      <p className="font-bold">কোনো শিক্ষার্থী পাওয়া যায়নি</p>
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
            <p className="text-muted-foreground font-medium">
              শিক্ষার্থীদের তালিকা লোড হচ্ছে...
            </p>
          </div>
        ) : filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <div
              key={student.uid}
              className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-5 relative overflow-hidden group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl font-black shrink-0">
                    {student.name?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-lg text-foreground truncate">
                      {student.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                      <ShieldCheck className="h-3 w-3 text-green-500" />{" "}
                      Verified Student
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="p-2 hover:bg-muted rounded-xl transition-colors"
                >
                  <MoreVertical className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 py-4 border-y border-border/50">
                <div className="bg-muted/30 p-3 rounded-2xl border border-border/50">
                  <p className="text-[9px] uppercase text-muted-foreground font-black tracking-widest mb-1">
                    রোল নম্বর
                  </p>
                  <p className="text-sm font-black text-foreground font-mono">
                    {student.roll}
                  </p>
                </div>
                <div className="bg-muted/30 p-3 rounded-2xl border border-border/50">
                  <p className="text-[9px] uppercase text-muted-foreground font-black tracking-widest mb-1">
                    ব্যাচ সংখ্যা
                  </p>
                  <p className="text-sm font-black text-primary uppercase">
                    {student.enrolled_batches?.length || 0} Batches
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
                  <Calendar className="h-4 w-4 opacity-40" />
                  জয়েনিং: {new Date(student.created_at).toLocaleDateString()}
                </div>
                <button
                  type="button"
                  className="text-xs font-black text-primary uppercase tracking-widest hover:underline"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-[2.5rem] mx-2">
            <UserIcon className="h-16 w-16 text-muted-foreground opacity-20 mx-auto mb-4" />
            <p className="text-muted-foreground font-bold">
              কোনো শিক্ষার্থী পাওয়া যায়নি
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
