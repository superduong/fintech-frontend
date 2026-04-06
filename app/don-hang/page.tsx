import Link from "next/link";
import type { Quotation } from "@/services/types";
import { formatVnd } from "@/lib/format";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

async function fetchQuotations(): Promise<Quotation[]> {
  const res = await fetch(`${API_BASE}/quotations`, { cache: "no-store" });
  if (!res.ok) throw new Error("fetch failed");
  return res.json() as Promise<Quotation[]>;
}

const statusLabel: Record<string, string> = {
  quoted: "Đã báo giá",
  payment_processing: "Đang TT",
  paid: "Đã thanh toán",
  payment_failed: "TT thất bại",
  refunded: "Đã hoàn tiền",
  processing: "Đang xử lý",
  completed: "Hoàn tất",
};

export default async function DonHangPage() {
  let rows: Quotation[] = [];
  let err: string | null = null;
  try {
    rows = await fetchQuotations();
  } catch {
    err = "Không tải được danh sách. Kiểm tra API (uvicorn) đang chạy.";
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold">Đơn của tôi</h1>
      <p className="mb-6 text-[var(--bn-muted)]">Các đơn báo giá / mua hộ bạn đã tạo.</p>

      {err && (
        <p className="mb-6 rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {err}
        </p>
      )}

      {!err && rows.length === 0 && (
        <p className="text-[var(--bn-muted)]">
          Chưa có đơn nào.{" "}
          <Link href="/tao-don" className="font-medium text-[var(--bn-primary)] hover:underline">
            Tạo đơn báo giá
          </Link>
        </p>
      )}

      <ul className="space-y-4">
        {rows.map((q) => (
          <li key={q.id}>
            <Link
              href={`/don-hang/${q.id}`}
              className="block rounded-xl border border-[var(--bn-border)] bg-[var(--bn-surface)] p-5 transition hover:border-[var(--bn-primary)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-[var(--bn-ink)]">{q.customer_name}</p>
                  <p className="text-sm text-[var(--bn-muted)]">
                    {q.country === "US" ? "🇺🇸 Mỹ" : "🇪🇸 Tây Ban Nha"} · {q.customer_email}
                  </p>
                </div>
                <span className="rounded-full bg-[var(--bn-chip)] px-3 py-1 text-xs font-medium text-[var(--bn-ink)]">
                  {statusLabel[q.status] ?? q.status}
                </span>
              </div>
              <p className="mt-3 text-lg font-semibold text-[var(--bn-primary)]">
                {formatVnd(q.total_vnd)}
              </p>
              <p className="mt-1 text-xs text-[var(--bn-muted)]">
                {new Date(q.created_at).toLocaleString("vi-VN")}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
