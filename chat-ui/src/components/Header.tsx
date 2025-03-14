"use client";
import { useChatStore } from "@/stores/chatStore";
import { motion } from "motion/react";
import Image from "next/image";
import React from "react";

export default function Header() {
	const { messages } = useChatStore();

	return (
		<motion.div
			animate={{
				opacity: messages.length < 1 ? 0 : 1,
				y: messages.length < 1 ? -30 : 0,
			}}
			className="absolute top-0 w-full h-16 px-4 py-4"
		>
			<Image
				src="/logo.png"
				alt="FotinovGPT"
				className="size-14 aspect-square"
				width={100}
				height={100}
			/>
		</motion.div>
	);
}
