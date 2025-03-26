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
			zIndex: -1,
		},
		visible: {
			opacity: 1,
			filter: "blur(0px)",
			scale: 1,
			x: 60,
			zIndex: -1,
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
			className="w-full relative"
		>
			<Input
				className="w-full h-12 text-lg bg-background border-primary/20 px-6"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="Попитай всичко..."
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						sendMessage();
					}
				}}
			/>
			<motion.div
				variants={variants}
				className="absolute right-3 top-1/2 -translate-y-1/2"
				initial="hidden"
				animate={input.length >= 1 ? "visible" : "hidden"}
			>
				<Button size={"icon"} className="" onClick={sendMessage}>
					<Send size={18} />
				</Button>
			</motion.div>
		</motion.div>
	);
}
