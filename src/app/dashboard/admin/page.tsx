"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CheckCircle, DollarSign } from "lucide-react";

const AdminOverview = () => {
  const stats = [
    { title: "Total Users", value: "48", icon: Users, color: "text-blue-500" },
    { title: "Total Tutors", value: "15", icon: CheckCircle, color: "text-green-500" },
    { title: "Pending Tuitions", value: "7", icon: FileText, color: "text-amber-500" },
    { title: "Total Revenue", value: "$250", icon: DollarSign, color: "text-emerald-500" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminOverview;