"use client";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import { useChatStore } from "@/stores/chatStore";
import { ChatRole } from "@/models/interfaces";

interface QuestionProps {
	text: string;
	onClick?: () => void;
	index: number;
}

const Question = ({ text, onClick, index }: QuestionProps) => {
	return (
		<motion.div
			initial={{
				opacity: 0,
				scale: 0.8,
				y: 30,
				filter: "blur(10px)",
			}}
			animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
			transition={{
				delay: index * 0.1 + 0.5,
				type: "spring",
				mass: 0.5,
				damping: 10,
				stiffness: 100,
			}}
		>
			<Button
				variant="outline"
				className="text-sm rounded-lg cursor-pointer hover:bg-secondary/20 hover:scale-105 hover:shadow-md hover:border-primary/30 transition-all duration-300 ease-out whitespace-normal h-auto py-2 text-left"
				onClick={onClick}
			>
				{text}
			</Button>
		</motion.div>
	);
};

interface PredefinedQuestionsProps {
	questions: string[];
}

export default function PredefinedQuestions({
	questions,
}: PredefinedQuestionsProps) {
	const { onSend } = useChatStore();

	const handleQuestionClick = (question: string) => {
		onSend({
			content: question,
			role: ChatRole.User,
		});
	};

	return (
		<div className="flex flex-wrap gap-4 justify-center w-full">
			{questions.map((question, index) => (
				<Question
					key={`question-${question}`}
					text={question}
					onClick={() => handleQuestionClick(question)}
					index={index}
				/>
			))}
		</div>
	);
}
