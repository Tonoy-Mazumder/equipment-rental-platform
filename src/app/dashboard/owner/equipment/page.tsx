
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, MapPin, Package, Pencil, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
    getOwnerEquipment,
    updateEquipment,
    type Equipment,
} from "@/lib/api/equipment";
import { toast } from "@/components/ui/toast";

export default function Page() {
    const { data: session, isPending } = authClient.useSession();
    const ownerId = session?.user?.id;

    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingItem, setEditingItem] = useState<Equipment | null>(null);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        name: "",
        category: "",
        description: "",
        pricePerDay: "",
        location: "",
        images: "",
    });

    useEffect(() => {
        async function fetchEquipment(id: string) {
            try {
                setLoading(true);
                setError("");

                const data = await getOwnerEquipment(id);
                setEquipment(data);
            } catch {
                setError("Failed to load your equipment.");
            } finally {
                setLoading(false);
            }
        }

        if (!isPending) {
            if (ownerId) {
                fetchEquipment(ownerId);
            } else {
                setLoading(false);
            }
        }
    }, [ownerId, isPending]);

    function handleEdit(item: Equipment) {
        setEditingItem(item);

        setForm({
            name: item.name,
            category: item.category,
            description: item.description,
            pricePerDay: String(item.pricePerDay),
            location: item.location,
            images: item.images?.join(", ") || "",
        });
    }

    async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!editingItem || !ownerId) return;

        try {
            setSaving(true);

            const updatedData = {
                ownerId,
                name: form.name,
                category: form.category,
                description: form.description,
                pricePerDay: Number(form.pricePerDay),
                location: form.location,
                images: form.images
                    .split(",")
                    .map((image) => image.trim())
                    .filter(Boolean),
            };

            await updateEquipment(editingItem._id, updatedData);

            setEquipment((previous) =>
                previous.map((item) =>
                    item._id === editingItem._id
                        ? { ...item, ...updatedData }
                        : item
                )
            );

            setEditingItem(null);

            toast.add({
                title: "Success",
                description: "Equipment updated successfully.",
                type: "success",
            });
        } catch (error) {
            toast.add({
                title: "Error",
                description:
                    error instanceof Error
                        ? error.message
                        : "Failed to update equipment.",
                type: "error",
            });
        } finally {
            setSaving(false);
        }
    }

    if (isPending || loading) {
        return <div className="p-6">Loading equipment...</div>;
    }

    if (!session?.user?.id) {
        return <div className="p-6">Please login to continue.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold">My Equipment</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage all your listed equipment.
                    </p>
                </div>

                <Link
                    href="/dashboard/owner/equipment/add"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-primary-foreground"
                >
                    <Plus size={18} />
                    Add Equipment
                </Link>
            </div>

            {error && (
                <p className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </p>
            )}

            {equipment.length === 0 && !error && (
                <div className="rounded-xl border border-dashed p-10 text-center">
                    <Package className="mx-auto mb-3 text-muted-foreground" size={36} />
                    <h2 className="font-semibold">No equipment found</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Start by adding your first equipment.
                    </p>
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {equipment.map((item) => (
                    <div key={item._id} className="rounded-xl border bg-card p-5">
                        <div className="mb-4 flex h-36 items-center justify-center rounded-lg bg-muted">
                            {item.images?.[0] ? (
                                <img
                                    src={item.images[0]}
                                    alt={item.name}
                                    className="h-full w-full rounded-lg object-cover"
                                />
                            ) : (
                                <Package size={40} className="text-muted-foreground" />
                            )}
                        </div>

                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h2 className="font-semibold">{item.name}</h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {item.category}
                                </p>
                            </div>

                            <span className="rounded-full bg-muted px-3 py-1 text-xs capitalize">
                                {item.status}
                            </span>
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin size={16} />
                            {item.location}
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t pt-4">
                            <p className="font-bold">
                                ${item.pricePerDay}
                                <span className="font-normal text-muted-foreground"> / day</span>
                            </p>

                            <button
                                onClick={() => handleEdit(item)}
                                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted"
                            >
                                <Pencil size={15} />
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
                    <form
                        onSubmit={handleUpdate}
                        className="my-auto w-full max-w-lg space-y-4 rounded-xl border bg-background p-6 shadow-xl"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Edit Equipment</h2>
                            <button
                                type="button"
                                onClick={() => setEditingItem(null)}
                                className="rounded-md p-2 hover:bg-muted"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">Equipment Name</label>
                            <input
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full rounded-lg border bg-background px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">Category</label>
                            <input
                                required
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="w-full rounded-lg border bg-background px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">Description</label>
                            <textarea
                                required
                                rows={3}
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="w-full rounded-lg border bg-background px-3 py-2"
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Price Per Day</label>
                                <input
                                    required
                                    type="number"
                                    min="1"
                                    value={form.pricePerDay}
                                    onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })}
                                    className="w-full rounded-lg border bg-background px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Location</label>
                                <input
                                    required
                                    value={form.location}
                                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                                    className="w-full rounded-lg border bg-background px-3 py-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Image URLs (comma separated)
                            </label>
                            <textarea
                                rows={2}
                                value={form.images}
                                onChange={(e) => setForm({ ...form, images: e.target.value })}
                                className="w-full rounded-lg border bg-background px-3 py-2"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
