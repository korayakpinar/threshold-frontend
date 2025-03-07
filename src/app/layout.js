import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Project Eldergleam",
  description: "You want to protect your transaction? Jump in!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.className} bg-white text-black`}>{children}</body>
    </html>
  );
}