'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Menu, X, Moon, Sun, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, theme, toggleTheme } = useAuth();
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: 'হোম', href: '/' },
    { name: 'কোর্সসমূহ', href: '/#courses' },
    { name: 'প্রশ্নব্যাংক', href: '/#question-bank' },
    { name: 'ফ্রি এক্সam', href: '/#free-exams' },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-center text-[10px] sm:text-xs py-2 px-4 font-medium sticky top-0 z-[60] shadow-sm">
        🎉 ২০২৬ সেশনের ভর্তি চলছে! আজই এনরোল করে নিশ্চিত করুন আপনার সিট।
      </div>

      <header className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sticky top-[32px] z-50 transition-all duration-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 cursor-pointer">
            <div className="bg-primary/10 rounded-lg p-1.5">
              <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <span className="font-bold text-lg sm:text-2xl text-primary tracking-tight">Examify</span>
          </Link>

          <nav className="hidden items-center gap-1 text-sm font-medium md:flex text-foreground/80">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-primary hover:bg-primary/5 px-3 py-2 rounded-md transition-all"
              >
                {link.name}
              </Link>
            ))}
            
            <div className="flex gap-2 ml-2">
              {user ? (
                <>
                  <Link href="/dashboard" className="hover:text-primary transition-colors cursor-pointer font-bold px-3 py-2">
                    ড্যাশবোর্ড
                  </Link>
                  <button onClick={logout} className="text-destructive hover:text-red-700 text-xs font-bold px-3 py-2">
                    লগআউট
                  </button>
                </>
              ) : (
                <>
                  <Link href="/#free-exams" className="hover:text-primary transition-colors cursor-pointer px-3 py-2">
                    ফ্রি এক্সাম
                  </Link>
                  <Link href="/login" className="hover:text-primary transition-colors cursor-pointer px-3 py-2">
                    লগইন
                  </Link>
                </>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            {!user && (
              <Link href="/login" className="hidden sm:flex items-center justify-center gap-2 whitespace-nowrap border-[3px] border-transparent text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-[25px] h-10 px-6 transition-all">
                লগইন
              </Link>
            )}

            <button
              onClick={toggleTheme}
              className="items-center justify-center border-none bg-transparent hover:bg-muted text-foreground/70 hover:text-primary h-9 w-9 rounded-full transition-all hidden sm:flex"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary hover:bg-muted focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background absolute w-full left-0 shadow-lg animate-in slide-in-from-top-5 duration-200">
            <div className="px-4 py-4 space-y-3">
              <nav className="flex flex-col gap-2 text-base font-medium text-foreground/80">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              <div className="pt-4 border-t border-border flex flex-col gap-3">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center w-full gap-2 p-3 rounded-lg hover:bg-muted text-center border border-border/50 bg-card font-bold"
                    >
                      <LayoutDashboard className="h-5 w-5" /> ড্যাশবোর্ড
                    </Link>
                    <button
                      onClick={() => { logout(); setIsMenuOpen(false); }}
                      className="flex items-center justify-center w-full gap-2 p-3 rounded-lg hover:bg-destructive/10 border border-destructive/20 text-destructive font-bold"
                    >
                      <LogOut className="h-5 w-5" /> লগআউট
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center w-full gap-2 p-3 rounded-full bg-primary text-primary-foreground font-bold"
                  >
                    লগইন করুন
                  </Link>
                )}

                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                >
                  <span>থিম পরিবর্তন করুন</span>
                  {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
