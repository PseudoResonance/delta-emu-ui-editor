"use client";

const suffix: string[] = [];

export const getReactProps = (o: HTMLElement) => {
	if (suffix.length === 0) {
		const key = Object.keys(o).find((k) => k.startsWith("__reactProps"));
		if (key) {
			suffix[0] = key.slice(12);
		}
	}
	return suffix.length > 0
		? ((o as unknown as Record<string, never>)[
				`__reactProps${suffix[0]}`
			] as Record<string, never>)
		: null;
};

export const getReactFiber = (o: HTMLElement) => {
	if (suffix.length === 0) {
		const key = Object.keys(o).find((k) => k.startsWith("__reactFiber"));
		if (key) {
			suffix[0] = key.slice(12);
		}
	}
	return suffix.length > 0
		? ((o as unknown as Record<string, never>)[
				`__reactFiber${suffix[0]}`
			] as Record<string, never>)
		: null;
};
