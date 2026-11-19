"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfilePage = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  
  const user = session?.user as { name?: string; phone?: string; bio?: string; image?: string; email?: string } | undefined;

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Grab data directly from the form without useEffect state
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      bio: formData.get("bio") as string,
      image: formData.get("image") as string,
    };

    try {
      await api("/api/users/profile", { method: "PUT", body: data });
      toast.success("Profile updated successfully!");
      // Note: In a real app, you'd trigger a session refresh here.
      // For now, we just reload the page to see the new data.
      window.location.reload(); 
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Update Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your photo and personal details here.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.image} />
                <AvatarFallback className="text-2xl">{user.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="space-y-2 flex-1">
                <Label>Profile Picture URL</Label>
                <Input 
                  name="image"
                  placeholder="https://example.com/photo.jpg" 
                  defaultValue={user.image || ""} 
                />
                <p className="text-xs text-muted-foreground">Paste a URL or implement ImgBB upload.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input name="name" defaultValue={user.name || ""} required />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input name="phone" defaultValue={user.phone || ""} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea 
                name="bio"
                placeholder="Tell us about yourself..." 
                defaultValue={user.bio || ""} 
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;