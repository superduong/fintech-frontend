"use client";

import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMemo, useState } from "react";
import { api } from "@/services/api";
import type { StripeCreateIntentResponse } from "@/services/types";

function CheckoutForm({ returnPath }: { returnPath: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [msg, setMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setMsg(null);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}${returnPath}`,
      },
    });
    if (error) setMsg(error.message ?? "Thanh toán thất bại");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        className="rounded-lg bg-[#635BFF] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
      >
        Xác nhận thanh toán (test)
      </button>
      {msg && <p className="text-sm text-red-600">{msg}</p>}
    </form>
  );
}

export default function StripePaySection({
  quotationId,
  amountVnd,
}: {
  quotationId: string;
  amountVnd: number;
}) {
  const [ready, setReady] = useState<StripeCreateIntentResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pk =
    ready?.publishable_key?.trim() || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() || "";
  const stripePromise = useMemo(() => (pk ? loadStripe(pk) : null), [pk]);

  const start = async () => {
    setErr(null);
    setLoading(true);
    try {
      const { data } = await api.post<StripeCreateIntentResponse>("/payments/stripe/create-intent", {
        amount_vnd: amountVnd,
        quotation_id: quotationId,
      });
      setReady(data);
    } catch (ex: unknown) {
      const detail =
        ex && typeof ex === "object" && "response" in ex
          ? (ex as { response?: { data?: { detail?: unknown } } }).response?.data?.detail
          : undefined;
      setErr(
        typeof detail === "string"
          ? detail
          : "Không tạo được PaymentIntent (kiểm tra STRIPE_SECRET_KEY trên backend hoặc mạng).",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="mt-4 rounded-lg border border-[var(--bn-border)] bg-white p-4">
        <p className="text-sm font-medium text-[var(--bn-ink)]">Thanh toán Stripe (sandbox)</p>
        <p className="mt-1 text-xs text-[var(--bn-muted)]">
          Dùng thẻ test 4242424242424242. Sau khi thanh toán, cần webhook Stripe trỏ về backend để đơn chuyển
          trạng thái paid.
        </p>
        <button
          type="button"
          disabled={loading}
          onClick={start}
          className="mt-3 rounded-lg bg-[#635BFF] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Đang tạo phiên…" : "Tạo phiên thanh toán Stripe"}
        </button>
        {err && <p className="mt-2 text-xs text-red-600">{err}</p>}
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <p className="mt-2 text-xs text-red-600">
        Thiếu publishable key: đặt STRIPE_PUBLISHABLE_KEY trên API hoặc NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY trên
        frontend.
      </p>
    );
  }

  return (
    <div className="mt-4 rounded-lg border border-[var(--bn-border)] bg-white p-4">
      <p className="text-sm font-medium text-[var(--bn-ink)]">Stripe — nhập thẻ test</p>
      <Elements stripe={stripePromise} options={{ clientSecret: ready.client_secret }}>
        <CheckoutForm returnPath={`/don-hang/${quotationId}`} />
      </Elements>
    </div>
  );
}
