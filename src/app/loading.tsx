import React from 'react';

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-muted animate-pulse rounded-md ${className}`} />
);

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-primary/20 h-8 w-full" />
      <header className="w-full border-b border-border bg-background py-3">
        <div className="mx-auto max-w-7xl px-4 flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <div className="flex gap-4">
            <Skeleton className="h-6 w-16 hidden md:block" />
            <Skeleton className="h-6 w-16 hidden md:block" />
            <Skeleton className="h-6 w-16 hidden md:block" />
          </div>
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full bg-secondary/30 py-20 px-4">
          <div className="mx-auto max-w-5xl text-center space-y-6">
            <Skeleton className="h-6 w-48 mx-auto rounded-full" />
            <Skeleton className="h-16 w-3/4 mx-auto" />
            <Skeleton className="h-20 w-1/2 mx-auto" />
            <div className="flex justify-center gap-4 pt-4">
              <Skeleton className="h-12 w-40 rounded-full" />
              <Skeleton className="h-12 w-40 rounded-full" />
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-16 space-y-12">
          <div className="space-y-6">
            <Skeleton className="h-10 w-48" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-border rounded-lg p-4 space-y-4">
                  <Skeleton className="aspect-video w-full rounded-md" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
