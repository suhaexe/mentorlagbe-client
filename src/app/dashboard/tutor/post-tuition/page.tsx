"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
  ArrowRight,
  CheckCircle2,
  ImagePlus,
  Loader2,
} from "lucide-react";

const PostTuitionPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [bannerImage, setBannerImage] = useState("");
  const [mode, setMode] = useState<"Online" | "Offline">("Online");

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
        toast.success("Banner uploaded successfully!");
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Upload failed";
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
      mode,
      location: formData.get("location"),
      monthlyFee: Number(formData.get("monthlyFee")),
      daysPerWeek: Number(formData.get("daysPerWeek")),
      description: formData.get("description"),
      bannerImage,
    };

    try {
      await api("/api/tuitions", { method: "POST", body: tuitionData });
      toast.success("Tuition posted! Waiting for admin approval.");
      router.push("/dashboard/tutor/my-tuitions");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to post tuition";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div className="border-b border-[#806B88]/15 pb-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#C08BFF]">
          New Listing
        </p>
        <h1 className="mt-1.5 font-sans text-3xl font-medium tracking-[-0.03em] text-[#F5F1F8] sm:text-4xl">
          Post a{" "}
          <span className="font-heading font-normal italic text-[#C08BFF]">
            tuition batch.
          </span>
        </h1>
        <p className="mt-1.5 font-sans text-xs text-[#A69BAF] sm:text-sm">
          Fill out the batch details below. Listings go live once approved by an admin.
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-3xl border border-[#806B88]/20 bg-[#15131B]/90 p-5 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#C4C0CC]">
              Banner Image (ImgBB)
            </span>

            <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#806B88]/35 bg-[#101014]/90 p-5 text-center transition-colors hover:border-[#C08BFF]/60 sm:flex-row sm:justify-start sm:text-left">
              {bannerImage ? (
                <img
                  src={bannerImage}
                  alt="Banner preview"
                  className="h-20 w-36 shrink-0 rounded-xl border border-[#806B88]/25 object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#806B88]/25 bg-[#15131B] text-[#C08BFF]">
                  {isUploading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <ImagePlus className="h-5 w-5" />
                  )}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="font-sans text-sm font-medium text-[#F5F1F8]">
                  {isUploading
                    ? "Uploading banner to ImgBB..."
                    : bannerImage
                      ? "Banner uploaded — click to replace"
                      : "Click to upload a batch cover image"}
                </p>
                <p className="mt-0.5 font-sans text-xs text-[#806B88]">
                  PNG, JPG, or WEBP up to 5MB
                </p>
                {bannerImage && !isUploading && (
                  <span className="mt-1.5 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                    <CheckCircle2 size={11} /> Ready
                  </span>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="sr-only"
              />
            </label>
          </div>

          {/* Title & Subject */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="title"
                className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#C4C0CC]"
              >
                Batch Title
              </label>
              <input
                id="title"
                name="title"
                placeholder="e.g., HSC Physics Crash Course"
                required
                className="h-11 w-full rounded-xl border border-[#806B88]/25 bg-[#101014] px-4 font-sans text-sm text-[#F5F1F8] placeholder:text-[#806B88] outline-none transition-colors focus:border-[#C08BFF]"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="subject"
                className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#C4C0CC]"
              >
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                placeholder="e.g., Physics"
                required
                className="h-11 w-full rounded-xl border border-[#806B88]/25 bg-[#101014] px-4 font-sans text-sm text-[#F5F1F8] placeholder:text-[#806B88] outline-none transition-colors focus:border-[#C08BFF]"
              />
            </div>
          </div>

          {/* Class Level, Mode & Location */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label
                htmlFor="classLevel"
                className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#C4C0CC]"
              >
                Class Level
              </label>
              <input
                id="classLevel"
                name="classLevel"
                placeholder="e.g., HSC / Class 12"
                required
                className="h-11 w-full rounded-xl border border-[#806B88]/25 bg-[#101014] px-4 font-sans text-sm text-[#F5F1F8] placeholder:text-[#806B88] outline-none transition-colors focus:border-[#C08BFF]"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="mode"
                className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#C4C0CC]"
              >
                Mode
              </label>
              <select
                id="mode"
                name="mode"
                value={mode}
                onChange={(e) =>
                  setMode(e.target.value as "Online" | "Offline")
                }
                className="h-11 w-full rounded-xl border border-[#806B88]/25 bg-[#101014] px-3.5 font-sans text-sm text-[#F5F1F8] outline-none transition-colors focus:border-[#C08BFF]"
              >
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="location"
                className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#C4C0CC]"
              >
                Location
              </label>
              <input
                id="location"
                name="location"
                placeholder={
                  mode === "Online" ? "Zoom / Google Meet" : "Dhanmondi, Dhaka"
                }
                className="h-11 w-full rounded-xl border border-[#806B88]/25 bg-[#101014] px-4 font-sans text-sm text-[#F5F1F8] placeholder:text-[#806B88] outline-none transition-colors focus:border-[#C08BFF]"
              />
            </div>
          </div>

          {/* Monthly Fee & Days/Week */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="monthlyFee"
                className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#C4C0CC]"
              >
                Monthly Fee (৳)
              </label>
              <input
                id="monthlyFee"
                name="monthlyFee"
                type="number"
                min="0"
                placeholder="e.g., 4500"
                required
                className="h-11 w-full rounded-xl border border-[#806B88]/25 bg-[#101014] px-4 font-sans text-sm text-[#F5F1F8] placeholder:text-[#806B88] outline-none transition-colors focus:border-[#C08BFF]"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="daysPerWeek"
                className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#C4C0CC]"
              >
                Days per Week
              </label>
              <input
                id="daysPerWeek"
                name="daysPerWeek"
                type="number"
                min="1"
                max="7"
                placeholder="e.g., 3"
                required
                className="h-11 w-full rounded-xl border border-[#806B88]/25 bg-[#101014] px-4 font-sans text-sm text-[#F5F1F8] placeholder:text-[#806B88] outline-none transition-colors focus:border-[#C08BFF]"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label
              htmlFor="description"
              className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#C4C0CC]"
            >
              Description & Syllabus Outline
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe your teaching methodology, batch size, and exam preparation plan..."
              required
              className="min-h-[130px] w-full rounded-2xl border border-[#806B88]/25 bg-[#101014] p-4 font-sans text-sm text-[#F5F1F8] placeholder:text-[#806B88] outline-none transition-colors focus:border-[#C08BFF]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || isUploading}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#A45DEB] px-6 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[#101014] shadow-[0_0_24px_rgba(164,93,235,0.3)] transition-colors hover:bg-[#C08BFF] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Submitting..." : "Submit Tuition for Approval"}
            {!isLoading && <ArrowRight size={15} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostTuitionPage;