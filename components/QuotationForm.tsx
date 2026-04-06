"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import type { CountryCode, Quotation } from "@/services/types";

type Line = {
  product_name: string;
  product_url: string;
  note: string;
  quantity: number;
};

const emptyLine = (): Line => ({
  product_name: "",
  product_url: "",
  note: "",
  quantity: 1,
});

export default function QuotationForm() {
  const router = useRouter();
  const [country, setCountry] = useState<CountryCode>("US");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<Line[]>([emptyLine()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateLine = (i: number, patch: Partial<Line>) => {
    setLines((prev) => prev.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  };

  const addLine = () => setLines((prev) => [...prev, emptyLine()]);
  const removeLine = (i: number) =>
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((_, j) => j !== i)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone || null,
        country,
        notes: notes || null,
        items: lines.map((l) => ({
          product_name: l.product_name,
          product_url: l.product_url || null,
          quantity: l.quantity,
          note: l.note || null,
        })),
      };
      const { data } = await api.post<Quotation>("/quotations", payload);
      router.push(`/don-hang/${data.id}`);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? String((err as { response?: { data?: unknown } }).response?.data)
          : "Không gửi được đơn. Kiểm tra backend đang chạy.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Họ tên *
          <input
            required
            className="mt-1 w-full rounded border border-[var(--bn-border)] bg-white px-3 py-2 text-[var(--bn-ink)]"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </label>
        <label className="block text-sm font-medium">
          Email *
          <input
            required
            type="email"
            className="mt-1 w-full rounded border border-[var(--bn-border)] bg-white px-3 py-2"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
        </label>
        <label className="block text-sm font-medium sm:col-span-2">
          Điện thoại
          <input
            className="mt-1 w-full rounded border border-[var(--bn-border)] bg-white px-3 py-2"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="Tùy chọn"
          />
        </label>
        <label className="block text-sm font-medium sm:col-span-2">
          Mua từ quốc gia *
          <select
            className="mt-1 w-full rounded border border-[var(--bn-border)] bg-white px-3 py-2"
            value={country}
            onChange={(e) => setCountry(e.target.value as CountryCode)}
          >
            <option value="US">Hoa Kỳ (US)</option>
            <option value="ES">Tây Ban Nha (ES)</option>
          </select>
        </label>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">Món hàng cần mua *</span>
          <button
            type="button"
            onClick={addLine}
            className="text-sm text-[var(--bn-primary)] hover:underline"
          >
            + Thêm dòng
          </button>
        </div>
        <div className="space-y-4">
          {lines.map((line, i) => (
            <div
              key={i}
              className="rounded-lg border border-[var(--bn-border)] bg-[var(--bn-surface)] p-4"
            >
              <div className="mb-2 flex justify-between">
                <span className="text-xs font-semibold text-[var(--bn-muted)]">#{i + 1}</span>
                {lines.length > 1 && (
                  <button
                    type="button"
                    className="text-xs text-red-600 hover:underline"
                    onClick={() => removeLine(i)}
                  >
                    Xóa
                  </button>
                )}
              </div>
              <input
                required
                placeholder="Tên / mô tả sản phẩm"
                className="mb-2 w-full rounded border border-[var(--bn-border)] px-3 py-2 text-sm"
                value={line.product_name}
                onChange={(e) => updateLine(i, { product_name: e.target.value })}
              />
              <input
                placeholder="Link sản phẩm (Amazon, v.v.)"
                className="mb-2 w-full rounded border border-[var(--bn-border)] px-3 py-2 text-sm"
                value={line.product_url}
                onChange={(e) => updateLine(i, { product_url: e.target.value })}
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  className="w-24 rounded border border-[var(--bn-border)] px-3 py-2 text-sm"
                  value={line.quantity}
                  onChange={(e) => updateLine(i, { quantity: Number(e.target.value) || 1 })}
                />
                <input
                  placeholder="Ghi chú"
                  className="min-w-0 flex-1 rounded border border-[var(--bn-border)] px-3 py-2 text-sm"
                  value={line.note}
                  onChange={(e) => updateLine(i, { note: e.target.value })}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <label className="block text-sm font-medium">
        Ghi chú thêm cho đơn
        <textarea
          className="mt-1 w-full rounded border border-[var(--bn-border)] bg-white px-3 py-2"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </label>

      {error && (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-[var(--bn-primary)] py-3 text-sm font-semibold text-white shadow hover:opacity-95 disabled:opacity-60"
      >
        {submitting ? "Đang gửi…" : "Gửi đơn & nhận báo giá demo"}
      </button>
      <p className="text-center text-xs text-[var(--bn-muted)]">
        Bản demo: hệ thống tự tính giá mẫu (VND). Thực tế cần người mua hộ xác nhận.
      </p>
    </form>
  );
}
