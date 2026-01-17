"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background dark:bg-card dark:text-foreground border-t border-border mt-auto transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 text-center md:text-left">
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 bg-background w-fit px-3 py-2 rounded-md shadow-sm">
              <span className="font-bold text-primary px-2 text-lg">
                Examify
              </span>
            </div>
            <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-xs md:max-w-none">
              উন্নত শিক্ষা, লাইভ এক্সাম এবং তাৎক্ষণিক এক্সাম রেজাল্ট নিয়ে শিক্ষার্থীদের পাশে আমরা। সহজ পেমেন্ট সিস্টেমের মাধ্যমে এনরোল করুন।
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-background dark:text-foreground mb-4">
              প্রয়োজনীয় লিংক
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground/80">
              <li>
                <Link
                  href="/"
                  className="hover:text-primary transition-colors cursor-pointer block p-1"
                >
                  হোম
                </Link>
              </li>
              <li>
                <Link
                  href="/#courses"
                  className="hover:text-primary transition-colors cursor-pointer block p-1"
                >
                  সকল কোর্স
                </Link>
              </li>
              <li>
                <Link
                  href="/#question-bank"
                  className="hover:text-primary transition-colors cursor-pointer block p-1"
                >
                  প্রশ্নব্যাংক
                </Link>
              </li>
              <li>
                <Link
                  href="/#free-exams"
                  className="hover:text-primary transition-colors cursor-pointer block p-1"
                >
                  ফ্রি এক্সাম
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-background dark:text-foreground mb-4">
              যোগাযোগ
            </h4>
            <ul className="space-y-4 text-sm text-muted-foreground/80 flex flex-col items-center md:items-start">
              <li className="flex items-center md:items-start gap-3">
                <span>সিলেট, বাংলাদেশ</span>
              </li>
              <li className="flex items-center md:items-start gap-3">
                <a
                  href="tel:+8801999681290"
                  className="hover:text-primary transition-colors py-1 px-3 border border-border/30 rounded-full bg-background/5 inline-block"
                >
                  +8801999681290
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border/30 text-center text-xs text-muted-foreground/50">
          <p>© 2026 Examify. সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
