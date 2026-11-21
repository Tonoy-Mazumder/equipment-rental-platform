
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, MapPin, Package } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
    getOwnerEquipment,
    type Equipment,
} from "@/lib/api/equipment";

const Page = () => {
    const { data: session, isPending } = authClient.useSession();

    const ownerId = session?.user?.id;

    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    console.log("Logged in Owner ID:", ownerId);
    useEffect(() => {
        const fetchEquipment = async () => {
            if (!ownerId) return;

            try {
                setLoading(true);
                setError("");

                const data = await getOwnerEquipment(ownerId);
                setEquipment(data);
            } catch {
                setError("Failed to load your equipment.");
            } finally {
                setLoading(false);
            }
        };

        if (!isPending) {
            fetchEquipment();
        }
    }, [ownerId, isPending]);

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

            {!error && equipment.length === 0 && (
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

                        <div className="mt-4 border-t pt-4">
                            <p className="font-bold">
                                ${item.pricePerDay}
                                <span className="font-normal text-muted-foreground"> / day</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Page;
