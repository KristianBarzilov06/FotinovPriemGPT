import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { MotionConfig } from "motion/react";

const montserrat = Montserrat({
	variable: "--font-monsterrat",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	icons: "/logo.png",
	openGraph: {
		siteName: "FotinovGPT",
	},
	title: "FotinovGPT",
	description:
		"A chatbot for questions and information related to the school Konstantin Fotinov.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className=" ">
			<MotionConfig
				transition={{
					type: "spring",
					mass: 0.6,
					damping: 10,
					stiffness: 100,
				}}
			>
				<body className={`${montserrat.variable} antialiased`}>{children}</body>
			</MotionConfig>
		</html>
	);
}
