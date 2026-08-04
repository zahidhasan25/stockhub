import "./globals.css";
import { AuthProvider } from "@/lib/authContext";

export const metadata = {
  title: "StockHub — Stock Photos, Videos & Vectors",
  description: "A marketplace for photos, videos, and vector art from creators worldwide.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
