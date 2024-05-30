"use client";

import * as Preferences from "@/preferences/preferences";
import { Spec } from "immutability-helper";
import DropdownInput from "../inputs/dropdown";

export default function PreferencesWindow(args: {
	preferences: Preferences.State;
	setPreferences: (update: Spec<Preferences.State, never>) => void;
}) {
	return (
		<div>
			<h2>Preferences</h2>
			<hr />
			<DropdownInput
				label="Theme"
				onChange={(val: string) => {
					args.setPreferences({
						theme: {
							$set: Preferences.Theme[
								val as keyof typeof Preferences.Theme
							],
						},
					});
				}}
				value={args.preferences.theme}
				values={
					{
						[Preferences.Theme.DEFAULT]: "System Default",
						[Preferences.Theme.LIGHT]: "Light",
						[Preferences.Theme.DARK]: "Dark",
					} as { [key in Preferences.Theme]: string }
				}
			/>
			<DropdownInput
				label="Color Scheme"
				onChange={(val: string) => {
					args.setPreferences({
						colorScheme: {
							$set: Preferences.ColorScheme[
								val as keyof typeof Preferences.ColorScheme
							],
						},
					});
				}}
				value={args.preferences.colorScheme}
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
