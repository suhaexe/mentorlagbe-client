"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Application } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Trash2 } from "lucide-react";

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const data = await api<Application[]>("/api/applications/student");
        if (isMounted) setApplications(data);
      } catch (error: unknown) {
        if (isMounted) {
          const message = error instanceof Error ? error.message : "Failed to load applications";
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

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this application?")) return;
    try {
      await api(`/api/applications/${id}`, { method: "DELETE" });
      toast.success("Application cancelled");
      setApplications(applications.filter((a) => a._id !== id));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to cancel application";
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
        <h1 className="text-3xl font-bold">My Applications</h1>
        <p className="text-muted-foreground">Track the status of your tuition applications.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tuition Title</TableHead>
                <TableHead>Tutor</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Applied On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    You haven&apos;t applied to any tuitions yet.
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((a) => (
                  <TableRow key={a._id}>
                    <TableCell className="font-medium">{a.tuitionTitle}</TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">{a.tutorEmail}</p>
                    </TableCell>
                    <TableCell>৳{a.monthlyFee}</TableCell>
                    <TableCell>{new Date(a.appliedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={a.status === "accepted" ? "default" : a.status === "rejected" ? "destructive" : "secondary"} 
                        className="capitalize"
                      >
                        {a.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {a.status === "pending" && (
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleCancel(a._id)}>
                          <Trash2 className="mr-1 h-4 w-4" /> Cancel
                        </Button>
                      )}
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

export default MyApplicationsPage;