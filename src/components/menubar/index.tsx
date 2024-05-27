"use client";
import styles from "./index.module.css";
import icons from "@/utils/icons.module.css";
import MenuCategory from "./menucategory";
import React, {
	ChangeEvent,
	Dispatch,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import MenuButton from "./menubutton";
import { Asset, InfoFile, ScaleData, ShowPopupFunc } from "@/data/types";
import AboutInfo from "../commonPopups/aboutinfo";
import JSONParseError from "../commonPopups/jsonparseerror";
import ControlsInfo from "../commonPopups/controlsinfo";
import MenuToggle from "./menutoggle";
import SponsorInfo from "../commonPopups/sponsorinfo";

export default function MenuBar(args: {
	clearUI: () => void;
	setScale: Dispatch<SetStateAction<ScaleData>>;
	saveJSON: () => { json: string; infoFile: InfoFile };
	parseJSON: (json: Record<string, unknown>) => void;
	canUndo: boolean;
	undo: () => void;
	canRedo: boolean;
	redo: () => void;
	showPopup: ShowPopupFunc;
	setAssets: Dispatch<SetStateAction<Record<string, Asset> | null>>;
	getReferencedAssets: (infoFile: InfoFile) => Record<string, Asset>;
	setSidebarVisibility: Dispatch<
		SetStateAction<{ left: boolean; right: boolean }>
	>;
	showPreferences: () => void;
	loadDeltaskin: (file: File) => void;
	saveDeltaskin: () => void;
}) {
	const [isActive, setIsActive] = useState<boolean>(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as HTMLElement)) {
				setIsActive(false);
			}
		};
		document.addEventListener("click", onClick);

		return () => {
			document.removeEventListener("click", onClick);
		};
	}, []);
	return (
		<div
			className={`${styles.menubar}${
				isActive ? " " + styles.active : ""
			}`}
			ref={ref}
		>
			<div
				style={{
					flexGrow: 1,
					flexShrink: 1,
				}}
			>
				<MenuToggle
					className={`${styles.narrowScreenOnly} ${styles.menuToggle}`}
					label={
						<div
							className={`${icons.icon} ${icons.menuExpand}`}
							style={{
								height: "var(--icon-size)",
								width: "var(--icon-size)",
							}}
						/>
					}
					onClick={() => {
						args.setSidebarVisibility((val) => {
							return {
								left: !val.left,
								right: true,
							};
						});
					}}
				/>
				<MenuCategory
					isActive={isActive}
					label="File"
					setIsActive={setIsActive}
				>
					<MenuButton
						key="newskin"
						label="New Skin"
						onClick={() => {
							args.showPopup(
								<>
									<h1>Warning</h1>

									<p>
										The current skin will be lost! Are you
										sure you want to continue?
									</p>
								</>,
								() => {},
								() => {
									args.clearUI();
								},
							);
						}}
					/>
					<MenuButton
						key="loadskin"
						label="Load Deltaskin"
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
									args.loadDeltaskin(e.target.files[0]);
								}
							}) as unknown as (
								this: GlobalEventHandlers,
								ev: Event,
							) => unknown;
							document.body.appendChild(elem);
							elem.click();
							document.body.removeChild(elem);
						}}
					/>
					<MenuButton
						key="saveskin"
						label="Save Deltaskin"
						onClick={() => {
							setIsActive(false);
							args.saveDeltaskin();
						}}
					/>
					<MenuButton
						key="savejson"
						label="Save info.json"
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
					/>
					<MenuButton
						key="loadjson"
						label="Load info.json"
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
					/>
					<MenuButton
						key="preferences"
						label="Preferences"
						onClick={args.showPreferences}
					/>
				</MenuCategory>

				<MenuCategory
					isActive={isActive}
					label="Edit"
					setIsActive={setIsActive}
				>
					<MenuButton
						disabled={!args.canUndo}
						key="undo"
						label="Undo"
						onClick={() => {
							args.undo();
						}}
					/>
					<MenuButton
						disabled={!args.canRedo}
						key="redo"
						label="Redo"
						onClick={() => {
							args.redo();
						}}
					/>
				</MenuCategory>

				<MenuCategory
					isActive={isActive}
					label="Canvas"
					setIsActive={setIsActive}
				>
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
					/>
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
					/>
				</MenuCategory>

				<MenuCategory
					isActive={isActive}
					label="Help"
					setIsActive={setIsActive}
				>
					<MenuButton
						key="controls"
						label="Controls"
						onClick={() => {
							args.showPopup(<ControlsInfo />, () => {});
						}}
					/>
					<MenuButton
						key="donate"
						label="Donate"
						onClick={() => {
							args.showPopup(<SponsorInfo />, () => {});
						}}
					/>
					<MenuButton
						key="about"
						label="About"
						onClick={() => {
							args.showPopup(<AboutInfo />, () => {});
						}}
					/>
				</MenuCategory>
			</div>
			<div
				style={{
					flexGrow: 1,
					flexShrink: 0,
					justifyContent: "flex-end",
				}}
			>
				<MenuToggle
					className={`${styles.narrowScreenOnly} ${styles.menuToggle}`}
					label={
						<div
							className={`${icons.icon} ${icons.menuCollapse}`}
							style={{
								height: "var(--icon-size)",
								width: "var(--icon-size)",
							}}
						/>
					}
					onClick={() => {
						args.setSidebarVisibility((val) => {
							return {
								left: true,
								right: !val.right,
							};
						});
					}}
				/>
			</div>
		</div>
	);
}
