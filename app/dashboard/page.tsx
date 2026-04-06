import { redirect } from "next/navigation";

/** Đường dẫn cũ — chuyển sang luồng BuyNgon. */
export default function DashboardRedirect() {
  redirect("/don-hang");
}
