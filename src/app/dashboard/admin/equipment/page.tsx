
"use client";

import { useEffect, useState } from "react";
import { Loading } from "@/components/loading";
import {
  Search,
  Package,
  MapPin,
  Check,
  X,
  Trash2,
  Pencil,
  Save,
} from "lucide-react";

import {
  getAdminEquipment,
  updateEquipmentApproval,
  updateAdminEquipment,
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

  const [editingEquipment, setEditingEquipment] =
    useState<AdminEquipment | null>(null);

  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    description: "",
    pricePerDay: "",
    location: "",
    images: "",
  });

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

  function handleEdit(item: AdminEquipment) {
    setEditingEquipment(item);

    setEditForm({
      name: item.name,
      category: item.category,
      description: item.description,
      pricePerDay: String(item.pricePerDay),
      location: item.location,
      images: item.images?.join("\n") || "",
    });
  }

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingEquipment) return;

    const price = Number(editForm.pricePerDay);

    if (!Number.isFinite(price) || price <= 0) {
      toast.add({
        title: "Invalid price",
        description: "Please enter a valid daily price.",
        type: "error",
      });
      return;
    }

    try {
      setActionId(editingEquipment._id);

      const updatedData = {
        name: editForm.name.trim(),
        category: editForm.category.trim(),
        description: editForm.description.trim(),
        pricePerDay: price,
        location: editForm.location.trim(),
        images: editForm.images
          .split("\n")
          .map((image) => image.trim())
          .filter(Boolean),
      };

      await updateAdminEquipment(editingEquipment._id, updatedData);

      setEquipment((previous) =>
        previous.map((item) =>
          item._id === editingEquipment._id
            ? { ...item, ...updatedData }
            : item
        )
      );

      setEditingEquipment(null);

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
            : "Failed to update equipment",
        type: "error",
      });
    } finally {
      setActionId("");
    }
  }

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Equipment</h1>
        <p className="mt-1 text-sm text-gray-400">
          View and manage all listed equipment.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-[#222222] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Total Equipment</p>
            <Package className="size-5 text-orange-500" />
          </div>
          <p className="mt-3 text-2xl font-bold">{equipment.length}</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#222222] p-5">
          <p className="text-sm text-gray-400">Available Equipment</p>
          <p className="mt-3 text-2xl font-bold text-orange-500">
            {equipment.filter((item) => item.status === "available").length}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#222222] p-5">
          <p className="text-sm text-gray-400">Pending Approval</p>
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

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search equipment..."
          className="h-11 w-full rounded-lg border border-white/10 bg-[#222222] pl-10 pr-4 text-sm text-white outline-none placeholder:text-gray-500 focus:border-orange-500"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#222222]">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="font-semibold">Equipment List</h2>
          <p className="mt-1 text-sm text-gray-400">
            {filteredEquipment.length} equipment found
          </p>
        </div>

        {loading ? (
          <Loading className="min-h-0 py-16" label="Loading equipment..." />
        ) : error ? (
          <div className="py-16 text-center text-red-400">{error}</div>
        ) : filteredEquipment.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            No equipment found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] text-left text-sm">
              <thead className="bg-[#292929] text-gray-400">
                <tr>
                  <th className="px-5 py-4 font-medium">Equipment</th>
                  <th className="px-5 py-4 font-medium">Category</th>
                  <th className="px-5 py-4 font-medium">Location</th>
                  <th className="px-5 py-4 font-medium">Price / Day</th>
                  <th className="px-5 py-4 font-medium">Availability</th>
                  <th className="px-5 py-4 font-medium">Approval</th>
                  <th className="px-5 py-4 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {filteredEquipment.map((item) => {
                  const approvalStatus = item.approvalStatus || "pending";
                  const isProcessing = actionId === item._id;

                  return (
                    <tr key={item._id} className="hover:bg-white/[0.03]">
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
                            <p className="font-medium text-white">{item.name}</p>
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

                      <td className="px-5 py-4 font-medium">
                        ৳{item.pricePerDay.toLocaleString("en-BD")}
                      </td>

                      <td className="px-5 py-4">
                        <span className="whitespace-nowrap rounded-full bg-orange-500/15 px-3 py-1 text-xs capitalize text-orange-400">
                          {item.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`whitespace-nowrap rounded-full px-3 py-1 text-xs capitalize ${
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

                      <td className="px-5 py-4">
                        <div className="flex w-fit items-center gap-2">
                          <button
                            disabled={isProcessing}
                            onClick={() => handleEdit(item)}
                            className="flex h-9 items-center gap-1 rounded-lg bg-orange-500/15 px-3 text-xs font-medium text-orange-400 hover:bg-orange-500/25 disabled:opacity-40"
                          >
                            <Pencil className="size-3.5" />
                            Edit
                          </button>

                          <button
                            disabled={isProcessing || approvalStatus === "approved"}
                            onClick={() => handleApproval(item._id, "approved")}
                            className="flex h-9 items-center gap-1 rounded-lg bg-green-500/15 px-3 text-xs text-green-400 hover:bg-green-500/25 disabled:opacity-40"
                          >
                            <Check className="size-3.5" />
                            Approve
                          </button>

                          <button
                            disabled={isProcessing || approvalStatus === "rejected"}
                            onClick={() => handleApproval(item._id, "rejected")}
                            className="flex h-9 items-center gap-1 rounded-lg bg-red-500/15 px-3 text-xs text-red-400 hover:bg-red-500/25 disabled:opacity-40"
                          >
                            <X className="size-3.5" />
                            Reject
                          </button>

                          <button
                            disabled={isProcessing}
                            onClick={() => setSelectedEquipmentId(item._id)}
                            className="flex size-9 items-center justify-center rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 disabled:opacity-40"
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

      {/* Edit Equipment Dialog */}
      {editingEquipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4">
          <div className="my-auto w-full max-w-2xl rounded-xl border border-white/10 bg-[#222222] p-6 text-white shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Edit Equipment</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Update equipment information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingEquipment(null)}
                disabled={!!actionId}
                className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Equipment Name
                  </label>
                  <input
                    required
                    value={editForm.name}
                    onChange={(event) =>
                      setEditForm({ ...editForm, name: event.target.value })
                    }
                    className="h-11 w-full rounded-lg border border-white/10 bg-[#171717] px-3 text-sm outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Category
                  </label>
                  <input
                    required
                    value={editForm.category}
                    onChange={(event) =>
                      setEditForm({ ...editForm, category: event.target.value })
                    }
                    className="h-11 w-full rounded-lg border border-white/10 bg-[#171717] px-3 text-sm outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Price Per Day (৳)
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={editForm.pricePerDay}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        pricePerDay: event.target.value,
                      })
                    }
                    className="h-11 w-full rounded-lg border border-white/10 bg-[#171717] px-3 text-sm outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Location
                  </label>
                  <input
                    required
                    value={editForm.location}
                    onChange={(event) =>
                      setEditForm({ ...editForm, location: event.target.value })
                    }
                    className="h-11 w-full rounded-lg border border-white/10 bg-[#171717] px-3 text-sm outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={editForm.description}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      description: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-white/10 bg-[#171717] p-3 text-sm outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Image URLs (one URL per line)
                </label>
                <textarea
                  rows={3}
                  value={editForm.images}
                  onChange={(event) =>
                    setEditForm({ ...editForm, images: event.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-lg border border-white/10 bg-[#171717] p-3 text-sm outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={!!actionId}
                  onClick={() => setEditingEquipment(null)}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!!actionId}
                  className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
                >
                  <Save className="size-4" />
                  {actionId === editingEquipment._id
                    ? "Updating..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
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
            <AlertDialogTitle>Delete Equipment?</AlertDialogTitle>
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
              {actionId === selectedEquipmentId ? "Deleting..." : "Yes, Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
