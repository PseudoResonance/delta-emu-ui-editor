"use client";

import * as Preferences from "@/preferences/preferences";
import DropdownInput from "../inputs/dropdowninput";
import update, { Spec } from "immutability-helper";
import { useState } from "react";

export default function PreferencesWindow(args: {
	preferences: Preferences.State;
	setPreferences: (update: Spec<Preferences.State, never>) => void;
}) {
	const [prefs, setPrefs] = useState<Preferences.State>(args.preferences);

	const updatePrefs: (stateUpdate: Spec<Preferences.State, never>) => void = (
		stateUpdate: Spec<Preferences.State, never>,
	) => {
		setPrefs((state: Preferences.State) => update(state, stateUpdate));
		args.setPreferences((state: Preferences.State) =>
			update(state, stateUpdate),
		);
	};
	return (
		<div
			style={{
				minWidth: "40svw",
				minHeight: "40svh",
			}}
		>
			<h2>Preferences</h2>
			<hr />
			<DropdownInput
				elementIndex={0}
				label="Theme"
				onChange={(val: string) => {
					updatePrefs({
						theme: {
							$set: Preferences.Theme[
								val as keyof typeof Preferences.Theme
							],
						},
					});
				}}
				value={prefs.theme}
				values={
					{
						[Preferences.Theme.DEFAULT]: "Default",
						[Preferences.Theme.LIGHT]: "Light",
						[Preferences.Theme.DARK]: "Dark",
					} as { [key in Preferences.Theme]: string }
				}
			/>
			<DropdownInput
				elementIndex={0}
				label="Color Scheme"
				onChange={(val: string) => {
					updatePrefs({
						colorScheme: {
							$set: Preferences.ColorScheme[
								val as keyof typeof Preferences.ColorScheme
							],
						},
					});
				}}
				value={prefs.colorScheme}
				values={
					{
						[Preferences.ColorScheme.DEFAULT]: "Default",
						[Preferences.ColorScheme.DEUTERANOMALY]:
							"Deuteranomaly",
						[Preferences.ColorScheme.PROTANOMALY]: "Protanomaly",
						[Preferences.ColorScheme.TRITANOMALY]: "Tritanomaly",
					} as { [key in Preferences.ColorScheme]: string }
				}
			/>
		</div>
	);
}
