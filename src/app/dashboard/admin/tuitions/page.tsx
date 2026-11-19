"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Tuition } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Check, X } from "lucide-react";

const AdminTuitionsPage = () => {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const data = await api<Tuition[]>("/api/tuitions/admin/all");
        if (isMounted) setTuitions(data);
      } catch (error: unknown) {
        if (isMounted) toast.error("Failed to load tuitions");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      const updated = await api<Tuition>(`/api/tuitions/${id}/status`, {
        method: "PATCH",
        body: { status },
      });
      setTuitions(tuitions.map((t) => (t._id === id ? updated : t)));
      toast.success(`Tuition ${status}`);
    } catch (error: unknown) {
      toast.error("Failed to update status");
    }
  };

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tuition Approvals</h1>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tuition</TableHead>
                <TableHead>Tutor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tuitions.map((t) => (
                <TableRow key={t._id}>
                  <TableCell>
                    <p className="font-medium">{t.title}</p>
                    <p className="text-xs text-muted-foreground">{t.subject} • {t.classLevel}</p>
                  </TableCell>
                  <TableCell>{t.tutorEmail}</TableCell>
                  <TableCell>
                    <Badge variant={t.approvalStatus === "approved" ? "default" : t.approvalStatus === "pending" ? "secondary" : "destructive"} className="capitalize">
                      {t.approvalStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {t.approvalStatus === "pending" && (
                      <>
                        <Button variant="outline" size="sm" className="text-green-600 border-green-600" onClick={() => updateStatus(t._id, "approved")}>
                          <Check className="mr-1 h-4 w-4" /> Approve
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-600" onClick={() => updateStatus(t._id, "rejected")}>
                          <X className="mr-1 h-4 w-4" /> Reject
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTuitionsPage;