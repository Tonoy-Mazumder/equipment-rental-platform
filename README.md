# RentPro – Equipment Rental Platform

RentPro is a full-stack equipment rental platform that allows customers to browse and rent equipment, equipment owners to manage their listings and rental requests, and administrators to manage the platform.

## Features

- **User Authentication:** Register and log in using email/password or Google authentication.
- **Role-Based Dashboards:** Separate dashboards for Customers, Equipment Owners, and Administrators.
- **Equipment Browsing:** Browse approved equipment with search and filters.
- **Equipment Details:** View equipment information, pricing, availability status, and rental details.
- **Equipment Management:** Owners can add, update, and manage their equipment listings.
- **Booking Management:** Customers can manage bookings, while owners can manage rental requests.
- **Online Payments:** Secure rental payments through Stripe Checkout.
- **Favorites:** Customers can save and manage favorite equipment.
- **Admin Management:** Administrators can manage users, equipment approvals, and rentals.
- **Analytics:** Admins and owners can view relevant platform statistics and earnings.

## Technologies Used

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- BetterAuth
- Stripe
- Lucide React
- Framer Motion

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

- Node.js
- npm
- Git
- Running RentPro backend server

### Installation

Clone the repository:

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

Create a `.env.local` file in the client root directory.

```env
NEXT_PUBLIC_API_BASE_URL=YOUR_SERVER_API_URL
```

Configure any additional BetterAuth or payment-related variables required by your existing project setup. Never commit actual secrets or credentials.

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

The client communicates with the RentPro Express.js backend through the API base URL configured in `NEXT_PUBLIC_API_BASE_URL`.

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
| Owner | List equipment, manage rental requests, view rental history and earnings |
| Admin | Manage users, equipment approvals, rentals, and platform analytics |

## Live Application

- **Live Website:** ADD_LIVE_URL
- **Backend API:** ADD_LIVE_URL

## Developer

Developed as an equipment rental platform project using modern full-stack web technologies.