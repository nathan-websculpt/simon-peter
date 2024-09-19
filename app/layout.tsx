import { GeistSans } from "geist/font/sans";
import "./globals.css";

// const defaultUrl = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : "http://localhost:3000";

const defaultUrl = "https://thekjvbible.vercel.app";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "KJV Bible",
  description:
    "Read the Bible and learn more with a set of powerful search tools for the KJV Bible.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-primary text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          {children}
        </main>
      </body>
    </html>
  );
}
