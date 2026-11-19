"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

const PricingPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async (planType: "tutor" | "student") => {
    if (!session?.user) {
      toast.error("Please sign in first");
      return router.push("/sign-in");
    }

    const role = session.user.role as string;
    if (role !== planType) {
      return toast.error(`You are logged in as a ${role}, not a ${planType}`);
    }

    setIsLoading(true);
    try {
      const data = await api<{ url: string }>("/api/payments/checkout", {
        method: "POST",
        body: { planType },
      });
      window.location.href = data.url; // Redirect to Stripe
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to start checkout";
      toast.error(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/10 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Upgrade to Pro</h1>
            <p className="text-lg text-muted-foreground">Unlock premium features to get the most out of MentorLagbe.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Tutor Plan */}
            <Card className="flex flex-col border-primary/50 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 w-full h-1 bg-primary" />
              <CardHeader>
                <CardTitle className="text-2xl flex items-center justify-between">
                  Tutor Pro <Badge>Popular</Badge>
                </CardTitle>
                <CardDescription>For educators who want to scale.</CardDescription>
                <div className="mt-4 flex items-baseline text-4xl font-extrabold">
                  $15<span className="ml-1 text-xl font-medium text-muted-foreground">/ one-time</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">✓ Unlimited tuition posts</li>
                  <li className="flex items-center">✓ Verified Pro Badge</li>
                  <li className="flex items-center">✓ Priority applicant visibility</li>
                  <li className="flex items-center">✓ Advanced analytics</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleUpgrade("tutor")} disabled={isLoading}>
                  {isLoading ? "Redirecting..." : "Upgrade Tutor Account"}
                </Button>
              </CardFooter>
            </Card>

            {/* Student Plan */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl">Student Pro</CardTitle>
                <CardDescription>For students who want an edge.</CardDescription>
                <div className="mt-4 flex items-baseline text-4xl font-extrabold">
                  $10<span className="ml-1 text-xl font-medium text-muted-foreground">/ one-time</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">✓ Priority booking for tuitions</li>
                  <li className="flex items-center">✓ Premium student support</li>
                  <li className="flex items-center">✓ Profile highlight to tutors</li>
                  <li className="flex items-center">✓ Unlimited applications</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => handleUpgrade("student")} disabled={isLoading}>
                  {isLoading ? "Redirecting..." : "Upgrade Student Account"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;