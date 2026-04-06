"use client";

import QRCode from "react-qr-code";
import type { BankTransferRead } from "@/services/types";
import { formatVnd } from "@/lib/format";

function CopyRow({
  label,
  value,
  copyValue,
  mono,
}: {
  label: string;
  value: string;
  copyValue?: string;
  mono?: boolean;
}) {
  const copy = () => {
    void navigator.clipboard.writeText(copyValue ?? value);
  };
  return (
    <div className="flex flex-col gap-1 border-b border-[var(--bn-border)] py-3 last:border-b-0">
      <span className="text-xs text-[var(--bn-muted)]">{label}</span>
      <div className="flex items-start justify-between gap-2">
        <span className={`min-w-0 flex-1 text-sm font-medium ${mono ? "font-mono text-[13px]" : ""}`}>
          {value}
        </span>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 rounded-md border border-[var(--bn-border)] bg-white px-2 py-1 text-xs text-[var(--bn-primary)] hover:bg-[var(--bn-chip)]"
        >
          Sao chép
        </button>
      </div>
    </div>
  );
}

export default function BankTransferCard({ data }: { data: BankTransferRead }) {
  if (!data.applicable) return null;

  const hasDestination =
    data.configured && data.account_no && data.beneficiary_name && data.bank_display_name;

  return (
    <section className="mt-6 rounded-xl border border-[var(--bn-border)] bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900">Thông tin thanh toán</h3>
      <p className="mt-1 text-xs text-[var(--bn-muted)]">
        Chuyển khoản theo đúng số tiền và nội dung bên dưới để đối soát tự động.
      </p>

      <div className="mt-4">
        {data.amount_vnd != null && (
          <CopyRow
            label="Số tiền (VND)"
            value={formatVnd(data.amount_vnd)}
            copyValue={String(data.amount_vnd)}
            mono
          />
        )}
        {data.transfer_content && (
          <CopyRow label="Nội dung chuyển khoản" value={data.transfer_content} mono />
        )}
      </div>

      {!data.configured && (
        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Backend chưa cấu hình VietQR: tạo <code className="font-mono">fintech_backend/.env</code> từ{" "}
          <code className="font-mono">.env.example</code>, hoặc đặt <code className="font-mono">ENVIRONMENT=development</code>{" "}
          (mặc định) để dùng STK demo tự điền; production cần{" "}
          <code className="font-mono">ENVIRONMENT=production</code> + <code className="font-mono">BANK_QR_*</code> thật.
        </p>
      )}

      {hasDestination && (
        <div className="mt-4 space-y-0 rounded-lg border border-[var(--bn-border)] px-3">
          <CopyRow label="Tên tài khoản" value={data.beneficiary_name!} />
          <CopyRow label="Số tài khoản" value={data.account_no!} mono />
          <CopyRow label="Ngân hàng" value={data.bank_display_name!} />
        </div>
      )}

      {data.emv_qr_payload && (
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="rounded-lg border border-[var(--bn-border)] bg-white p-3">
            <QRCode value={data.emv_qr_payload} size={200} level="M" />
          </div>
          <p className="text-center text-xs text-[var(--bn-muted)]">
            Quét mã bằng app ngân hàng (VietQR / Napas 247).
          </p>
          {data.amount_vnd != null && (
            <p className="text-sm font-semibold text-[var(--bn-primary)]">{formatVnd(data.amount_vnd)}</p>
          )}
        </div>
      )}
    </section>
  );
}
