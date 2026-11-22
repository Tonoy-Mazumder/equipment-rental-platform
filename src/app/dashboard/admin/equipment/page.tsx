
"use client";

import { useEffect, useState } from "react";
import {
    Search,
    Package,
    MapPin,
    Check,
    X,
    Trash2,
} from "lucide-react";

import {
    getAdminEquipment,
    updateEquipmentApproval,
    deleteAdminEquipment,
    type AdminEquipment,
} from "@/lib/api/admin";

import { toast } from "@/components/ui/toast";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminEquipmentPage() {
    const [equipment, setEquipment] = useState<AdminEquipment[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionId, setActionId] = useState("");
    const [selectedEquipmentId, setSelectedEquipmentId] = useState("");

    useEffect(() => {
        async function loadEquipment() {
            try {
                const data = await getAdminEquipment();
                setEquipment(data);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load equipment"
                );
            } finally {
                setLoading(false);
            }
        }

        loadEquipment();
    }, []);

    const filteredEquipment = equipment.filter((item) =>
        `${item.name} ${item.category} ${item.location}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    async function handleApproval(
        equipmentId: string,
        approvalStatus: "approved" | "rejected"
    ) {
        try {
            setActionId(equipmentId);

            await updateEquipmentApproval(equipmentId, approvalStatus);

            setEquipment((previous) =>
                previous.map((item) =>
                    item._id === equipmentId
                        ? { ...item, approvalStatus }
                        : item
                )
            );

            toast.add({
                title: "Success",
                description: `Equipment ${approvalStatus} successfully.`,
                type: "success",
            });
        } catch (error) {
            toast.add({
                title: "Error",
                description:
                    error instanceof Error
                        ? error.message
                        : "Failed to update equipment",
                type: "error",
            });
        } finally {
            setActionId("");
        }
    }

    async function handleDelete(equipmentId: string) {
        try {
            setActionId(equipmentId);

            await deleteAdminEquipment(equipmentId);

            setEquipment((previous) =>
                previous.filter((item) => item._id !== equipmentId)
            );

            setSelectedEquipmentId("");

            toast.add({
                title: "Success",
                description: "Equipment deleted successfully.",
                type: "success",
            });
        } catch (error) {
            toast.add({
                title: "Error",
                description:
                    error instanceof Error
                        ? error.message
                        : "Failed to delete equipment",
                type: "error",
            });
        } finally {
            setActionId("");
        }
    }

    return (
        <div className="-m-5 min-h-full space-y-6 bg-[#171717] p-5 text-white md:-m-8 md:p-8">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">
                    All Equipment
                </h1>
                <p className="mt-1 text-sm text-gray-400">
                    View and manage all listed equipment.
                </p>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-[#222222] p-5">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400">
                            Total Equipment
                        </p>
                        <Package className="size-5 text-orange-500" />
                    </div>
                    <p className="mt-3 text-2xl font-bold">
                        {equipment.length}
                    </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#222222] p-5">
                    <p className="text-sm text-gray-400">
                        Available Equipment
                    </p>
                    <p className="mt-3 text-2xl font-bold text-orange-500">
                        {
                            equipment.filter(
                                (item) => item.status === "available"
                            ).length
                        }
                    </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#222222] p-5">
                    <p className="text-sm text-gray-400">
                        Pending Approval
                    </p>
                    <p className="mt-3 text-2xl font-bold text-yellow-400">
                        {
                            equipment.filter(
                                (item) =>
                                    !item.approvalStatus ||
                                    item.approvalStatus === "pending"
                            ).length
                        }
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search equipment..."
                    className="h-11 w-full rounded-lg border border-white/10 bg-[#222222] pl-10 pr-4 text-sm text-white outline-none placeholder:text-gray-500 focus:border-orange-500"
                />
            </div>

            {/* Equipment Table */}
            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#222222]">
                <div className="border-b border-white/10 px-5 py-4">
                    <h2 className="font-semibold">
                        Equipment List
                    </h2>
                    <p className="mt-1 text-sm text-gray-400">
                        {filteredEquipment.length} equipment found
                    </p>
                </div>

                {loading ? (
                    <div className="py-16 text-center text-gray-400">
                        Loading equipment...
                    </div>
                ) : error ? (
                    <div className="py-16 text-center text-red-400">
                        {error}
                    </div>
                ) : filteredEquipment.length === 0 ? (
                    <div className="py-16 text-center text-gray-400">
                        No equipment found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1100px] text-left text-sm">
                            <thead className="bg-[#292929] text-gray-400">
                                <tr>
                                    <th className="px-5 py-4 font-medium">Equipment</th>
                                    <th className="px-5 py-4 font-medium">Category</th>
                                    <th className="px-5 py-4 font-medium">Location</th>
                                    <th className="px-5 py-4 font-medium">Price / Day</th>
                                    <th className="px-5 py-4 font-medium">Availability</th>
                                    <th className="px-5 py-4 font-medium">Approval</th>
                                    <th className="w-[230px] px-5 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/10">
                                {filteredEquipment.map((item) => {
                                    const approvalStatus =
                                        item.approvalStatus || "pending";

                                    const isProcessing =
                                        actionId === item._id;

                                    return (
                                        <tr
                                            key={item._id}
                                            className="transition-colors hover:bg-white/[0.03]"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex min-w-[200px] items-center gap-3">
                                                    {item.images?.[0] ? (
                                                        <img
                                                            src={item.images[0]}
                                                            alt={item.name}
                                                            className="size-12 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex size-12 items-center justify-center rounded-lg bg-[#333333]">
                                                            <Package className="size-5 text-orange-500" />
                                                        </div>
                                                    )}

                                                    <div>
                                                        <p className="font-medium text-white">
                                                            {item.name}
                                                        </p>
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            ID: {item._id.slice(-8)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-gray-300">
                                                {item.category}
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-1 text-gray-400">
                                                    <MapPin className="size-4 shrink-0 text-orange-500" />
                                                    {item.location}
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 font-medium text-white">
                                                ৳{item.pricePerDay.toLocaleString("en-BD")}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="whitespace-nowrap rounded-full bg-orange-500/15 px-3 py-1 text-xs font-medium capitalize text-orange-400">
                                                    {item.status}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium capitalize ${
                                                        approvalStatus === "approved"
                                                            ? "bg-green-500/15 text-green-400"
                                                            : approvalStatus === "rejected"
                                                              ? "bg-red-500/15 text-red-400"
                                                              : "bg-yellow-500/15 text-yellow-400"
                                                    }`}
                                                >
                                                    {approvalStatus}
                                                </span>
                                            </td>

                                            {/* Fixed Action Buttons */}
                                            <td className="px-5 py-4">
                                                <div className="grid w-[190px] grid-cols-[1fr_1fr_36px] items-center gap-2">
                                                    <button
                                                        disabled={
                                                            isProcessing ||
                                                            approvalStatus === "approved"
                                                        }
                                                        onClick={() =>
                                                            handleApproval(item._id, "approved")
                                                        }
                                                        className="flex h-9 items-center justify-center gap-1 whitespace-nowrap rounded-lg bg-green-500/15 px-2 text-xs font-medium text-green-400 transition hover:bg-green-500/25 disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        <Check className="size-3.5 shrink-0" />
                                                        Approve
                                                    </button>

                                                    <button
                                                        disabled={
                                                            isProcessing ||
                                                            approvalStatus === "rejected"
                                                        }
                                                        onClick={() =>
                                                            handleApproval(item._id, "rejected")
                                                        }
                                                        className="flex h-9 items-center justify-center gap-1 whitespace-nowrap rounded-lg bg-red-500/15 px-2 text-xs font-medium text-red-400 transition hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        <X className="size-3.5 shrink-0" />
                                                        Reject
                                                    </button>

                                                    <button
                                                        disabled={isProcessing}
                                                        onClick={() =>
                                                            setSelectedEquipmentId(item._id)
                                                        }
                                                        className="flex size-9 items-center justify-center rounded-lg bg-red-500/15 text-red-400 transition hover:bg-red-500/25 disabled:opacity-50"
                                                        title="Delete equipment"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={!!selectedEquipmentId}
                onOpenChange={(open) => {
                    if (!open && !actionId) {
                        setSelectedEquipmentId("");
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete Equipment?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            Are you sure you want to delete this equipment?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={!!actionId}>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            disabled={!!actionId}
                            onClick={(event) => {
                                event.preventDefault();
                                handleDelete(selectedEquipmentId);
                            }}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            {actionId === selectedEquipmentId
                                ? "Deleting..."
                                : "Yes, Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
