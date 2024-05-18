"use client";

import ValueInput from "../inputs/valueinput";
import Suggestions from "../inputs/inputSuggestions";
import CheckboxInput from "../inputs/checkboxinput";
import INPUT_PRESETS from "@/data/consoleInfo";
import { Spec } from "immutability-helper";
import { InfoFile } from "@/data/types";

export default function SkinInfoWindow(args: {
	infoFile: InfoFile;
	setInfoFile: (stateUpdate: Spec<InfoFile, never>) => void;
}) {
	return (
		<div>
			<ValueInput
				context={"-1"}
				label="Name"
				onChange={(val: string) => {
					args.setInfoFile({ name: { $set: val } });
				}}
				value={args.infoFile.name ? args.infoFile.name : ""}
			/>
			<ValueInput
				context={"-1"}
				label="ID"
				onChange={(val: string) => {
					args.setInfoFile({ identifier: { $set: val } });
				}}
				value={args.infoFile.identifier ? args.infoFile.identifier : ""}
			/>

			<Suggestions
				id={"gameTypeIdentifier"}
				values={Object.keys(INPUT_PRESETS)}
			/>
			<ValueInput
				context={"-1"}
				label="Game Type ID"
				onChange={(val: string) => {
					args.setInfoFile({ gameTypeIdentifier: { $set: val } });
				}}
				suggestionsId="gameTypeIdentifier"
				value={
					args.infoFile.gameTypeIdentifier
						? args.infoFile.gameTypeIdentifier
						: ""
				}
			/>

			<CheckboxInput
				label="Debug"
				onChange={(val: boolean) => {
					args.setInfoFile({ debug: { $set: val } });
				}}
				value={args.infoFile.debug}
			/>
		</div>
	);
}
