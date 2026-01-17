"use client";

import { Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/Badge";

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

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
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
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.roll?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">শিক্ষার্থী তালিকা</h2>
          <p className="text-sm text-muted-foreground">
            নিবন্ধিত সকল শিক্ষার্থীদের তথ্য দেখুন
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="নাম বা রোল দিয়ে খুঁজুন..."
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
                <th className="px-6 py-3">নাম</th>
                <th className="px-6 py-3">রোল</th>
                <th className="px-6 py-3">ব্যাচ সংখ্যা</th>
                <th className="px-6 py-3">জয়েনিং ডেট</th>
                <th className="px-6 py-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    তথ্য লোড হচ্ছে...
                  </td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.uid} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <User className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-foreground">
                          {student.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3 font-mono text-muted-foreground">
                      {student.roll}
                    </td>
                    <td className="px-6 py-3">
                      <Badge variant="secondary" className="font-mono">
                        {student.enrolled_batches?.length || 0}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {new Date(student.created_at).toLocaleDateString("bn-BD")}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button className="text-primary hover:underline text-xs font-medium">
                        বিস্তারিত
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    কোনো শিক্ষার্থী পাওয়া যায়নি।
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
