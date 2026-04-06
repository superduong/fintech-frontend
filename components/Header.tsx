import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-[var(--bn-border)] bg-[var(--bn-surface)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-[var(--bn-primary)]">
          BuyNgon<span className="text-[var(--bn-muted)]">Clone</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium">
          <Link href="/" className="hover:text-[var(--bn-primary)]">
            Trang chủ
          </Link>
          <Link href="/tao-don" className="hover:text-[var(--bn-primary)]">
            Tạo đơn báo giá
          </Link>
          <Link href="/don-hang" className="hover:text-[var(--bn-primary)]">
            Đơn của tôi
          </Link>
        </nav>
      </div>
    </header>
  );
}
