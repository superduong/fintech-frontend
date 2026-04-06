import Link from "next/link";
import { notFound } from "next/navigation";
import PayButton from "@/components/PayButton";
import RefundButton from "@/components/RefundButton";
import BankTransferCard from "@/components/BankTransferCard";
import StripePaySection from "@/components/StripePaySection";
import type { BankTransferRead, Quotation } from "@/services/types";
import { formatVnd } from "@/lib/format";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

async function getQuotation(id: string): Promise<Quotation | null> {
  const res = await fetch(`${API_BASE}/quotations/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("fetch failed");
  return res.json() as Promise<Quotation>;
}

async function getBankTransfer(id: string): Promise<BankTransferRead | null> {
  const res = await fetch(`${API_BASE}/quotations/${id}/bank-transfer`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json() as Promise<BankTransferRead>;
}

const statusLabel: Record<string, string> = {
  quoted: "Đã báo giá",
  payment_processing: "Đang xử lý thanh toán",
  paid: "Đã thanh toán",
  payment_failed: "Thanh toán thất bại",
  refunded: "Đã hoàn tiền",
  processing: "Đang xử lý",
  completed: "Hoàn tất",
};

export default async function DonHangDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let q: Quotation | null = null;
  let bankTransfer: BankTransferRead | null = null;
  try {
    q = await getQuotation(id);
  } catch {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-red-700">Không kết nối được API. Hãy chạy backend (uvicorn).</p>
        <Link href="/don-hang" className="mt-4 inline-block text-[var(--bn-primary)]">
          ← Quay lại
        </Link>
      </main>
    );
  }
  if (!q) notFound();

  if (q.status === "quoted" || q.status === "payment_failed") {
    try {
      bankTransfer = await getBankTransfer(id);
    } catch {
      bankTransfer = null;
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/don-hang" className="text-sm text-[var(--bn-primary)] hover:underline">
        ← Danh sách đơn
      </Link>
      <h1 className="mt-4 text-2xl font-bold">Chi tiết đơn</h1>
      <p className="mt-1 text-sm text-[var(--bn-muted)]">Mã đơn: {q.id}</p>

      <div className="mt-6 rounded-xl border border-[var(--bn-border)] bg-[var(--bn-surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-semibold">{q.customer_name}</p>
            <p className="text-sm text-[var(--bn-muted)]">{q.customer_email}</p>
            {q.customer_phone && (
              <p className="text-sm text-[var(--bn-muted)]">{q.customer_phone}</p>
            )}
          </div>
          <span className="rounded-full bg-[var(--bn-chip)] px-3 py-1 text-xs font-medium">
            {statusLabel[q.status] ?? q.status}
          </span>
        </div>
        <p className="mt-4 text-sm">
          <span className="text-[var(--bn-muted)]">Nguồn hàng:</span>{" "}
          {q.country === "US" ? "Hoa Kỳ" : "Tây Ban Nha"}
        </p>
        {q.notes && (
          <p className="mt-2 text-sm">
            <span className="text-[var(--bn-muted)]">Ghi chú:</span> {q.notes}
          </p>
        )}
        <p className="mt-6 text-2xl font-bold text-[var(--bn-primary)]">
          Tổng: {formatVnd(q.total_vnd)}
        </p>
        {q.payment_transaction_id && (
          <p className="mt-2 text-xs text-[var(--bn-muted)]">
            Giao dịch: {q.payment_transaction_id}
            {q.payment_status && ` · ${q.payment_status}`}
          </p>
        )}
        {(q.status === "quoted" || q.status === "payment_failed") && (
          <div className="mt-6">
            <PayButton quotationId={q.id} quotationStatus={q.status} />
            <p className="mt-2 text-xs text-[var(--bn-muted)]">
              Fintech demo: header <code className="rounded bg-[var(--bn-chip)] px-1">Idempotency-Key</code>, worker
              bất đồng bộ, trạng thái có thể thất bại ngẫu nhiên — F5 để xem cập nhật.
            </p>
            {q.total_vnd != null && q.total_vnd > 0 && (
              <StripePaySection quotationId={q.id} amountVnd={q.total_vnd} />
            )}
            {bankTransfer && <BankTransferCard data={bankTransfer} />}
          </div>
        )}
        {q.status === "payment_processing" && (
          <p className="mt-6 text-sm text-amber-800">
            Đang xử lý thanh toán (queue). Làm mới trang sau vài giây.
          </p>
        )}
        {q.status === "paid" && (
          <div className="mt-6 flex flex-wrap gap-3">
            <RefundButton quotationId={q.id} />
          </div>
        )}
      </div>

      <h2 className="mb-3 mt-10 text-lg font-semibold">Chi tiết hàng</h2>
      <ul className="space-y-3">
        {q.items.map((item) => (
          <li
            key={item.id}
            className="rounded-lg border border-[var(--bn-border)] bg-white px-4 py-3"
          >
            <p className="font-medium">{item.product_name}</p>
            {item.product_url && (
              <a
                href={item.product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--bn-primary)] hover:underline"
              >
                {item.product_url}
              </a>
            )}
            <p className="mt-1 text-sm text-[var(--bn-muted)]">
              SL: {item.quantity}
              {item.note && ` · ${item.note}`}
            </p>
            <p className="mt-2 text-sm">
              Đơn giá: {formatVnd(item.unit_price_vnd)} · Dòng: {formatVnd(item.line_total_vnd)}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
