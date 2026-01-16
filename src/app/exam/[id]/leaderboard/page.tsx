'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Trophy, ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { db } from '@/data/mockData';

export default function ExamLeaderboard() {
  const { id } = useParams();
  const router = useRouter();
  
  const exam = db.freeExams.find(e => e.id === id);
  const entries = db.leaderboards[id as string] || [];

  if (!exam) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="mx-auto max-w-4xl px-4 py-8 w-full flex-1">
        <button 
          onClick={() => router.back()} 
          className="text-sm text-muted-foreground hover:text-primary mb-4 flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
            <Trophy className="text-yellow-500" /> {exam.title} লিডারবোর্ড
          </h1>
          <p className="text-sm text-muted-foreground">{exam.subject} • সেরা পারফর্মারদের তালিকা</p>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/50 text-xs text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-4 text-center w-16">Rank</th>
                  <th className="p-4">Student</th>
                  <th className="p-4 text-center">Score</th>
                  <th className="p-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {entries.length > 0 ? entries.map((s, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 text-center font-bold">
                      {s.rank === 1 ? '🥇' : (s.rank === 2 ? '🥈' : (s.rank === 3 ? '🥉' : `#${s.rank}`))}
                    </td>
                    <td className="p-4 font-medium text-foreground">{s.name}</td>
                    <td className="p-4 text-center">
                      <span className="font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg">
                        {s.score}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono text-muted-foreground">{s.time}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground italic">
                      No entries found for this exam yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
