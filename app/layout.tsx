import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

//Toastify Import
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SpaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DotSys",
  description: "Implementing an Encode Workshop for Dapp Login",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-bg text-white">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
      </head>
      <body className={SpaceGrotesk.className}>{children}</body>
      <ToastContainer 
				position="top-center"
				autoClose={4999}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				toastStyle={{ backgroundColor: "#1e2b4a" }}
				theme="dark"
			/>
    </html>
  );
}
