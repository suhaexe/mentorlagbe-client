"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tuition } from "@/types";

export const ApplyButton = ({ tuition }: { tuition: Tuition }) => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userRole = session?.user?.role;

  if (!session) {
    return (
      <Button className="w-full mt-6" size="lg" onClick={() => toast.error("Please login to apply")}>
        Login to Apply
      </Button>
    );
  }

  if (userRole !== "student") {
    return (
      <div className="mt-6">
        <Button className="w-full" size="lg" disabled>
          Apply Now
        </Button>
        <p className="text-xs text-center text-destructive mt-2">
          Only students can apply for tuitions.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    const data = {
      tuitionId: tuition._id,
      tuitionTitle: tuition.title,
      subject: tuition.subject,
      monthlyFee: tuition.monthlyFee,
      tutorEmail: tuition.tutorEmail,
      studentPhone: formData.get("phone"),
      preferredSchedule: formData.get("schedule"),
      studentNote: formData.get("note"),
    };

    try {
      await api("/api/applications", { method: "POST", body: data });
      toast.success("Application submitted successfully!");
      setIsOpen(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to apply";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button className="w-full mt-6" size="lg" onClick={() => setIsOpen(true)}>
        Apply Now
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for {tuition.subject}</DialogTitle>
            <DialogDescription>
              Submit your details. The tutor will review your application.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input name="phone" placeholder="017XXXXXXXX" required />
            </div>
            <div className="space-y-2">
              <Label>Preferred Schedule</Label>
              <Input name="schedule" placeholder="e.g., Sat, Mon, Wed (5 PM - 7 PM)" required />
            </div>
            <div className="space-y-2">
              <Label>Note to Tutor (Optional)</Label>
              <Textarea name="note" placeholder="Why do you want to join?" />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};