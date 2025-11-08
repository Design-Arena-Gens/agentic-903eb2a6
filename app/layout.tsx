export const metadata = {
  title: "Zero Lag MACD Enhanced",
  description: "Interactive demo of Zero Lag MACD Enhanced indicator"
};

import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
