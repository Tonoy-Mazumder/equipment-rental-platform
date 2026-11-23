# RentPro – Equipment Rental Platform

RentPro is a full-stack equipment rental platform where customers can browse and rent equipment, equipment owners can manage their listings and rental requests, and administrators can manage users, equipment approvals, and platform activities.

## Features

- **User Authentication:** Register and log in using email/password or Google authentication.
- **Role-Based Dashboards:** Dedicated dashboards for Customers, Equipment Owners, and Administrators.
- **Equipment Browsing:** Browse approved equipment with search and filtering options.
- **Equipment Details:** View equipment descriptions, pricing, availability, and rental information.
- **Equipment Management:** Owners can add, update, and manage their equipment listings.
- **Booking Management:** Customers can manage their bookings, while owners can review and manage rental requests.
- **Online Payments:** Secure rental payments through Stripe Checkout.
- **Favorites:** Customers can save and manage their favorite equipment.
- **Admin Management:** Administrators can manage users, equipment approvals, and rentals.
- **Analytics:** Owners and administrators can view relevant statistics and earnings.

## Technologies Used

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- Lucide React
- Framer Motion

### Backend & Services
- Express.js
- MongoDB
- BetterAuth
- Stripe

## Project Structure

```text
client/
├── public/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   ├── customer/
│   │   │   └── owner/
│   │   ├── equipment/
│   │   └── ...
│   ├── components/
│   ├── lib/
│   │   └── api/
│   └── proxy.ts
├── .env.local
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Git
- RentPro backend server

### Installation

Clone the client repository:

```bash
git clone YOUR_CLIENT_REPOSITORY_URL
```

Navigate to the project directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the client root directory and configure the required environment variables.

```env
NEXT_PUBLIC_API_BASE_URL=YOUR_SERVER_API_URL
```

Configure the additional BetterAuth, MongoDB, and Stripe-related environment variables required by your project.

**Important:** Never commit secret keys, passwords, or environment files to GitHub.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Run Linter

```bash
npm run lint
```

## Backend API

The frontend communicates with the RentPro Express.js backend through the API base URL configured in `NEXT_PUBLIC_API_BASE_URL`.

The backend handles:

- Authentication and authorization
- Equipment management
- Equipment search and filtering
- Booking management
- Favorites
- Admin operations
- Analytics
- Stripe payment processing

## User Roles

| Role | Permissions |
|---|---|
| Customer | Browse equipment, book equipment, make payments, manage favorites and bookings |
| Owner | List equipment, manage equipment, handle rental requests, view rental history and earnings |
| Admin | Manage users, approve equipment, manage rentals, and view platform analytics |

## Live Application

- **Live Website:** https://equipment-rental-platform-seven.vercel.app
- **Backend API:** https://equipment-rental-platform-server-topaz.vercel.app

## Developer

Developed as a full-stack equipment rental platform project using modern web technologies.
