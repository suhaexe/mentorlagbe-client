"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Application } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Check, X } from "lucide-react";

const ApplicantsPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const data = await api<Application[]>("/api/applications/tutor");
        if (isMounted) setApplications(data);
      } catch (error: unknown) {
        if (isMounted) {
          const message =
            error instanceof Error
              ? error.message
              : "Failed to load applicants";
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

  const updateStatus = async (id: string, status: "accepted" | "rejected") => {
    try {
      const updated = await api<Application>(`/api/applications/${id}/status`, {
        method: "PATCH",
        body: { status },
      });
      setApplications(applications.map((a) => (a._id === id ? updated : a)));
      toast.success(`Application ${status}`);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update status";
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
        <h1 className="text-3xl font-bold">Manage Applicants</h1>
        <p className="text-muted-foreground">
          Review students who applied to your tuitions.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Info</TableHead>
                <TableHead>Tuition</TableHead>
                <TableHead>Schedule / Note</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No applicants yet.
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((a) => (
                  <TableRow key={a._id}>
                    <TableCell>
                      <p className="font-medium">{a.studentName}</p>
                      <p className="text-xs text-muted-foreground">
                        {a.studentEmail}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {a.studentPhone}
                      </p>
                    </TableCell>
                    <TableCell className="font-medium">
                      {a.tuitionTitle}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        <span className="font-semibold text-foreground">
                          Time:
                        </span>{" "}
                        {a.preferredSchedule}
                      </p>
                      <p
                        className="text-sm text-muted-foreground truncate max-w-[200px]"
                        title={a.studentNote}
                      >
                        {a.studentNote || "No note"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          a.status === "accepted"
                            ? "default"
                            : a.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                        className="capitalize"
                      >
                        {a.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {a.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => updateStatus(a._id, "accepted")}
                          >
                            <Check className="mr-1 h-4 w-4" /> Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => updateStatus(a._id, "rejected")}
                          >
                            <X className="mr-1 h-4 w-4" /> Reject
                          </Button>
                        </>
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

export default ApplicantsPage;
