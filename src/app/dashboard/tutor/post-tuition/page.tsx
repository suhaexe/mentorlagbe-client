"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PostTuitionPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [bannerImage, setBannerImage] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Image must be less than 5MB");
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const data = await api<{ url: string }>("/api/upload/imgbb", {
          method: "POST",
          body: { image: base64 },
        });
        setBannerImage(data.url);
        toast.success("Image uploaded successfully!");
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Upload failed";
        toast.error(message);
      } finally {
        setIsUploading(false);
      }
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!bannerImage) return toast.error("Please upload a banner image first");

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const tuitionData = {
      title: formData.get("title"),
      subject: formData.get("subject"),
      classLevel: formData.get("classLevel"),
      mode: formData.get("mode"),
      location: formData.get("location"),
      monthlyFee: Number(formData.get("monthlyFee")),
      daysPerWeek: Number(formData.get("daysPerWeek")),
      description: formData.get("description"),
      bannerImage: bannerImage,
    };

    try {
      await api("/api/tuitions", { method: "POST", body: tuitionData });
      toast.success("Tuition posted! Waiting for admin approval.");
      router.push("/dashboard/tutor/my-tuitions");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to post tuition";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Post a New Tuition</h1>
        <p className="text-muted-foreground">Fill out the details below to create a new tuition batch.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Banner Image</Label>
              <div className="flex items-center gap-4">
                {bannerImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={bannerImage} alt="Banner" className="h-20 w-32 rounded-md object-cover" />
                )}
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  disabled={isUploading} 
                />
              </div>
              {isUploading && <p className="text-sm text-primary">Uploading to ImgBB...</p>}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input name="title" placeholder="e.g., HSC Physics Crash Course" required />
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input name="subject" placeholder="e.g., Physics" required />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Class Level</Label>
                <Input name="classLevel" placeholder="e.g., HSC" required />
              </div>
              <div className="space-y-2">
                <Label>Mode</Label>
                <Select name="mode" required defaultValue="Online">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Location (If Offline)</Label>
                <Input name="location" placeholder="e.g., Dhanmondi, Dhaka" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Monthly Fee (৳)</Label>
                <Input name="monthlyFee" type="number" min="0" required />
              </div>
              <div className="space-y-2">
                <Label>Days per Week</Label>
                <Input name="daysPerWeek" type="number" min="1" max="7" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea name="description" placeholder="Describe your teaching methodology..." className="min-h-[120px]" required />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || isUploading}>
              {isLoading ? "Posting..." : "Submit Tuition for Approval"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostTuitionPage;