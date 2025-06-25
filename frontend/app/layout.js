import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SOMPS",
  description: "Summer Of Making Projects Search engine",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster
          position="bottom-left"
          toastOptions={{
            duration: 2000,
            style: {
              borderRadius: '10px',
              border: "2px solid white",
              borderColor: "#fff5",
              background: '#000',
              color: '#fff',
            },
          }}
          containerStyle={{
            top: 8,
            right: 8,
            maxHeight: "calc(100vh - 16px)",
            overflow: "hidden",
          }}
          gutter={8}
        />
        {children}
      </body>
    </html>
  );
}
