
"use client";

import { useEffect, useState } from "react";
import { Loading } from "@/components/loading";
import { Heart, MapPin, Package, Trash2 } from "lucide-react";

import {
  getFavorites,
  removeFavorite,
} from "@/lib/api/favorites";
import { toast } from "@/components/ui/toast";

type Equipment = {
  _id: string;
  name: string;
  category: string;
  description: string;
  pricePerDay: number;
  location: string;
  images: string[];
  status: "available" | "rented";
};

type Favorite = {
  _id: string;
  equipmentId: string;
  equipment: Equipment;
};

export default function CustomerFavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState("");

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const data = await getFavorites();
        setFavorites(data);
      } catch (error) {
        toast.add({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to load favorites",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, []);

  async function handleRemoveFavorite(equipmentId: string) {
    try {
      setRemovingId(equipmentId);

      await removeFavorite(equipmentId);

      setFavorites((previousFavorites) =>
        previousFavorites.filter(
          (favorite) => favorite.equipmentId !== equipmentId,
        ),
      );

      toast.add({
        title: "Success",
        description: "Equipment removed from favorites.",
        type: "success",
      });
    } catch (error) {
      toast.add({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to remove favorite",
        type: "error",
      });
    } finally {
      setRemovingId("");
    }
  }

  if (loading) {
    return <Loading label="Loading your favorites..." />;
  }

  return (
    <div className="min-h-screen space-y-8 bg-background p-4 text-foreground sm:p-6 lg:p-8">
      {/* Page Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1.5 text-sm font-semibold text-brand">
            <Heart className="size-4" />
            Your Collection
          </div>

          <h1 className="text-page font-bold tracking-tight text-foreground">
            My Favorites
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Keep your favorite equipment close and rent it whenever
            you need.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border bg-card px-4 py-3 shadow-sm">
          <Heart className="size-5 fill-brand text-brand" />
          <span className="text-sm font-semibold text-foreground">
            {favorites.length} Saved Items
          </span>
        </div>
      </div>

      {/* Empty State */}
      {favorites.length === 0 ? (
        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border bg-card px-6 py-12 text-center shadow-sm">
          <div className="mb-5 rounded-2xl bg-brand/10 p-5">
            <Heart className="size-10 text-brand" />
          </div>

          <h2 className="text-xl font-bold text-foreground">
            Your wishlist is empty
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            You haven't saved any equipment yet. Explore our
            collection and save the equipment you love.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm font-medium text-muted-foreground">
            {favorites.length} saved equipment
          </p>

          {/* Equipment Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {favorites.map((favorite) => {
              const equipment = favorite.equipment;

              return (
                <div
                  key={favorite._id}
                  className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Equipment Image */}
                  <div className="relative h-52 overflow-hidden bg-muted">
                    {equipment.images?.[0] ? (
                      <img
                        src={equipment.images[0]}
                        alt={equipment.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package className="size-14 text-muted-foreground" />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveFavorite(equipment._id)
                      }
                      disabled={removingId === equipment._id}
                      aria-label="Remove from favorites"
                      className="absolute right-3 top-3 rounded-full bg-card p-2.5 text-brand shadow-md transition-colors hover:bg-brand hover:text-brand-foreground disabled:opacity-50"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  {/* Equipment Information */}
                  <div className="space-y-4 p-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                        {equipment.category}
                      </span>

                      <span
                        className={`text-xs font-medium ${
                          equipment.status === "available"
                            ? "text-emerald-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {equipment.status === "available"
                          ? "Available"
                          : "Currently Rented"}
                      </span>
                    </div>

                    <div>
                      <h2 className="line-clamp-1 text-lg font-bold text-foreground">
                        {equipment.name}
                      </h2>

                      <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="size-4 shrink-0 text-brand" />
                        <span className="line-clamp-1">
                          {equipment.location}
                        </span>
                      </div>
                    </div>

                    {/* Price and Remove */}
                    <div className="flex items-center justify-between border-t border-border pt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Rental price
                        </p>

                        <p className="mt-1 text-xl font-bold text-foreground">
                          ${equipment.pricePerDay}
                          <span className="text-sm font-medium text-muted-foreground">
                            {" "}/ day
                          </span>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveFavorite(equipment._id)
                        }
                        disabled={removingId === equipment._id}
                        className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:border-brand hover:bg-brand/10 hover:text-brand disabled:opacity-50"
                      >
                        {removingId === equipment._id
                          ? "Removing..."
                          : "Remove"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
