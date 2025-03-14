"use client";
import ChatBoxInput from "@/components/ChatBoxInput";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/chatStore";
import { motion } from "motion/react";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
	const { messages, setFetchPath, loading } = useChatStore();
	useEffect(() => {
		if (setFetchPath) setFetchPath("http://localhost:8000/ask");
	}, [setFetchPath]);

	return (
		<div className="h-screen max-h-screen mx-auto flex flex-col  items-center w-full  relative">
			{messages.length <= 0 && (
				<motion.div
					initial={{
						filter: "blur(10px)",
						scale: 0.8,
					}}
					animate={{
						filter: ["blur(0px)"],
						scale: 1,
					}}
					transition={{
						duration: 0.5,
					}}
					className="flex flex-col justify-center my-auto"
				>
					<Image alt="FotinovGPT" src="/logo.png" width={200} height={200} />
				</motion.div>
			)}

			{messages.length >= 1 && (
				<ScrollArea className="flex flex-col !gap-4 max-w-7xl w-full h-full">
					<ScrollBar />
					{messages.map((msg, idx) => (
						<motion.div
							initial={{
								filter: "blur(10px)",
								opacity: 0,
								y: 20,
							}}
							animate={{
								filter: "blur(0px)",
								opacity: 1,
								y: 0,
							}}
							layout
							key={idx}
							className={`p-4 rounded-2xl max-w-sm my-6 w-fit ${
								msg.role === "user"
									? "bg-primary text-primary-foreground ml-auto"
									: "bg-secondary text-secondary-foreground mr-auto"
							}`}
						>
							<h1 className="text-lg">{msg.content}</h1>
						</motion.div>
					))}
					{loading && (
						<div className="animate-pulse bg-primary h-10 w-10 rounded-full self-center"></div>
					)}

					<div className="h-16" />
				</ScrollArea>
			)}
			<ChatBoxInput />
		</div>
	);
}
