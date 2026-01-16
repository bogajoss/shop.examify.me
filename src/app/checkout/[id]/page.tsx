'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Copy } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { db } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';

const checkoutSchema = z.object({
  senderPhone: z.string().min(11, 'সঠিক ফোন নাম্বার দিন (১১ ডিজিট)'),
  trxId: z.string().min(6, 'সঠিক TrxID দিন (কমপক্ষে ৬ ডিজিট)'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { id } = useParams();
  const router = useRouter();
  const { user, submitOrder } = useAuth();
  const { showToast } = useToast();

  const course = db.courses.find(c => c.id === id);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      senderPhone: '',
      trxId: '',
    },
  });

  if (!course) return null;

  const onSubmit = (data: CheckoutFormValues) => {
    if (!user) {
      showToast('অর্ডার করার আগে লগইন করুন।', 'error');
      router.push('/login');
      return;
    }

    submitOrder(course);
    showToast('অর্ডার জমা হয়েছে! ভেরিফিকেশনের জন্য অপেক্ষা করুন।', 'info');
    router.push('/dashboard');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`Number copied: ${text}`);
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="mx-auto max-w-2xl px-4 pb-16 pt-6 sm:pt-14 flex-1 w-full">
        <button 
          onClick={() => router.back()} 
          className="text-sm text-muted-foreground hover:text-primary mb-4 flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="rounded-lg bg-card text-card-foreground shadow-sm border-[3px] border-primary/20">
          <div className="flex flex-col p-6 space-y-1 pb-3 border-b border-border/50">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">Payment instructions</p>
            <h3 className="font-semibold tracking-tight text-xl">Buy {course.title}</h3>
            <p className="text-muted-foreground text-xs">Complete payment & get token.</p>
          </div>
          
          <div className="p-6 space-y-6 text-sm">
            <div className="text-center py-6 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">Total Payable Amount</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl font-bold text-primary">৳{course.price}</span>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg space-y-4 border border-border">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span> 
                Send Money
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                {/* bKash */}
                <div className="relative bg-[#e2136e]/5 border border-[#e2136e]/30 rounded-xl p-4 flex flex-col items-center gap-3">
                  <div className="w-full flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#e2136e]">bKash Personal</span>
                    <button onClick={() => copyToClipboard('01973577899')} className="text-[#e2136e]/70">
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="text-center">
                    <span className="font-mono text-sm font-bold tracking-wide">01973577899</span>
                  </div>
                </div>

                {/* Nagad */}
                <div className="relative bg-[#f6921e]/5 border border-[#f6921e]/30 rounded-xl p-4 flex flex-col items-center gap-3">
                  <div className="w-full flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#f6921e]">Nagad Personal</span>
                    <button onClick={() => copyToClipboard('01754365403')} className="text-[#f6921e]/70">
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="text-center">
                    <span className="font-mono text-sm font-bold tracking-wide">01754365403</span>
                  </div>
                </div>

                {/* Rocket */}
                <div className="relative bg-[#8c3494]/5 border border-[#8c3494]/30 rounded-xl p-4 flex flex-col items-center gap-3">
                  <div className="w-full flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#8c3494]">Rocket Personal</span>
                    <button onClick={() => copyToClipboard('019735778997')} className="text-[#8c3494]/70">
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="text-center">
                    <span className="font-mono text-sm font-bold tracking-wide">019735778997</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span> 
                Submit Details
              </div>
              
              {user ? (
                <form onSubmit={handleSubmit(onSubmit)} className="ml-4 sm:ml-8 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground/70">যে নাম্বার থেকে টাকা পাঠিয়েছেন</label>
                    <div className="flex flex-col gap-1">
                      <input 
                        type="tel" 
                        {...register('senderPhone')}
                        placeholder="01XXXXXXXXX" 
                        className={`flex h-12 sm:h-10 w-full rounded-md border border-input bg-background px-3 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono ${errors.senderPhone ? 'border-destructive' : ''}`}
                      />
                      {errors.senderPhone && <p className="text-[10px] text-destructive font-medium">{errors.senderPhone.message}</p>}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground/70">TrxID</label>
                    <div className="flex flex-col gap-1">
                      <input 
                        type="text" 
                        {...register('trxId')}
                        placeholder="Transaction ID" 
                        className={`flex h-12 sm:h-10 w-full rounded-md border border-input bg-background px-3 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono ${errors.trxId ? 'border-destructive' : ''}`}
                      />
                      {errors.trxId && <p className="text-[10px] text-destructive font-medium">{errors.trxId.message}</p>}
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    fullWidth 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'প্রসেসিং...' : 'অর্ডার কনফার্ম করুন'}
                  </Button>
                </form>
              ) : (
                <div className="ml-4 sm:ml-8 text-center py-8 border-2 border-dashed border-border rounded-lg bg-muted/20">
                  <p className="mb-4 font-medium text-foreground">অর্ডার করার জন্য লগইন প্রয়োজন।</p>
                  <Button onClick={() => router.push('/login')}>Login Now</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}