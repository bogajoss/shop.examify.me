'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Phone, Lock, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { user, login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 11) {
      showToast('সঠিক ফোন নাম্বার দিন!', 'error');
      return;
    }
    if (password.length < 4) {
      showToast('পাসওয়ার্ড খুব ছোট!', 'error');
      return;
    }
    
    login(phone);
    showToast('লগইন সফল হয়েছে!');
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4 bg-muted/10 relative overflow-hidden min-h-[80vh]">
        <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
        
        <div className="w-full max-w-sm bg-card border border-border rounded-xl p-8 shadow-xl space-y-8 relative z-10 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
              <LogIn className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-primary">লগইন</h1>
            <p className="text-xs text-muted-foreground">ফোন নাম্বার ও পাসওয়ার্ড দিয়ে একাউন্টে প্রবেশ করুন</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground/70">ফোন নাম্বার</label>
                <div className="flex h-12">
                  <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-input bg-muted text-muted-foreground text-sm font-mono font-medium">+88</span>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 h-full rounded-r-lg border border-input bg-background px-4 text-base focus:ring-2 focus:ring-primary focus:outline-none font-mono" 
                    placeholder="01XXXXXXXXX" 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs font-medium text-foreground/70">পাসওয়ার্ড</label>
                  <button type="button" className="text-xs text-primary hover:underline">ভুলে গেছেন?</button>
                </div>
                <div className="relative">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex h-12 w-full rounded-lg border border-input bg-background px-4 text-base focus:ring-2 focus:ring-primary focus:outline-none" 
                    placeholder="••••••••" 
                    required 
                  />
                </div>
              </div>
            </div>
            <Button type="submit" fullWidth size="lg" className="gap-2 shadow-primary/20">
              লগইন করুন <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
          
          <div className="text-center text-xs text-muted-foreground">
            একাউন্ট নেই? <button className="text-primary font-bold hover:underline">রেজিস্ট্রেশন করুন</button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
