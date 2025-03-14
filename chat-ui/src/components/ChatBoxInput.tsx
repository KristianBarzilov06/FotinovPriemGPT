"use client";
import { useInputStore } from "@/stores/inputStore";
import type React from "react";
import { Input } from "./ui/input";
import { motion, type Variants } from "motion/react";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import type { KeyboardEventHandler } from "react";
import { useChatGPT } from "@/hooks/useChatGPT";
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
			x: 25,
			width: 0,
			zIndex: -1,
		},
		visible: {
			opacity: 1,
			filter: "blur(0px)",
			scale: 1,
			x: 0,
			zIndex: -1,
			width: "auto",
		},
	};

	const sendMessage = async () => {
		console.log(input);
		onSend({
			content: input,
			role: ChatRole.User,
		});

		clearInput();
	};

	return (
		<>
			<motion.div
				initial={{ opacity: 0, scale: 0.2, y: 150, filter: "blur(10px)" }}
				animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
				className="absolute bottom-4 w-full mx-auto flex justify-center items-center max-w-lg"
			>
				<Input
					className="w-[100%] mx-auto h-10 text-xl z-50 !bg-background !border-primary "
					value={input}
					onChange={(e) => setInput(e.target.value)}
					multiple
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							sendMessage();
						}
					}}
				/>
				<motion.div
					variants={variants}
					className="flex items-center z-10"
					initial="hidden"
					animate={input.length >= 1 ? "visible" : "hidden"}
				>
					<Button size={"icon"} className="ml-2" onClick={sendMessage}>
						<Send />
					</Button>
				</motion.div>
			</motion.div>
		</>
	);
}
