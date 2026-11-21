
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
    User,
    Mail,
    ShieldCheck,
    CircleUserRound,
    BadgeCheck,
    Pencil,
    Save,
    X,
    Phone,
    MapPin,
    Camera,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

export default function OwnerProfilePage() {
    const { data: session, isPending } = authClient.useSession();

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");

    if (isPending) {
        return <div className="p-6">Loading profile...</div>;
    }

    if (!session?.user) {
        return <div className="p-6">Please login to continue.</div>;
    }

    const user = session.user;

    function handleEdit() {
        setName(user.name || "");
        setImage(user.image || "");
        setPhone(user.phone || "");
        setLocation(user.location || "");
        setIsEditing(true);
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

        setIsSaving(true);

        try {
            const { error } = await authClient.updateUser({
                name: name.trim(),
                image: image.trim() || null,
                phone: phone.trim(),
                location: location.trim(),
            });

            if (error) {
                throw new Error(error.message);
            }

            toast.add({
                title: "Profile updated",
                description: "Your profile has been updated successfully.",
                type: "success",
            });

            setIsEditing(false);
        } catch (error) {
            toast.add({
                title: "Update failed",
                description:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong.",
                type: "error",
            });
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="mx-auto max-w-5xl space-y-8">
            <div>
                <p className="text-sm font-semibold text-brand">
                    ACCOUNT SETTINGS
                </p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight">
                    My Profile
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Manage your personal information and account details.
                </p>
            </div>

            {/* Profile Header */}
            <div className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8">
                <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-brand/20 blur-2xl" />
                <div className="absolute -bottom-24 right-32 h-48 w-48 rounded-full bg-brand/10 blur-2xl" />

                <div className="relative flex flex-col items-center gap-5 sm:flex-row">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-brand bg-background text-foreground">
                        {user.image ? (
                            <img
                                src={user.image}
                                alt={user.name || "Owner"}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <CircleUserRound size={48} />
                        )}
                    </div>

                    <div className="text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                            <h2 className="text-2xl font-bold">
                                {user.name || "Owner"}
                            </h2>
                            <BadgeCheck className="text-brand" size={21} />
                        </div>

                        <p className="mt-1 text-sm text-primary-foreground/70">
                            {user.email}
                        </p>

                        <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/15 px-3 py-1 text-xs font-semibold text-brand">
                            <ShieldCheck size={14} />
                            Equipment Owner
                        </span>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                <div className="rounded-2xl border bg-card p-6 sm:p-8">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-bold">
                                Personal Information
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Your RentPro account details.
                            </p>
                        </div>

                        {!isEditing && (
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                            >
                                <Pencil size={16} />
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Full Name
                                </label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:border-brand"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Profile Image URL
                                </label>
                                <div className="relative">
                                    <Camera
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    />
                                    <input
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        className="w-full rounded-lg border bg-background py-3 pl-10 pr-4 outline-none focus:border-brand"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    />
                                    <input
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full rounded-lg border bg-background py-3 pl-10 pr-4 outline-none focus:border-brand"
                                        placeholder="Enter phone number"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Location
                                </label>
                                <div className="relative">
                                    <MapPin
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    />
                                    <input
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full rounded-lg border bg-background py-3 pl-10 pr-4 outline-none focus:border-brand"
                                        placeholder="Enter your location"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                                >
                                    <Save size={17} />
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>

                                <button
                                    onClick={() => setIsEditing(false)}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
                                >
                                    <X size={17} />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <InfoItem
                                icon={<User size={21} />}
                                label="Full Name"
                                value={user.name || "Not provided"}
                            />

                            <InfoItem
                                icon={<Mail size={21} />}
                                label="Email Address"
                                value={user.email}
                            />

                            <InfoItem
                                icon={<Phone size={21} />}
                                label="Phone Number"
                                value={user.phone || "Not provided"}
                            />

                            <InfoItem
                                icon={<MapPin size={21} />}
                                label="Location"
                                value={user.location || "Not provided"}
                            />

                            <InfoItem
                                icon={<ShieldCheck size={21} />}
                                label="Account Role"
                                value={user.role || "Owner"}
                            />
                        </div>
                    )}
                </div>

                {/* Account Status */}
                <div className="h-fit rounded-2xl border bg-card p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                        <BadgeCheck size={25} />
                    </div>

                    <h3 className="text-lg font-bold">Owner Account</h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        You are registered as an equipment owner on RentPro.
                        You can manage your equipment and rental requests from
                        your dashboard.
                    </p>

                    <div className="mt-5 flex items-center gap-2 border-t pt-4 text-sm font-medium">
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                        Account Active
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoItem({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-4 rounded-xl border p-4">
            <div className="rounded-xl bg-brand/10 p-3 text-brand">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                    {label}
                </p>
                <p className="mt-1 break-all font-semibold">{value}</p>
            </div>
        </div>
    );
}
