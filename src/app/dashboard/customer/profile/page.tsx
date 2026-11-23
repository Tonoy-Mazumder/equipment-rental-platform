
"use client";

import { useEffect, useState } from "react";
import { Loading } from "@/components/loading";
import {
  User,
  Mail,
  ShieldCheck,
  BadgeCheck,
  Pencil,
  Save,
  X,
  Phone,
  MapPin,
  Camera,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

export default function CustomerProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setImage(user.image || "");
      setPhone(user.phone || "");
      setLocation(user.location || "");
    }
  }, [user]);

  function handleEdit() {
    setIsEditing(true);
  }

  function handleCancel() {
    setName(user?.name || "");
    setImage(user?.image || "");
    setPhone(user?.phone || "");
    setLocation(user?.location || "");
    setIsEditing(false);
  }

  async function handleSave() {
    if (!name.trim()) {
      toast.add({
        title: "Name required",
        description: "Please enter your name.",
        type: "error",
      });
      return;
    }

    try {
      setIsSaving(true);

      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || null,
        phone: phone.trim(),
        location: location.trim(),
      });

      if (error) {
        throw new Error(error.message || "Could not update your profile.");
      }

      setIsEditing(false);

      toast.add({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
        type: "success",
      });
    } catch (error) {
      toast.add({
        title: "Update failed",
        description:
          error instanceof Error
            ? error.message
            : "Could not update your profile.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  }

  if (isPending) {
    return <Loading className="min-h-[60vh]" label="Loading profile..." />;
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">
          Please login to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Page Heading */}
      <div>
        <p className="text-sm font-semibold text-brand">
          CUSTOMER ACCOUNT
        </p>

        <h1 className="mt-2 text-3xl font-bold">My Profile</h1>

        <p className="mt-2 text-muted-foreground">
          Manage your personal information and account details.
        </p>
      </div>

      {/* Profile Header */}
      <div className="rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8">
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <div className="flex size-24 items-center justify-center overflow-hidden rounded-full bg-brand text-3xl font-bold text-white">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "Customer"}
                className="size-full object-cover"
              />
            ) : (
              user.name?.charAt(0).toUpperCase() || "C"
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold">
              {user.name || "Customer"}
            </h2>

            <p className="mt-1 text-sm text-primary-foreground/70">
              {user.email}
            </p>

            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand/20 px-3 py-1 text-sm text-brand">
              <ShieldCheck size={16} />
              Customer
            </div>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={handleEdit}
              className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Pencil size={16} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-brand/10 p-2 text-brand">
            <User size={20} />
          </div>

          <div>
            <h3 className="text-lg font-bold">
              Personal Information
            </h3>

            <p className="text-sm text-muted-foreground">
              Your personal account information
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>

            <div className="relative">
              <User className="absolute top-3 left-3 size-4 text-muted-foreground" />

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                placeholder="Enter your name"
                className="w-full rounded-lg border border-border bg-background py-2.5 pr-3 pl-10 text-sm outline-none focus:border-brand disabled:opacity-70"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute top-3 left-3 size-4 text-muted-foreground" />

              <input
                value={user.email || ""}
                disabled
                className="w-full rounded-lg border border-border bg-muted py-2.5 pr-3 pl-10 text-sm opacity-70"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Phone Number
            </label>

            <div className="relative">
              <Phone className="absolute top-3 left-3 size-4 text-muted-foreground" />

              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!isEditing}
                placeholder="Enter phone number"
                className="w-full rounded-lg border border-border bg-background py-2.5 pr-3 pl-10 text-sm outline-none focus:border-brand disabled:opacity-70"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Location
            </label>

            <div className="relative">
              <MapPin className="absolute top-3 left-3 size-4 text-muted-foreground" />

              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={!isEditing}
                placeholder="Enter your location"
                className="w-full rounded-lg border border-border bg-background py-2.5 pr-3 pl-10 text-sm outline-none focus:border-brand disabled:opacity-70"
              />
            </div>
          </div>

          {/* Image URL */}
          {isEditing && (
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Profile Image URL
              </label>

              <div className="relative">
                <Camera className="absolute top-3 left-3 size-4 text-muted-foreground" />

                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/profile.jpg"
                  className="w-full rounded-lg border border-border bg-background py-2.5 pr-3 pl-10 text-sm outline-none focus:border-brand"
                />
              </div>
            </div>
          )}
        </div>

        {/* Edit Actions */}
        {isEditing && (
          <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-border pt-6">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
            >
              <X size={16} />
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              <Save size={16} />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {/* Account Status */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h3 className="mb-5 text-lg font-bold">
          Customer Account
        </h3>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-brand/10 p-2 text-brand">
              <BadgeCheck size={20} />
            </div>

            <div>
              <p className="font-semibold">Account Status</p>
              <p className="text-sm text-muted-foreground">
                Your account is active
              </p>
            </div>
          </div>

          <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-400">
            Active
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-brand" size={20} />
            <span className="font-medium">Account Role</span>
          </div>

          <span className="text-sm font-semibold capitalize">
            {user.role || "Customer"}
          </span>
        </div>
      </div>
    </div>
  );
}
