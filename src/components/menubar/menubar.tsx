"use client";
import styles from "./menu.module.css";
import MenuCategory from "./menucategory";
import React, { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import MenuButton from "./menubutton";
import writeZip from "@/utils/zip/zipWrite";
import {
	Asset,
	ContextMenu,
	EmulatorElement,
	EmulatorLayout,
	InfoFile,
	ScaleData,
} from "@/data/types";
import zipRead from "@/utils/zip/zipRead";
import AboutInfo from "../popup/popups/aboutinfo";
import JSONParseError from "../popup/popups/jsonparseerror";
import ControlsInfo from "../popup/popups/controlsinfo";

export default function MenuBar(args: {
	pressedKeys: string[];
	elements: EmulatorElement[];
	layoutData: EmulatorLayout | null;
	infoFile: InfoFile;
	scale: ScaleData;
	setScale: Dispatch<SetStateAction<ScaleData>>;
	saveJSON: () => { json: string; infoFile: InfoFile };
	parseJSON: (json: Record<string, unknown>) => void;
	canUndo: boolean;
	undo: () => void;
	canRedo: boolean;
	redo: () => void;
	showPopup: (
		popup: React.JSX.Element,
		onClose: () => void,
		onAccept?: () => void,
	) => void;
	showContextMenu: ContextMenu;
	assets: Record<string, Asset> | null;
	setAssets: Dispatch<SetStateAction<Record<string, Asset> | null>>;
	getReferencedAssets: (infoFile: InfoFile) => Record<string, Asset>;
}) {
	const [isActive, setIsActive] = useState<boolean>(false);
	return (
		<div
			className={`${styles.menubar}${
				isActive ? " " + styles.active : ""
			}`}
		>
			<MenuCategory
				isActive={isActive}
				label="File"
				setIsActive={setIsActive}
				subElements={[
					<MenuButton
						key="loadskin"
						label="Load Skin"
						onClick={() => {
							setIsActive(false);
							const elem = document.createElement("input");
							elem.type = "file";
							elem.accept = ".deltaskin";
							elem.style.display = "none";
							elem.onchange = ((
								e: ChangeEvent<HTMLInputElement>,
							) => {
								if (
									e.target.files &&
									e.target.files.length > 0
								) {
									zipRead(e.target.files[0])
										.then((tree) => {
											if ("info.json" in tree) {
												tree["info.json"].file
													.text()
													.then((val: string) => {
														try {
															const readJson =
																JSON.parse(val);
															args.parseJSON(
																readJson,
															);
															args.setAssets(
																tree,
															);
														} catch (e) {
															console.error(
																"Error parsing imported JSON!",
																e,
															);
															args.showPopup(
																<JSONParseError />,
																() => {},
															);
														}
													});
											} else {
												console.error(
													"Skin file missing info.json!",
													e,
												);
												args.showPopup(
													<>
														<h1>Error</h1>

														<p>
															Skin file is missing
															info.json!
														</p>
													</>,
													() => {},
												);
											}
										})
										.catch((e) => {
											console.error(
												"Error reading skin file!",
												e,
											);
											args.showPopup(
												<>
													<h1>Error</h1>

													<p>
														Unable to read skin
														file!
													</p>
												</>,
												() => {},
											);
										});
								}
							}) as unknown as (
								this: GlobalEventHandlers,
								ev: Event,
							) => unknown;
							document.body.appendChild(elem);
							elem.click();
							document.body.removeChild(elem);
						}}
					/>,
					<MenuButton
						key="saveskin"
						label="Save Skin"
						onClick={() => {
							setIsActive(false);
							const exportObj = args.saveJSON();
							const file = new File(
								[
									new Blob([exportObj.json], {
										type: "application/json",
									}),
								],
								"info.json",
							);
							const tree = args.getReferencedAssets(
								exportObj.infoFile,
							);
							tree["info.json"] = {
								file: file,
								url: null,
								width: -1,
								height: -1,
							};
							writeZip(tree)
								.then((url) => {
									const elem = document.createElement("a");
									elem.href = url;
									elem.download = "skin.deltaskin";
									document.body.appendChild(elem);
									elem.click();
									document.body.removeChild(elem);
								})
								.catch((e) => {
									console.error(
										"Error exporting skin file!",
										e,
									);
									args.showPopup(
										<>
											<h1>Error</h1>

											<p>Unable to export skin file!</p>
										</>,
										() => {},
									);
								});
						}}
					/>,
					<MenuButton
						key="savejson"
						label="Save JSON"
						onClick={() => {
							setIsActive(false);
							const exportObj = args.saveJSON();
							const elem = document.createElement("a");
							const file = new Blob([exportObj.json], {
								type: "application/json",
							});
							elem.href = URL.createObjectURL(file);
							elem.download = "info.json";
							document.body.appendChild(elem);
							elem.click();
							document.body.removeChild(elem);
						}}
					/>,
					<MenuButton
						key="loadjson"
						label="Load JSON"
						onClick={() => {
							setIsActive(false);
							const elem = document.createElement("input");
							elem.type = "file";
							elem.accept = "application/json";
							elem.style.display = "none";
							elem.onchange = ((
								e: ChangeEvent<HTMLInputElement>,
							) => {
								if (
									e.target.files &&
									e.target.files.length > 0
								) {
									e.target.files[0]
										.text()
										.then((val: string) => {
											try {
												const readJson =
													JSON.parse(val);
												args.parseJSON(readJson);
											} catch (e) {
												console.error(
													"Error parsing imported JSON!",
													e,
												);
												args.showPopup(
													<JSONParseError />,
													() => {},
												);
											}
										});
								}
							}) as unknown as (
								this: GlobalEventHandlers,
								ev: Event,
							) => unknown;
							document.body.appendChild(elem);
							elem.click();
							document.body.removeChild(elem);
						}}
					/>,
				]}
			/>

			<MenuCategory
				isActive={isActive}
				label="Edit"
				setIsActive={setIsActive}
				subElements={[
					<MenuButton
						disabled={!args.canUndo}
						key="undo"
						label="Undo"
						onClick={() => {
							args.undo();
						}}
					/>,
					<MenuButton
						disabled={!args.canRedo}
						key="redo"
						label="Redo"
						onClick={() => {
							args.redo();
						}}
					/>,
				]}
			/>

			<MenuCategory
				isActive={isActive}
				label="Canvas"
				setIsActive={setIsActive}
				subElements={[
					<MenuButton
						key="returncenter"
						label="Return to Center"
						onClick={() => {
							args.setScale((oldScale) => {
								return {
									scale: oldScale.scale,
									xOffset: 0,
									yOffset: 0,
								};
							});
						}}
					/>,
					<MenuButton
						key="resetzoom"
						label="Reset Zoom"
						onClick={() => {
							args.setScale((oldScale) => {
								return {
									scale: 1,
									xOffset: oldScale.xOffset,
									yOffset: oldScale.yOffset,
								};
							});
						}}
					/>,
				]}
			/>

			<MenuCategory
				isActive={isActive}
				label="Help"
				setIsActive={setIsActive}
				subElements={[
					<MenuButton
						key="controls"
						label="Controls"
						onClick={() => {
							args.showPopup(<ControlsInfo />, () => {});
						}}
					/>,
					<MenuButton
						key="about"
						label="About"
						onClick={() => {
							args.showPopup(<AboutInfo />, () => {});
						}}
					/>,
				]}
			/>
		</div>
	);
}
