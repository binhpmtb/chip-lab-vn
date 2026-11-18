import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "B CH\\P",
  description:
    "Từ bit đầu tiên đến RTL. Học, mô phỏng Verilog và tổng hợp mạch ngay trong trình duyệt.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}


