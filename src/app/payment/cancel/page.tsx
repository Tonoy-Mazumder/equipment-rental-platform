
import Link from "next/link";
import { XCircle, ArrowLeft, Home } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand/10">
          <XCircle className="h-12 w-12 text-brand" />
        </div>

        <h1 className="mb-3 text-2xl font-bold text-foreground">
          Payment Cancelled
        </h1>

        <p className="mb-8 text-sm leading-6 text-muted-foreground">
          Your checkout was cancelled. You have not completed this payment.
          You can return to the equipment details and try again.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/equipment"
            className="flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 font-semibold text-brand-foreground transition hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse Equipment
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
