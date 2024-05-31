import type { Metadata } from "next";
import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import styles from "./main.module.css";
import NoSSR from "@/utils/nossr";
import * as CONSTANT from "@/data/constants";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	description: CONSTANT.DESCRIPTION,
	title: CONSTANT.NAME,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<noscript>
					JavaScript must be enabled to run {CONSTANT.NAME}
				</noscript>
			</head>
			<body className={`${inter.className} ${styles.body}`}>
				<NoSSR>{children}</NoSSR>
			</body>
		</html>
	);
}
