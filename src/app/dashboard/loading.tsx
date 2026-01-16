import React from 'react';

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-muted animate-pulse rounded-md ${className}`} />
);

export default function DashboardLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full border-b border-border bg-background py-3">
        <div className="mx-auto max-w-7xl px-4 flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-5xl px-4 py-8 w-full space-y-8">
        {/* Profile Header Skeleton */}
        <div className="flex items-center gap-4 bg-card p-6 rounded-xl border border-border">
          <Skeleton className="h-16 w-16 rounded-full shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Token Area Skeleton */}
        <div className="bg-primary/5 p-6 rounded-xl space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-2">
            <Skeleton className="flex-1 h-11" />
            <Skeleton className="h-11 w-20" />
          </div>
        </div>

        {/* List Skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 space-y-4">
                <div className="flex justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
