"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Tuition } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Trash2, Power } from "lucide-react";

const MyTuitionsPage = () => {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const data = await api<Tuition[]>("/api/tuitions/my-tuitions/list");
        if (isMounted) setTuitions(data);
      } catch (error: unknown) {
        if (isMounted) {
          const message = error instanceof Error ? error.message : "Failed to load tuitions";
          toast.error(message);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tuition?")) return;
    try {
      await api(`/api/tuitions/${id}`, { method: "DELETE" });
      toast.success("Tuition deleted");
      setTuitions(tuitions.filter((t) => t._id !== id));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete tuition";
      toast.error(message);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const updated = await api<Tuition>(`/api/tuitions/${id}/toggle`, { method: "PATCH" });
      setTuitions(tuitions.map((t) => (t._id === id ? updated : t)));
      toast.success(`Tuition ${updated.isActive ? "activated" : "closed"}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to toggle status";
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Tuitions</h1>
        <p className="text-muted-foreground">Manage your posted tuition batches.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Approval</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tuitions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No tuitions found. Go to Post Tuition to create one.
                  </TableCell>
                </TableRow>
              ) : (
                tuitions.map((t) => (
                  <TableRow key={t._id}>
                    <TableCell className="font-medium">{t.title}</TableCell>
                    <TableCell>৳{t.monthlyFee}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={t.approvalStatus === "approved" ? "default" : t.approvalStatus === "pending" ? "secondary" : "destructive"} 
                        className="capitalize"
                      >
                        {t.approvalStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={t.isActive ? "outline" : "secondary"} 
                        className={t.isActive ? "text-green-600 border-green-600" : "text-red-500"}
                      >
                        {t.isActive ? "Active" : "Closed"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleToggle(t._id)} title="Toggle Active/Closed">
                        <Power className={`h-4 w-4 ${t.isActive ? "text-green-600" : "text-muted-foreground"}`} />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(t._id)} title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyTuitionsPage;