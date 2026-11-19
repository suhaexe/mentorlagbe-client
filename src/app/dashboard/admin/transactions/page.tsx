"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Payment } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, DollarSign } from "lucide-react";

const AdminTransactionsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const data = await api<Payment[]>("/api/payments/admin/all");
        if (isMounted) setPayments(data);
      } catch (error: unknown) {
        if (isMounted) toast.error("Failed to load transactions");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Transactions</h1>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Transaction ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell>
                      <p className="font-medium">{p.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.userEmail}
                      </p>
                    </TableCell>
                    <TableCell className="capitalize">{p.userRole}</TableCell>
                    <TableCell className="capitalize">{p.planName}</TableCell>
                    <TableCell className="font-bold text-green-600">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" /> {p.amount}{" "}
                        {p.currency}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(p.paidAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell
                      className="text-xs text-muted-foreground max-w-[150px] truncate"
                      title={p.transactionId}
                    >
                      {p.transactionId}
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

export default AdminTransactionsPage;
