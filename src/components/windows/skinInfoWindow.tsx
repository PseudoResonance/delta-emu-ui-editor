"use client";

import ValueInput from "../inputs/valueinput";
import Suggestions from "../inputs/inputSuggestions";
import CheckboxInput from "../inputs/checkbox";
import INPUT_PRESETS from "@/data/consoleInfo";
import { Spec } from "immutability-helper";
import { InfoFile } from "@/data/types";
import InputGrid from "../inputGrid";

export default function SkinInfoWindow(args: {
	infoFile: InfoFile;
	setInfoFile: (stateUpdate: Spec<InfoFile, never>) => void;
}) {
	return (
		<InputGrid
			style={{
				gridTemplateColumns: "[start] 1fr [label] 1fr [end]",
			}}
		>
			<Suggestions
				id={"gameTypeIdentifier"}
				values={Object.keys(INPUT_PRESETS)}
			/>
			<ValueInput
				context={"-1"}
				label="Skin Name"
				onChange={(val: string) => {
					args.setInfoFile({ name: { $set: val } });
				}}
				style={{ gridColumn: "start / end" }}
				value={args.infoFile.name ? args.infoFile.name : ""}
			/>
			<ValueInput
				context={"-1"}
				label="Skin ID"
				onChange={(val: string) => {
					args.setInfoFile({ identifier: { $set: val } });
				}}
				style={{ gridColumn: "start / end" }}
				value={args.infoFile.identifier ? args.infoFile.identifier : ""}
			/>

			<ValueInput
				context={"-1"}
				label="Emulator Type ID"
				onChange={(val: string) => {
					args.setInfoFile({ gameTypeIdentifier: { $set: val } });
				}}
				style={{ gridColumn: "start / end" }}
				suggestionsId="gameTypeIdentifier"
				value={
					args.infoFile.gameTypeIdentifier
						? args.infoFile.gameTypeIdentifier
						: ""
				}
			/>

			<CheckboxInput
				onChange={(val: boolean) => {
					args.setInfoFile({ debug: { $set: val } });
				}}
				style={{ gridColumn: "start / end" }}
				value={args.infoFile.debug}
			>
				Show Debug
			</CheckboxInput>
		</InputGrid>
	);
}
