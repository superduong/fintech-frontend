"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/services/api";

type Props = {
  quotationId: string;
};

function refundIdempotencyKey(quotationId: string): string {
  if (typeof window === "undefined") return crypto.randomUUID();
  const k = `idem_refund_${quotationId}`;
  let v = sessionStorage.getItem(k);
  if (!v) {
    v = crypto.randomUUID();
    sessionStorage.setItem(k, v);
  }
  return v;
}

export default function RefundButton({ quotationId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onRefund = async () => {
    if (!confirm("Xác nhận hoàn tiền demo?")) return;
    setLoading(true);
    try {
      await api.post(`/quotations/${quotationId}/refund`, null, {
        headers: { "Idempotency-Key": refundIdempotencyKey(quotationId) },
      });
      router.refresh();
    } catch {
      alert("Hoàn tiền demo thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      disabled={loading}
      onClick={onRefund}
      className="rounded-lg border border-[var(--bn-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--bn-ink)] hover:bg-[var(--bn-surface)] disabled:opacity-50"
    >
      {loading ? "Đang xử lý…" : "Hoàn tiền demo"}
    </button>
  );
}
