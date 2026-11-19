"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TuitionCard } from "@/components/tuition/TuitionCard";
import { Tuition } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const BrowseTuitionsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search & Filter states
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [classLevel, setClassLevel] = useState(searchParams.get("classLevel") || "All");
  const [mode, setMode] = useState(searchParams.get("mode") || "All");
  
  // Pagination states
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (classLevel !== "All") params.set("classLevel", classLevel);
      if (mode !== "All") params.set("mode", mode);
      params.set("page", page.toString());
      params.set("limit", "8");

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tuitions?${params.toString()}`);
        const data = await res.json();
        
        if (isMounted) {
          setTuitions(data.tuitions);
          setTotalPages(data.totalPages);
          router.push(`/tuitions?${params.toString()}`, { scroll: false });
          setIsLoading(false); 
        }
      } catch (error) {
        console.error(error);
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [search, classLevel, mode, page, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); 
    setPage(1); 
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/10 py-10">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="mb-8 text-3xl font-bold">Browse Tuitions</h1>
          
          {/* Filters */}
          <div className="mb-8 flex flex-col gap-4 rounded-lg border bg-background p-4 md:flex-row md:items-end">
            <form onSubmit={handleSearch} className="flex flex-1 gap-2">
              <Input
                placeholder="Search by title or subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button type="submit">Search</Button>
            </form>
            
            <div className="flex gap-4">
              <Select 
                value={classLevel} 
                onValueChange={(val) => { 
                  if (val) { 
                    setIsLoading(true); // Trigger loading state here
                    setClassLevel(val); 
                    setPage(1); 
                  } 
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Class Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Classes</SelectItem>
                  <SelectItem value="Class 8">Class 8</SelectItem>
                  <SelectItem value="Class 9">Class 9</SelectItem>
                  <SelectItem value="Class 10">Class 10</SelectItem>
                  <SelectItem value="HSC">HSC</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={mode} 
                onValueChange={(val) => { 
                  if (val) { 
                    setIsLoading(true); // Trigger loading state here
                    setMode(val); 
                    setPage(1); 
                  } 
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Modes</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4 rounded-xl border p-4">
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : tuitions.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              No tuitions found matching your criteria.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {tuitions.map((tuition) => (
                <TuitionCard key={tuition._id} tuition={tuition} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => { setIsLoading(true); setPage((p) => Math.max(1, p - 1)); }}
              >
                Previous
              </Button>
              <span className="text-sm font-medium">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => { setIsLoading(true); setPage((p) => Math.min(totalPages, p + 1)); }}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default function BrowseTuitionsPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <BrowseTuitionsContent />
    </Suspense>
  );
}