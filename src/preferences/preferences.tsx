"use client";

export interface State {
	readonly colorScheme: ColorScheme;
	readonly theme: Theme;
}

export enum Theme {
	DARK = "DARK",
	DEFAULT = "DEFAULT",
	LIGHT = "LIGHT",
}

export enum ColorScheme {
	DEFAULT = "DEFAULT",
	DEUTERANOMALY = "DEUTERANOMALY",
	PROTANOMALY = "PROTANOMALY",
	TRITANOMALY = "TRITANOMALY",
}

export const DEFAULT: State = {
	colorScheme: ColorScheme.DEFAULT,
	theme: Theme.DEFAULT,
};

const save: (state: State) => void = (state: State) => {
	localStorage.setItem("preferences", JSON.stringify(state));
};

const load: () => State = () => {
	const prefStr = localStorage.getItem("preferences");
	if (prefStr !== null) {
		try {
			return { ...DEFAULT, ...JSON.parse(prefStr) };
		} catch (e) {
			console.error("Unable to read preferences!", e);
			return DEFAULT;
		}
	} else {
		return DEFAULT;
	}
};

export { save, load };
