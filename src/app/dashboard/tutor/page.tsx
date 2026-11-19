"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, Users, Star } from "lucide-react";
import { useSession } from "@/lib/auth-client";

const TutorOverview = () => {
  const { data: session } = useSession();
  const user = session?.user as { plan?: string };

  const stats = [
    { title: "Total Tuitions", value: "5", icon: FileText, color: "text-blue-500" },
    { title: "Active Tuitions", value: "4", icon: CheckCircle, color: "text-green-500" },
    { title: "Total Applicants", value: "12", icon: Users, color: "text-amber-500" },
    { title: "Current Plan", value: user?.plan === "pro" ? "Pro" : "Free", icon: Star, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tutor Dashboard</h1>
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

export default TutorOverview;