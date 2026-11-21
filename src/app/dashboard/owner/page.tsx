
// import Link from "next/link";
// import {
//   ArrowDownRight,
//   ArrowUpRight,
//   Bell,
//   CalendarDays,
//   CheckCircle2,
//   Clock3,
//   DollarSign,
//   LayoutDashboard,
//   LogOut,
//   Package,
//   Plus,
//   Search,
//   Settings,
//   TrendingUp,
//   Users,
// } from "lucide-react";

// const navigation = [
//   {
//     label: "Overview",
//     href: "/dashboard/owner",
//     icon: LayoutDashboard,
//     active: true,
//   },
//   {
//     label: "My Equipment",
//     href: "/dashboard/owner/equipment",
//     icon: Package,
//     active: false,
//   },
//   {
//     label: "Rental Requests",
//     href: "/dashboard/owner/requests",
//     icon: CalendarDays,
//     active: false,
//   },
//   {
//     label: "Earnings",
//     href: "/dashboard/owner/earnings",
//     icon: DollarSign,
//     active: false,
//   },
// ];

// const stats = [
//   {
//     title: "Earnings (Nov)",
//     value: "$3,420",
//     change: "+18%",
//     icon: DollarSign,
//     positive: true,
//   },
//   {
//     title: "Active Rentals",
//     value: "04",
//     change: "2 returning",
//     icon: Package,
//     positive: true,
//   },
//   {
//     title: "Pending Requests",
//     value: "03",
//     change: "Reply today",
//     icon: Clock3,
//     positive: false,
//   },
//   {
//     title: "Utilisation",
//     value: "72%",
//     change: "+6%",
//     icon: TrendingUp,
//     positive: true,
//   },
// ];

// const revenue = [
//   { month: "Jun", amount: 40 },
//   { month: "Jul", amount: 55 },
//   { month: "Aug", amount: 48 },
//   { month: "Sep", amount: 70 },
//   { month: "Oct", amount: 62 },
//   { month: "Nov", amount: 90 },
// ];

// const requests = [
//   {
//     name: "Rafiq Ahmed",
//     equipment: "CAT 320 Excavator",
//     date: "Nov 24 – 27",
//     amount: "$555",
//     initials: "RA",
//     color: "bg-orange-100 text-orange-700",
//   },
//   {
//     name: "Nusrat Jahan",
//     equipment: "Komatsu Dozer",
//     date: "Nov 28 – 30",
//     amount: "$720",
//     initials: "NJ",
//     color: "bg-blue-100 text-blue-700",
//   },
//   {
//     name: "Karim Sheikh",
//     equipment: "Genie Z-45 Lift",
//     date: "Dec 01 – 02",
//     amount: "$320",
//     initials: "KS",
//     color: "bg-green-100 text-green-700",
//   },
// ];

// export default function OwnerDashboardPage() {
//   return (
//     <div className="min-h-screen bg-[#F7F4EE]  text-[#252A2D] md:flex">
//       {/* Sidebar */}
//       <aside className="flex w-full shrink-0 flex-col bg-[#111719] px-5 py-6 text-white md:min-h-screen md:w-60">
//         <Link href="/" className="mb-9 text-2xl font-extrabold tracking-tight">
//           Rent<span className="text-[#F28C28]">Pro</span>
//         </Link>

//         <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
//           Owner workspace
//         </p>

//         <nav className="space-y-2">
//           {navigation.map((item) => {
//             const Icon = item.icon;

//             return (
//               <Link
//                 key={item.label}
//                 href={item.href}
//                 className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
//                   item.active
//                     ? "bg-[#F28C28] text-white"
//                     : "text-white/65 hover:bg-white/10 hover:text-white"
//                 }`}
//               >
//                 <Icon size={18} />
//                 {item.label}
//               </Link>
//             );
//           })}
//         </nav>

//         <div className="mt-auto hidden border-t border-white/10 pt-6 md:block">
//           <Link
//             href="/"
//             className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
//           >
//             <LogOut size={18} />
//             Back to site
//           </Link>
//         </div>
//       </aside>

//       {/* Main content */}
//       <main className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-10">
//         {/* Topbar */}
//         <div className="mb-9 flex items-center justify-between gap-4">
//           <div className="relative w-full max-w-md">
//             <Search
//               size={18}
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-[#73756F]"
//             />
//             <input
//               type="search"
//               placeholder="Search bookings, equipment..."
//               className="h-11 w-full rounded-lg border border-[#E8E1D7] bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-[#999A94] focus:border-[#F28C28]"
//             />
//           </div>

//           <div className="flex shrink-0 items-center gap-4">
//             <button
//               type="button"
//               aria-label="Notifications"
//               className="relative rounded-full p-2 text-[#73756F] transition hover:bg-white"
//             >
//               <Bell size={20} />
//               <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#F28C28]" />
//             </button>

//             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#252A2D] text-sm font-bold text-white">
//               TM
//             </div>
//           </div>
//         </div>

//         {/* Page heading */}
//         <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
//               Owner Overview
//             </h1>
//             <p className="mt-1 text-sm text-[#73756F]">
//               Here&apos;s what&apos;s happening with your equipment.
//             </p>
//           </div>

//           <Link
//             href="/dashboard/owner/equipment/new"
//             className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#F28C28] px-5 text-sm font-bold text-white transition hover:bg-[#df7917]"
//           >
//             <Plus size={18} />
//             Add Equipment
//           </Link>
//         </div>

//         {/* Statistics */}
//         <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//           {stats.map((stat) => {
//             const Icon = stat.icon;

//             return (
//               <div
//                 key={stat.title}
//                 className="rounded-xl border border-[#E8E1D7] bg-white p-5"
//               >
//                 <div className="mb-5 flex items-center justify-between">
//                   <p className="text-sm font-medium text-[#73756F]">
//                     {stat.title}
//                   </p>
//                   <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7F4EE] text-[#F28C28]">
//                     <Icon size={19} />
//                   </span>
//                 </div>

//                 <h2 className="text-2xl font-extrabold tracking-tight">
//                   {stat.value}
//                 </h2>

//                 <div className="mt-2 flex items-center gap-1 text-xs font-semibold">
//                   {stat.positive ? (
//                     <ArrowUpRight size={15} className="text-green-600" />
//                   ) : (
//                     <ArrowDownRight size={15} className="text-[#F28C28]" />
//                   )}
//                   <span
//                     className={
//                       stat.positive ? "text-green-600" : "text-[#F28C28]"
//                     }
//                   >
//                     {stat.change}
//                   </span>
//                   <span className="font-normal text-[#999A94]">
//                     {stat.title === "Pending Requests" ? "" : "vs last month"}
//                   </span>
//                 </div>
//               </div>
//             );
//           })}
//         </section>

//         {/* Revenue and requests */}
//         <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
//           {/* Revenue chart */}
//           <div className="rounded-xl border border-[#E8E1D7] bg-white p-5 sm:p-6">
//             <div className="mb-7 flex items-center justify-between">
//               <div>
//                 <h2 className="text-lg font-bold">Revenue</h2>
//                 <p className="mt-1 text-sm text-[#73756F]">
//                   Your monthly earnings overview
//                 </p>
//               </div>

//               <span className="rounded-md bg-[#F7F4EE] px-3 py-2 text-xs font-semibold text-[#73756F]">
//                 Last 6 months
//               </span>
//             </div>

//             <div className="mb-3 flex items-end justify-between">
//               <div>
//                 <p className="text-xs text-[#73756F]">Total revenue</p>
//                 <p className="mt-1 text-2xl font-extrabold">$18,640</p>
//               </div>
//               <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
//                 <ArrowUpRight size={15} />
//                 18%
//               </span>
//             </div>

//             <div className="relative mt-8 flex h-52 items-end justify-between gap-3 border-b border-[#E8E1D7] px-2">
//               {revenue.map((item) => (
//                 <div
//                   key={item.month}
//                   className="flex h-full flex-1 flex-col items-center justify-end gap-3"
//                 >
//                   <div
//                     className={`w-full max-w-12 rounded-t-md transition ${
//                       item.month === "Nov"
//                         ? "bg-[#F28C28]"
//                         : "bg-[#F5C18F] hover:bg-[#F28C28]"
//                     }`}
//                     style={{ height: `${item.amount}%` }}
//                     title={`${item.month}: ${item.amount}%`}
//                   />
//                   <span className="absolute -bottom-6 text-xs text-[#73756F]">
//                     {item.month}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-12 flex items-center gap-2 text-xs text-[#73756F]">
//               <span className="h-2.5 w-2.5 rounded-sm bg-[#F28C28]" />
//               Monthly revenue
//             </div>
//           </div>

//           {/* New requests */}
//           <div className="rounded-xl border border-[#E8E1D7] bg-white p-5 sm:p-6">
//             <div className="mb-6 flex items-center justify-between">
//               <div>
//                 <h2 className="text-lg font-bold">New Requests</h2>
//                 <p className="mt-1 text-sm text-[#73756F]">
//                   Requests waiting for your response
//                 </p>
//               </div>

//               <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-[#C66A13]">
//                 3 Pending
//               </span>
//             </div>

//             <div className="space-y-5">
//               {requests.map((request) => (
//                 <div
//                   key={request.name}
//                   className="flex items-start gap-3 border-b border-[#E8E1D7] pb-5 last:border-0 last:pb-0"
//                 >
//                   <div
//                     className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${request.color}`}
//                   >
//                     {request.initials}
//                   </div>

//                   <div className="min-w-0 flex-1">
//                     <div className="flex flex-wrap items-center justify-between gap-2">
//                       <h3 className="text-sm font-bold">{request.name}</h3>
//                       <span className="text-sm font-bold text-[#252A2D]">
//                         {request.amount}
//                       </span>
//                     </div>

//                     <p className="mt-1 text-xs text-[#73756F]">
//                       {request.equipment}
//                     </p>

//                     <p className="mt-2 flex items-center gap-1 text-xs text-[#999A94]">
//                       <CalendarDays size={13} />
//                       {request.date}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <Link
//               href="/dashboard/owner/requests"
//               className="mt-6 flex h-10 w-full items-center justify-center rounded-lg border border-[#E8E1D7] text-sm font-bold transition hover:border-[#F28C28] hover:text-[#F28C28]"
//             >
//               View all requests
//             </Link>
//           </div>
//         </section>

//         {/* Footer note */}
//         <p className="mt-8 text-center text-xs text-[#999A94]">
//           RentPro Owner Workspace · Dashboard data is currently for preview
//         </p>
//       </main>
//     </div>
//   );
// }

import React from 'react';

const page = () => {
    return (
        <div>
             ownerpage
        </div>
    );
};

export default page;