"use client";
import { motion } from "motion/react";
import { Card, CardContent } from "./ui/card";
import { useChatStore } from "@/stores/chatStore";
import { ChatRole } from "@/models/interfaces";
import {
	Newspaper,
	BookOpen,
	GraduationCap,
	Calendar,
	Bell,
	School,
	ClipboardList,
} from "lucide-react";
import Link from "next/link";

interface InfoBoxProps {
	title: string;
	description: string;
	icon: React.ReactNode;
	onClick?: () => void;
	index: number;
}

const InfoBox = ({
	title,
	description,
	icon,
	onClick,
	index,
}: InfoBoxProps) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
			animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
			transition={{
				delay: index * 0.15 + 0.3,

				mass: 0.5,
				damping: 10,
				stiffness: 100,
				type: "spring",
			}}
		>
			<Card
				className="cursor-pointer hover:bg-secondary/20 hover:scale-105 hover:shadow-md hover:border-primary/30 transition-all duration-300 ease-out"
				onClick={onClick}
			>
				<CardContent className="flex items-center gap-4 p-4">
					<div className="text-primary">{icon}</div>
					<div>
						<h3 className="font-semibold">{title}</h3>
						<p className="text-sm text-muted-foreground">{description}</p>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default function InfoBoxes() {
	const { onSend } = useChatStore();

	const infoBoxes = [
		{
			id: "news",
			title: "Новини",
			description: "Последни новини и събития",
			icon: <Newspaper size={24} />,
			link: "https://pgee-bourgas.com/%D0%BD%D0%BE%D0%B2%D0%B8%D0%BD%D0%B8-1.html",
		},
		{
			id: "e-school",
			title: "Електронен дневник",
			description: "Достъп до електронния дневник",
			icon: <BookOpen size={24} />,
			link: "https://neispuo.mon.bg/",
		},
		{
			id: "exams",
			title: "За ПГЕЕ",
			description: "Информация за изпити и прием",
			icon: <GraduationCap size={24} />,
			link: "https://pgee-bourgas.com/%D0%B7%D0%B0_%D0%BD%D0%B0%D1%81-680.html",
		},
		{
			id: "schedule",
			title: "Електронно училище",
			description: "Достъп до учебни материали",
			icon: <ClipboardList size={24} />,
			link: "https://pgeeburgas.org/",
		},
	];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-2xl mx-auto mt-4 sm:mt-6 px-2 sm:px-4">
			{infoBoxes.map((box, index) => (
				<Link key={box.link} href={box.link} prefetch target="_blank">
					<InfoBox
						key={box.id}
						title={box.title}
						description={box.description}
						icon={box.icon}
						index={index}
					/>
				</Link>
			))}
		</div>
	);
}
