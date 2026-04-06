import QuotationForm from "@/components/QuotationForm";

export default function TaoDonPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold text-[var(--bn-ink)]">Tạo đơn báo giá</h1>
      <p className="mb-8 text-[var(--bn-muted)]">
        Điền thông tin và món hàng bạn cần mua hộ — tương tự bước &quot;Tạo đơn&quot; trên BuyNgon.
      </p>
      <QuotationForm />
    </main>
  );
}
