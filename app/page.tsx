import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="border-b border-[var(--bn-border)] bg-gradient-to-b from-[var(--bn-hero)] to-[var(--bn-surface)] px-4 py-16 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-[var(--bn-primary)]">
          Mua hàng Mỹ · Tây Ban Nha về Việt Nam
        </p>
        <h1 className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight text-[var(--bn-ink)] sm:text-4xl">
          Bạn cần mua gì hôm nay?
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[var(--bn-muted)]">
          Bản demo kết nối bạn với luồng báo giá và đơn mua hộ — mô phỏng nghiệp vụ tương tự{" "}
          <a
            href="https://buyngon.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[var(--bn-primary)] hover:underline"
          >
            BuyNgon
          </a>
          .
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/tao-don"
            className="rounded-lg bg-[var(--bn-primary)] px-6 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-95"
          >
            Tạo đơn báo giá
          </Link>
          <Link
            href="/don-hang"
            className="rounded-lg border border-[var(--bn-border)] bg-white px-6 py-3 text-sm font-semibold text-[var(--bn-ink)] hover:bg-[var(--bn-surface)]"
          >
            Xem đơn của tôi
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-center text-xl font-bold text-[var(--bn-ink)]">
          BuyNgon hoạt động như thế nào?
        </h2>
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Điền thông tin món hàng bạn cần mua",
            "Hệ thống tạo báo giá demo (thực tế: kết nối người mua hộ)",
            "Thanh toán đơn (demo)",
            "Theo dõi trạng thái đơn",
          ].map((text, i) => (
            <li
              key={i}
              className="relative rounded-xl border border-[var(--bn-border)] bg-[var(--bn-surface)] p-5 pt-10"
            >
              <span className="absolute left-5 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bn-primary)] text-sm font-bold text-white">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-[var(--bn-ink)]">{text}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
