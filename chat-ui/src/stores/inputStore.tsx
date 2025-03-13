import { create } from "zustand";

interface InputState {
	input: string;
	setInput: (input: string) => void;
	clearInput: () => void;
}

export const useInputStore = create<InputState>((set) => ({
	input: "",
	setInput: (input: string) => set({ input }),
	clearInput: () => set({ input: "" }),
}));
