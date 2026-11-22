"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfilePage = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const user = session?.user as
    | {
        name?: string;
        phone?: string;
        bio?: string;
        image?: string;
        email?: string;
      }
    | undefined;

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

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
      window.location.reload();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6 text-[#F5F1F8]">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-[#F5F1F8]">
          Update Profile
        </h1>
        {user.email ? (
          <p className="mt-1 font-mono text-xs text-[#A69BAF]">{user.email}</p>
        ) : null}
      </div>

      <Card className="rounded-3xl border-[#806B88]/30 bg-[#15131B] text-[#F5F1F8] shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        <CardHeader className="border-b border-[#806B88]/20 pb-5">
          <CardTitle className="font-heading text-xl font-semibold text-[#F5F1F8]">
            Personal Information
          </CardTitle>
          <CardDescription className="text-[#A69BAF]">
            Update your photo and personal details here.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Avatar className="h-20 w-20 shrink-0 rounded-full border border-[#C08BFF]/35">
                <AvatarImage src={user.image || undefined} />
                <AvatarFallback className="rounded-full bg-[#A45DEB]/20 font-sans text-2xl font-semibold text-[#C08BFF]">
                  {user.name?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <Label htmlFor="profile-image" className="text-[#E2DCE8]">
                  Profile Picture URL
                </Label>
                <Input
                  id="profile-image"
                  name="image"
                  placeholder="https://example.com/photo.jpg"
                  defaultValue={user.image || ""}
                  className="border-[#806B88]/30 bg-[#101014]/80 text-[#F5F1F8] placeholder:text-[#806B88] focus-visible:border-[#C08BFF] focus-visible:ring-[#C08BFF]/30"
                />
                <p className="text-xs text-[#A69BAF]">
                  Paste a URL or implement ImgBB upload.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profile-name" className="text-[#E2DCE8]">
                  Full Name
                </Label>
                <Input
                  id="profile-name"
                  name="name"
                  defaultValue={user.name || ""}
                  required
                  className="border-[#806B88]/30 bg-[#101014]/80 text-[#F5F1F8] placeholder:text-[#806B88] focus-visible:border-[#C08BFF] focus-visible:ring-[#C08BFF]/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-phone" className="text-[#E2DCE8]">
                  Phone Number
                </Label>
                <Input
                  id="profile-phone"
                  name="phone"
                  defaultValue={user.phone || ""}
                  className="border-[#806B88]/30 bg-[#101014]/80 text-[#F5F1F8] placeholder:text-[#806B88] focus-visible:border-[#C08BFF] focus-visible:ring-[#C08BFF]/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-bio" className="text-[#E2DCE8]">
                Bio
              </Label>
              <Textarea
                id="profile-bio"
                name="bio"
                placeholder="Tell us about yourself..."
                defaultValue={user.bio || ""}
                className="min-h-28 border-[#806B88]/30 bg-[#101014]/80 text-[#F5F1F8] placeholder:text-[#806B88] focus-visible:border-[#C08BFF] focus-visible:ring-[#C08BFF]/30"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-full bg-[#A45DEB] px-6 font-sans text-sm font-semibold text-[#101014] shadow-[0_0_20px_rgba(164,93,235,0.3)] transition-colors hover:bg-[#C08BFF] disabled:opacity-60"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
