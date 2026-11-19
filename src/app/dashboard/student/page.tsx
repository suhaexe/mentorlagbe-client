"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, Clock, Star } from "lucide-react";
import { useSession } from "@/lib/auth-client";

const StudentOverview = () => {
  const { data: session } = useSession();
  const user = session?.user as { plan?: string };

  // In a real app, fetch these from the DB. We'll use static for the UI now.
  const stats = [
    { title: "Total Applied", value: "3", icon: FileText, color: "text-blue-500" },
    { title: "Accepted", value: "1", icon: CheckCircle, color: "text-green-500" },
    { title: "Pending", value: "2", icon: Clock, color: "text-amber-500" },
    { title: "Current Plan", value: user?.plan === "pro" ? "Pro" : "Free", icon: Star, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Student Dashboard</h1>
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

export default StudentOverview;