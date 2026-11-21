
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { API_BASE_URL } from "@/lib/api/config";

const categories = [
  "Construction",
  "Camera",
  "Vehicle",
  "Electronics",
  "Tools",
  "Agriculture",
  "Other",
];

const AddNewEquipmentPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    pricePerDay: "",
    location: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const ownerId = session?.user?.id;

    if (!ownerId) {
      setError("Please login to add equipment.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/equipment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ownerId,
          name: formData.name,
          category: formData.category,
          description: formData.description,
          pricePerDay: Number(formData.pricePerDay),
          location: formData.location,
          images: formData.image ? [formData.image] : [],
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add equipment.");
      }

      router.push("/dashboard/owner/equipment");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return <div className="p-6">Loading...</div>;
  }

  if (!session?.user?.id) {
    return <div className="p-6">Please login to continue.</div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add New Equipment</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your equipment and make it available for rent.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border bg-card p-5 sm:p-7"
      >
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Equipment Name
          </label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Canon EOS R6"
            required
            className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your equipment..."
            rows={4}
            required
            className="w-full resize-none rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="pricePerDay" className="text-sm font-medium">
              Price Per Day ($)
            </label>
            <input
              id="pricePerDay"
              name="pricePerDay"
              type="number"
              min="1"
              value={formData.pricePerDay}
              onChange={handleChange}
              placeholder="80"
              required
              className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Location
            </label>
            <input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Dhaka, Bangladesh"
              required
              className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="image" className="text-sm font-medium">
            Equipment Image URL
          </label>
          <input
            id="image"
            name="image"
            type="url"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <p className="text-xs text-muted-foreground">
            Optional. Paste an image URL.
          </p>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border px-5 py-2.5 text-sm font-medium"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Adding Equipment..." : "Add Equipment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewEquipmentPage;
