"use client";

export interface State {
	readonly theme: Theme;
	readonly colorScheme: ColorScheme;
}

export enum Theme {
	DEFAULT = "DEFAULT",
	LIGHT = "LIGHT",
	DARK = "DARK",
}

export enum ColorScheme {
	DEFAULT = "DEFAULT",
	DEUTERANOMALY = "DEUTERANOMALY",
	PROTANOMALY = "PROTANOMALY",
	TRITANOMALY = "TRITANOMALY",
}

export const DEFAULT: State = {
	theme: Theme.DEFAULT,
	colorScheme: ColorScheme.DEFAULT,
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
