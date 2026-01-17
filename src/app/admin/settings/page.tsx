"use client";

import { Bell, Database, Globe, Settings, Shield, User } from "lucide-react";
import Button from "@/components/ui/Button";

export default function AdminSettings() {
  const sections = [
    {
      icon: User,
      label: "প্রোফাইল সেটিংস",
      desc: "এডমিন প্রোফাইল তথ্য পরিবর্তন করুন",
    },
    { icon: Shield, label: "সিকিউরিটি", desc: "পাসওয়ার্ড এবং টু-ফ্যাক্টর অথেনটিকেশন" },
    { icon: Bell, label: "নোটিফিকেশন", desc: "সিস্টেম অ্যালার্ট এবং ইমেইল সেটিংস" },
    { icon: Globe, label: "জেনারেল সেটিংস", desc: "সাইটের নাম, লোগো এবং এসইও" },
    { icon: Database, label: "ব্যাকআপ", desc: "ডাটাবেজ ব্যাকআপ এবং রিস্টোর" },
  ];

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header */}
      <div className="px-4 sm:px-0">
        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          সেটিংস
        </h2>
        <p className="text-sm text-muted-foreground font-medium">
          সিস্টেম কনফিগারেশন এবং প্রোফাইল সেটিংস পরিচালনা করুন
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-0">
        {/* Left Column - Main Settings Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-[2.5rem] p-8 sm:p-12 text-center shadow-sm relative overflow-hidden group">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/10 transition-all" />

            <div className="relative space-y-6">
              <div className="h-20 w-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-primary transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <Settings className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-foreground">
                  শীঘ্রই আসছে
                </h3>
                <p className="text-muted-foreground max-w-sm mx-auto text-sm sm:text-base leading-relaxed">
                  এই পেজটির কাজ বর্তমানে প্রক্রিয়াধীন রয়েছে। শীঘ্রই এখান থেকে আপনি এডমিন
                  প্রোফাইল এবং সিস্টেমের অন্যান্য গুরুত্বপূর্ণ সেটিংস পরিবর্তন করতে পারবেন।
                </p>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  variant="outline"
                  disabled
                  className="w-full sm:w-auto px-8 rounded-xl h-12 font-bold opacity-50"
                >
                  সেভ চেঞ্জেস
                </Button>
                <Button
                  disabled
                  className="w-full sm:w-auto px-8 rounded-xl h-12 font-bold opacity-50"
                >
                  ডিফল্ট সেটিংস
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats/Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-muted/30 border border-border rounded-3xl space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                App Version
              </p>
              <p className="text-lg font-black text-foreground">v2.0.4-alpha</p>
            </div>
            <div className="p-6 bg-muted/30 border border-border rounded-3xl space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Database Status
              </p>
              <p className="text-lg font-black text-green-600 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse" />{" "}
                Connected
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Navigation/Sections List */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">
            সেটিংস সেকশন
          </h4>
          <div className="space-y-2">
            {sections.map((section) => (
              <div
                key={section.label}
                className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-primary/20 hover:shadow-lg transition-all cursor-not-allowed opacity-60 group"
              >
                <div className="h-12 w-12 rounded-xl bg-muted group-hover:bg-primary/10 group-hover:text-primary flex items-center justify-center shrink-0 transition-colors">
                  <section.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-foreground text-sm truncate">
                    {section.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {section.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
