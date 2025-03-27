"use client";
import { useInputStore } from "@/stores/inputStore";
import type React from "react";
import { Input } from "./ui/input";
import { motion, type Variants } from "motion/react";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { ChatRole } from "@/models/interfaces";
import { useChatStore } from "@/stores/chatStore";

export default function ChatBoxInput() {
	const { input, setInput, clearInput } = useInputStore();
	const { onSend } = useChatStore();
	const variants: Variants = {
		hidden: {
			opacity: 0,
			filter: "blur(10px)",
			scale: 0.7,
			x: 0,
			width: 0,
			zIndex: 0,
		},
		visible: {
			opacity: 1,
			filter: "blur(0px)",
			scale: 1,
			x: 0,
			zIndex: 10,
			width: "auto",
		},
	};

	const sendMessage = async () => {
		if (input.trim().length === 0) return;

		onSend({
			content: input,
			role: ChatRole.User,
		});

		clearInput();
	};

	return (
		<motion.div
			initial={{
				y: 150,
				opacity: 0.7,
				scale: 0.8,
				filter: "blur(10px)",
			}}
			animate={{
				y: 0,
				opacity: 1,
				scale: 1,
				filter: "blur(0px)",
			}}
			transition={{
				delay: 0.8,
				type: "spring",
				mass: 0.5,
				damping: 10,
				stiffness: 100,
			}}
			className="w-full relative flex gap-2 items-end"
		>
			<Input
				className="w-full min-h-[40px] max-h-[200px] text-base sm:text-lg bg-background border-primary/20 px-4 sm:px-6 py-2 resize-none overflow-y-auto"
				value={input}
				onChange={(e) => {
					setInput(e.target.value);
					// Trigger scroll after input change
					setTimeout(() => {
						const scrollContainer = document.querySelector(
							"[data-radix-scroll-area-viewport]",
						);
						if (scrollContainer) {
							scrollContainer.scrollTo({
								top: scrollContainer.scrollHeight,
								behavior: "smooth",
							});
						}
					}, 0);
				}}
				placeholder="Попитай всичко..."
				onKeyDown={(e) => {
					if (e.key === "Enter" && !e.shiftKey) {
						e.preventDefault();
						sendMessage();
					}
				}}
				style={{
					height: "auto",
					minHeight: "40px",
					maxHeight: "200px",
				}}
			/>
			<motion.div
				variants={variants}
				className="flex-shrink-0"
				initial="hidden"
				animate={input.length >= 1 ? "visible" : "hidden"}
			>
				<Button
					size={"icon"}
					className="size-10 sm:size-11"
					onClick={sendMessage}
				>
					<Send size={18} className="sm:size-5" />
				</Button>
			</motion.div>
		</motion.div>
	);
}
