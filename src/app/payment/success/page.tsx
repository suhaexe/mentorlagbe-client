"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { api } from "@/lib/api";

const PaymentSuccessContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verify = async () => {
      const sessionId = searchParams.get("session_id");
      if (!sessionId) {
        toast.error("Invalid session");
        return router.push("/pricing");
      }

      try {
        await api(`/api/payments/verify?session_id=${sessionId}`);
        toast.success("Payment successful! Your account is now Pro.");
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Verification failed";
        toast.error(message);
      } finally {
        setIsVerifying(false);
      }
    };
    verify();
  }, [searchParams, router]);

  return (
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <span className="text-3xl text-green-600">✓</span>
        </div>
        <CardTitle className="text-2xl">Payment Successful</CardTitle>
        <CardDescription>
          {isVerifying ? "Verifying your transaction..." : "Thank you for upgrading to Pro!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full" onClick={() => router.push("/dashboard/profile")} disabled={isVerifying}>
          Go to Dashboard
        </Button>
      </CardContent>
    </Card>
  );
};

const PaymentSuccessPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center p-4">
        <Suspense fallback={<div>Loading...</div>}>
          <PaymentSuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;