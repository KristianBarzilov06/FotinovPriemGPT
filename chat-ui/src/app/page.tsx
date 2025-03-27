"use client";
import ChatBoxInput from "@/components/ChatBoxInput";
import InfoBoxes from "@/components/InfoBoxes";
import PredefinedQuestions from "@/components/PredefinedQuestions";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/chatStore";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

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

	useEffect(() => {
		if (setFetchPath) setFetchPath("http://localhost:8000/ask");
	}, [setFetchPath]);

	// Prefetch the page on hover
	const prefetchPage = () => {
		const link = document.createElement("link");
		link.rel = "prefetch";
		link.href = window.location.href;
		document.head.appendChild(link);
	};

	// Auto-scroll to bottom when messages change or when loading
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const scrollToBottom = () => {
			const scrollContainer = document.querySelector(
				"[data-radix-scroll-area-viewport]",
			);
			if (scrollContainer) {
				scrollContainer.scrollTo({
					top: scrollContainer.scrollHeight,
					behavior: "smooth",
				});
			}
		};

		// Initial scroll
		scrollToBottom();

		// Add a small delay to ensure content is rendered
		const timeoutId = setTimeout(scrollToBottom, 100);

		return () => clearTimeout(timeoutId);
	}, [messages, loading]);

	return (
		<div className="h-screen max-h-screen mx-auto flex flex-col items-center w-full relative px-2 sm:px-4">
			<AnimatePresence mode="sync">
				{messages.length >= 1 && (
					<motion.div
						key={"new-chat"}
						initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
						animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
						exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
						className="fixed top-2 sm:top-4 right-2 sm:right-4 z-50"
					>
						<Button
							variant="outline"
							onClick={() => {
								window.location.reload();
							}}
							onMouseEnter={prefetchPage}
							className="flex items-center gap-2 cursor-pointer text-sm sm:text-base"
						>
							<PlusIcon />
							Нов Чат
						</Button>
					</motion.div>
				)}
				{messages.length <= 0 ? (
					<motion.div
						key={"start-page"}
						initial={{ opacity: 0, filter: "blur(10px)" }}
						animate={{ opacity: 1, filter: "blur(0px)" }}
						exit={{ opacity: 0, filter: "blur(10px)" }}
						className="flex flex-col items-center justify-center flex-grow w-full"
					>
						<motion.div
							initial={{
								filter: "blur(10px)",
								scale: 0.5,
								opacity: 0,
							}}
							animate={{
								filter: "blur(0px)",
								scale: 1,
								opacity: 1,
							}}
							className="flex flex-col items-center mt-8 sm:mt-16"
						>
							<Image
								alt="FotinovGPT"
								src="/logo.png"
								width={150}
								height={150}
								className="sm:w-[200px] sm:h-[200px]"
							/>

							<InfoBoxes />
						</motion.div>

						{/* Predefined Questions */}
						<motion.div
							initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
							animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
							className="absolute bottom-16 sm:bottom-20 w-full flex justify-center px-2 sm:px-4"
						>
							<PredefinedQuestions questions={PREDEFINED_QUESTIONS} />
						</motion.div>
					</motion.div>
				) : (
					<motion.div
						key={"chat"}
						initial={{ opacity: 0, filter: "blur(10px)" }}
						animate={{ opacity: 1, filter: "blur(0px)" }}
						exit={{ opacity: 0, filter: "blur(10px)" }}
						className="w-full max-w-4xl mx-auto relative flex flex-col h-full"
					>
						<ScrollArea
							className="flex-1 flex flex-col !gap-4 w-full relative px-2 sm:px-4"
							ref={scrollAreaRef}
						>
							<ScrollBar />
							<div className="flex flex-col gap-4">
								<AnimatePresence mode="popLayout">
									{messages.map((msg, idx) => (
										<motion.div
											initial={{
												filter: "blur(10px)",
												opacity: 0,
												y: 20,
												scale: 0.8,
											}}
											animate={{
												filter: "blur(0px)",
												opacity: 1,
												y: 0,
												scale: 1,
											}}
											exit={{
												filter: "blur(10px)",
												opacity: 0,
												y: -20,
												scale: 0.8,
											}}
											layout
											key={`msg-${idx}-${msg.role}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`}
											className={`p-3 sm:p-4 rounded-2xl max-w-[85%] sm:max-w-sm my-4 sm:my-6 w-fit ${
												msg.role === "user"
													? "bg-primary text-primary-foreground ml-auto"
													: "bg-secondary text-secondary-foreground mr-auto"
											}`}
										>
											<h1 className="text-base sm:text-lg">{msg.content}</h1>
										</motion.div>
									))}
								</AnimatePresence>
								{loading && (
									<motion.div
										layout
										initial={{ opacity: 0.4, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.8 }}
										transition={{
											repeatType: "reverse",
											repeat: Number.POSITIVE_INFINITY,
											ease: "easeInOut",
											duration: 0.7,
										}}
										className="bg-primary h-8 sm:h-10 w-8 sm:w-10 rounded-full self-start animate-pulse"
									/>
								)}
							</div>
							<div className="h-32 sm:h-40" />
						</ScrollArea>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Chat Input Container */}
			<motion.div
				initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
				animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
				className="fixed bottom-0 left-0 right-0 w-full px-2 sm:px-4 pb-2 sm:pb-4 bg-background/80 backdrop-blur-sm border-t"
			>
				<div className="w-full max-w-2xl mx-auto">
					<ChatBoxInput />
				</div>
			</motion.div>
		</div>
	);
}
