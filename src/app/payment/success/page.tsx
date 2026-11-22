
import Link from "next/link";
import { CheckCircle2, ArrowRight, Home } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>

        <h1 className="mb-3 text-2xl font-bold text-foreground">
          Payment Successful!
        </h1>

        <p className="mb-8 text-sm leading-6 text-muted-foreground">
          Your payment has been completed successfully. Your booking request
          has been submitted and is waiting for owner approval.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard/customer/bookings"
            className="flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 font-semibold text-brand-foreground transition hover:opacity-90"
          >
            View My Bookings
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-3 font-medium text-foreground transition hover:bg-muted"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
