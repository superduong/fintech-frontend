"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/services/api";

type Props = {
  quotationId: string;
  /** Sau thanh toán thất bại, mỗi lần thử lại cần key mới (chuẩn fintech retry). */
  quotationStatus?: string;
  disabled?: boolean;
};

function idempotencyKeyForPay(quotationId: string, quotationStatus: string | undefined): string {
  if (quotationStatus === "payment_failed") {
    return crypto.randomUUID();
  }
  if (typeof window === "undefined") return crypto.randomUUID();
  const k = `idem_pay_${quotationId}`;
  let v = sessionStorage.getItem(k);
  if (!v) {
    v = crypto.randomUUID();
    sessionStorage.setItem(k, v);
  }
  return v;
}

export default function PayButton({ quotationId, quotationStatus, disabled }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onPay = async () => {
    setLoading(true);
    try {
      await api.post(`/quotations/${quotationId}/pay`, null, {
        headers: {
          "Idempotency-Key": idempotencyKeyForPay(quotationId, quotationStatus),
        },
      });
      router.refresh();
    } catch {
      alert("Thanh toán demo thất bại. Thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={onPay}
      className="rounded-lg bg-[var(--bn-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-50"
    >
      {loading ? "Đang xử lý…" : "Thanh toán demo"}
    </button>
  );
}
