
"use client";

import { useEffect, useState } from "react";
import {
    Search,
    Users,
    ShieldCheck,
    UserRound,
} from "lucide-react";

import {
    getAdminUsers,
    type AdminUser,
} from "@/lib/api/admin";

export default function AdminUserPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadUsers() {
            try {
                const data = await getAdminUsers();
                setUsers(data);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load users"
                );
            } finally {
                setLoading(false);
            }
        }

        loadUsers();
    }, []);

    const filteredUsers = users.filter((user) =>
        `${user.name} ${user.email} ${user.role}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const adminCount = users.filter(
        (user) => user.role === "admin"
    ).length;

    const ownerCount = users.filter(
        (user) => user.role === "owner"
    ).length;

    const customerCount = users.filter(
        (user) => user.role === "customer"
    ).length;

    return (
        <div className="-m-5 min-h-full space-y-6 bg-[#171717] p-5 text-white md:-m-8 md:p-8">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">
                    All Users
                </h1>
                <p className="mt-1 text-sm text-gray-400">
                    Manage and view all registered users.
                </p>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Users"
                    value={users.length}
                    icon={<Users className="size-5" />}
                />

                <StatCard
                    title="Customers"
                    value={customerCount}
                    icon={<UserRound className="size-5" />}
                />

                <StatCard
                    title="Owners"
                    value={ownerCount}
                    icon={<Users className="size-5" />}
                />

                <StatCard
                    title="Admins"
                    value={adminCount}
                    icon={<ShieldCheck className="size-5" />}
                />
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />

                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, email or role..."
                    className="h-11 w-full rounded-lg border border-white/10 bg-[#222222] pl-10 pr-4 text-sm text-white outline-none placeholder:text-gray-500 focus:border-orange-500"
                />
            </div>

            {/* Users Table */}
            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#222222]">

                <div className="border-b border-white/10 px-5 py-4">
                    <h2 className="font-semibold">
                        Registered Users
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                        {filteredUsers.length} users found
                    </p>
                </div>

                {loading ? (
                    <div className="py-16 text-center text-gray-400">
                        Loading users...
                    </div>
                ) : error ? (
                    <div className="py-16 text-center text-red-400">
                        {error}
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="py-16 text-center text-gray-400">
                        No users found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">

                            <thead className="bg-[#292929] text-gray-400">
                                <tr>
                                    <th className="px-5 py-4 font-medium">
                                        User
                                    </th>
                                    <th className="px-5 py-4 font-medium">
                                        Email
                                    </th>
                                    <th className="px-5 py-4 font-medium">
                                        Role
                                    </th>
                                    <th className="px-5 py-4 font-medium">
                                        Joined
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/10">
                                {filteredUsers.map((user) => (
                                    <tr
                                        key={user._id}
                                        className="transition-colors hover:bg-white/[0.03]"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {user.image ? (
                                                    <img
                                                        src={user.image}
                                                        alt={user.name}
                                                        className="size-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex size-10 items-center justify-center rounded-full bg-[#333333] font-semibold text-orange-500">
                                                        {user.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                )}

                                                <span className="font-medium text-white">
                                                    {user.name}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-gray-400">
                                            {user.email}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                                                    user.role === "admin"
                                                        ? "bg-purple-500/15 text-purple-400"
                                                        : user.role === "owner"
                                                          ? "bg-orange-500/15 text-orange-400"
                                                          : "bg-blue-500/15 text-blue-400"
                                                }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-gray-400">
                                            {new Date(
                                                user.createdAt
                                            ).toLocaleDateString("en-GB")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({
    title,
    value,
    icon,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-white/10 bg-[#222222] p-5 transition-colors hover:border-orange-500/40">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">
                    {title}
                </p>

                <span className="text-orange-500">
                    {icon}
                </span>
            </div>

            <p className="mt-3 text-2xl font-bold text-white">
                {value}
            </p>
        </div>
    );
}
