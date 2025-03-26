"use client";
import ChatBoxInput from "@/components/ChatBoxInput";
import InfoBoxes from "@/components/InfoBoxes";
import PredefinedQuestions from "@/components/PredefinedQuestions";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/chatStore";
import { animate } from "motion";
import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Define your predefined questions here
const PREDEFINED_QUESTIONS = [
	"Какво става когато имам 5 неизвинени отсъствия?",
	"Какви са различните специалности?",
	"Какво е балообразуването?",
	"Какви са последните постижения на ученици?",
];

export default function Home() {
	const { messages, setFetchPath, loading } = useChatStore();
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const [logoAnimationComplete, setLogoAnimationComplete] = useState(false);

	useEffect(() => {
		if (setFetchPath) setFetchPath("http://localhost:8000/ask");
	}, [setFetchPath]);

	// Auto-scroll to bottom when messages change or when loading
	useEffect(() => {
		if (scrollAreaRef.current && messages.length > 0) {
			const scrollContainer = scrollAreaRef.current.querySelector(
				"[data-radix-scroll-area-viewport]",
			);
			if (scrollContainer) {
				scrollContainer.scrollTo({
					top: scrollContainer.scrollHeight,
					behavior: "smooth",
				});
			}
		}
	}, [messages]);

	return (
		<div className="h-screen max-h-screen mx-auto flex flex-col items-center w-full relative">
			{messages.length <= 0 ? (
				<div className="flex flex-col items-center justify-center flex-grow w-full">
					<motion.div
						initial={{
							filter: "blur(10px)",
							scale: 0.5,
						}}
						animate={{
							filter: "blur(0px)",
							scale: 1,
						}}
						className="flex flex-col items-center mt-16"
					>
						<Image alt="FotinovGPT" src="/logo.png" width={200} height={200} />

						<InfoBoxes />
					</motion.div>

					{/* Predefined Questions */}
					<div className="absolute bottom-20 w-full flex justify-center">
						<PredefinedQuestions questions={PREDEFINED_QUESTIONS} />
					</div>
				</div>
			) : (
				<ScrollArea
					className="flex flex-col !gap-4 max-w-7xl w-full h-full"
					ref={scrollAreaRef}
				>
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
							key={`msg-${idx}-${msg.role}`}
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
						<div className="animate-pulse bg-primary h-10 w-10 rounded-full self-center" />
					)}

					<div className="h-24" />
				</ScrollArea>
			)}

			{/* Chat Input Container */}
			<div className="absolute bottom-0 w-full px-4 pb-4 flex flex-col items-center">
				<div className="w-full max-w-xl mx-auto">
					<ChatBoxInput />
				</div>
			</div>
		</div>
	);
}
