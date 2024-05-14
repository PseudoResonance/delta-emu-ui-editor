import type { Metadata } from "next";
import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import styles from "./main.module.css";
import NoSSR from "@/utils/nossr";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Delta Emulator UI Designer",
	description: "Visual UI designer for Delta Emulator",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.className} ${styles.body}`}>
				<NoSSR>{children}</NoSSR>
			</body>
		</html>
	);
}
