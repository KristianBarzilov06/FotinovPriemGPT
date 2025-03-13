import { useEffect } from "react";
import { create } from "zustand";

import ClipboardJS from "clipboard";
import { throttle } from "lodash-es";
import {
	type ChatGPTProps,
	ChatRole,
	type ChatMessage,
} from "@/models/interfaces";

const scrollDown = throttle(
	() => {
		window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
	},
	300,
	{
		leading: true,
		trailing: false,
	},
);

const requestMessage = async (
	url: string,
	messages: ChatMessage[],
	controller: AbortController | null,
) => {
	const jsonString = JSON.stringify({
		question: messages[messages.length - 1].content,
	});

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: jsonString,
		signal: controller?.signal,
	});

	if (!response.ok) {
		throw new Error(response.statusText);
	}
	const data = response.body;

	console.log(data);

	if (!data) {
		throw new Error("No data");
	}

	return data.getReader();
};

// Define the chat store interface
interface ChatState {
	messages: ChatMessage[];
	disabled: boolean;
	loading: boolean;
	currentMessage: string;
	controller: AbortController | null;
	fetchPath: string;
}

interface ChatActions {
	setFetchPath: (path: string) => void;
	archiveCurrentMessage: () => void;
	fetchMessage: (messages: ChatMessage[]) => Promise<void>;
	onStop: () => void;
	onSend: (message: ChatMessage) => void;
	onClear: () => void;
	setupClipboard: () => void;
}

// Create the Zustand store
export const useChatStore = create<ChatState & ChatActions>((set, get) => ({
	messages: [],
	disabled: false,
	loading: false,
	currentMessage: "",
	controller: null,
	fetchPath: "",

	setFetchPath: (path) => set({ fetchPath: path }),

	archiveCurrentMessage: () => {
		const { currentMessage } = get();
		set({ currentMessage: "", loading: false });

		if (currentMessage) {
			set((state) => ({
				messages: [
					...state.messages,
					{
						content: JSON.parse(currentMessage).response,
						role: ChatRole.Assistant,
					},
				],
			}));
			scrollDown();
		}
	},

	fetchMessage: async (messages) => {
		const { fetchPath } = get();
		try {
			set({
				currentMessage: "",
				controller: new AbortController(),
				loading: true,
			});

			const reader = await requestMessage(
				fetchPath,
				messages,
				get().controller,
			);

			const decoder = new TextDecoder("utf-8");
			let done = false;

			while (!done) {
				const { value, done: readerDone } = await reader.read();
				if (value) {
					const char = decoder.decode(value);
					if (char === "\n" && get().currentMessage.endsWith("\n")) {
						continue;
					}
					if (char) {
						set((state) => ({ currentMessage: state.currentMessage + char }));
					}
					scrollDown();
				}
				done = readerDone;
			}

			get().archiveCurrentMessage();
		} catch (e) {
			console.error(e);
			set({ loading: false });
			return;
		}
	},

	onStop: () => {
		const { controller } = get();
		if (controller) {
			controller.abort();
			get().archiveCurrentMessage();
		}
	},

	onSend: (message) => {
		if (message.content.length <= 0) return;

		set((state) => {
			const newMessages = [...state.messages, message];
			setTimeout(() => get().fetchMessage(newMessages), 0);
			return { messages: newMessages };
		});
	},

	onClear: () => {
		set({ messages: [] });
	},

	setupClipboard: () => {
		new ClipboardJS(".chat-wrapper .copy-btn");
	},
}));

// Keep for backward compatibility
export const useChatGPT = (props: ChatGPTProps) => {
	const { fetchPath } = props;
	const store = useChatStore();

	useEffect(() => {
		store.setupClipboard();
		store.setFetchPath(fetchPath);
	}, [fetchPath, store.setFetchPath, store.setupClipboard]);

	return {
		loading: store.loading,
		disabled: store.disabled,
		messages: store.messages,
		currentMessage: { current: store.currentMessage },
		onSend: store.onSend,
		onClear: store.onClear,
		onStop: store.onStop,
	};
};
