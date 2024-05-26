"use client";
import { default as updateHelper, Spec } from "immutability-helper";

export interface Preferences {
	readonly theme: Theme | null;
	readonly colorScheme: ColorScheme;
}

export enum Theme {
	DARK = "dark",
	LIGHT = "light",
}

export enum ColorScheme {
	DEFAULT = "default",
}

const defaultPreferences: Preferences = {
	theme: null,
	colorScheme: ColorScheme.DEFAULT,
};

let currentPreferences: Preferences = defaultPreferences;

export const CURRENT: Preferences = currentPreferences;

export const updatePreferences: (update: Spec<Preferences, never>) => void = (
	update: Spec<Preferences, never>,
) => {
	currentPreferences = updateHelper(currentPreferences, update);
	localStorage.setItem("preferences", JSON.stringify(currentPreferences));
};

export const readPreferences: () => void = () => {
	const prefStr = localStorage.getItem("preferences");
	if (prefStr !== null) {
		try {
			currentPreferences = JSON.parse(prefStr);
			console.log(currentPreferences);
		} catch (e) {
			console.error("Unable to read preferences!", e);
			currentPreferences = structuredClone(defaultPreferences);
		}
	} else {
		currentPreferences = structuredClone(defaultPreferences);
	}
};
