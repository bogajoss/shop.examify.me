"use client";

import { Settings } from "lucide-react";
import Button from "@/components/ui/Button";

export default function AdminSettings() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-foreground">সেটিংস</h2>
        <p className="text-sm text-muted-foreground">
          সিস্টেম কনফিগারেশন এবং প্রোফাইল সেটিংস
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 text-center shadow-sm">
        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
          <Settings className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">শীঘ্রই আসছে</h3>
        <p className="text-muted-foreground max-w-sm mx-auto mb-6">
          এই পেজটির কাজ চলছে। শীঘ্রই এখান থেকে আপনি এডমিন প্রোফাইল এবং সিস্টেমের অন্যান্য সেটিংস পরিবর্তন করতে পারবেন।
        </p>
        <Button variant="outline" disabled>
          সেভ চেঞ্জেস
        </Button>
      </div>
    </div>
  );
}
