"use client";
import styles from "./index.module.css";
import icons from "@/utils/icons.module.css";
import MenuCategory from "./menucategory";
import React, {
	Dispatch,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import MenuButton from "./menubutton";
import { Asset, InfoFile, ScaleData, ShowPopupFunc } from "@/data/types";
import AboutInfo from "../commonPopups/aboutinfo";
import ControlsInfo from "../commonPopups/controlsinfo";
import MenuToggle from "./menutoggle";
import SponsorInfo from "../commonPopups/sponsorinfo";
import requestFiles from "@/utils/requestFiles";
import * as CONSTANT from "@/data/constants";

export default function MenuBar(args: {
	canRedo: boolean;
	canUndo: boolean;
	clearUI: () => void;
	getReferencedAssets: (infoFile: InfoFile) => Record<string, Asset>;
	loadDeltaskin: (file: File) => void;
	parseJSON: (json: Record<string, unknown>) => void;
	redo: () => void;
	saveDeltaskin: () => void;
	saveJSON: () => { infoFile: InfoFile; json: string };
	setAssets: Dispatch<SetStateAction<Record<string, Asset> | null>>;
	setScale: Dispatch<SetStateAction<ScaleData>>;
	setSidebarVisibility: Dispatch<
		SetStateAction<{ left: boolean; right: boolean }>
	>;
	showPopup: ShowPopupFunc;
	showPreferences: () => void;
	undo: () => void;
}) {
	const [isActive, setIsActive] = useState<boolean>(false);
	const ref = useRef<HTMLDivElement>(null);
	const navbuttons = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as HTMLElement)) {
				setIsActive(false);
			}
		};
		const onKeyDown = (e: KeyboardEvent) => {
			if (ref.current?.contains(document.activeElement)) {
				const elem = document.activeElement;
				if (elem) {
					switch (e.key) {
						case "ArrowDown":
							if (
								elem.getAttribute("data-type") ===
								"menu-category"
							) {
								setIsActive(true);
								(
									elem.nextElementSibling
										?.children[0] as HTMLElement
								).focus();
							} else {
								(
									elem?.nextElementSibling as HTMLElement
								)?.focus();
							}
							break;
						case "ArrowLeft":
							if (
								elem.getAttribute("data-type") ===
								"menu-category"
							) {
								if (
									elem.parentElement
										?.previousElementSibling &&
									elem.parentElement?.previousElementSibling
										?.children?.length > 0
								)
									(
										elem.parentElement
											.previousElementSibling
											.children[0] as HTMLElement
									).focus();
							} else {
								if (
									elem.parentElement?.parentElement
										?.previousElementSibling &&
									elem.parentElement.parentElement
										.previousElementSibling.children
										.length > 0
								)
									(
										elem.parentElement.parentElement
											.previousElementSibling
											.children[0] as HTMLElement
									).focus();
							}
							break;
						case "ArrowRight":
							if (
								elem.getAttribute("data-type") ===
								"menu-category"
							) {
								if (
									elem.parentElement?.nextElementSibling &&
									elem.parentElement?.nextElementSibling
										?.children?.length > 0
								)
									(
										elem.parentElement.nextElementSibling
											.children[0] as HTMLElement
									).focus();
							} else {
								if (
									elem.parentElement?.parentElement
										?.nextElementSibling &&
									elem.parentElement.parentElement
										.nextElementSibling.children.length > 0
								)
									(
										elem.parentElement?.parentElement
											?.nextElementSibling
											?.children[0] as HTMLElement
									).focus();
							}
							break;
						case "ArrowUp":
							if (elem.previousElementSibling) {
								(
									elem.previousElementSibling as HTMLElement
								)?.focus();
							} else if (
								elem.parentElement?.previousElementSibling?.getAttribute(
									"data-type",
								) === "menu-category"
							) {
								(
									elem.parentElement
										.previousElementSibling as HTMLElement
								).focus();
								setIsActive(false);
							} else if (
								elem.getAttribute("data-type") ===
								"menu-category"
							) {
								setIsActive(false);
							}
							break;
					}
				}
			}
		};
		const onKeyAlt = (e: KeyboardEvent) => {
			if (!ref.current?.contains(document.activeElement)) {
				if (
					e.key === "Alt" &&
					navbuttons.current &&
					navbuttons.current.children.length > 0 &&
					navbuttons.current.children[0].children.length > 0
				) {
					e.preventDefault();
					e.stopImmediatePropagation();
					(
						navbuttons.current.children[0]
							.children[0] as HTMLElement
					).focus();
				}
			}
		};
		document.addEventListener("click", onClick);
		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("keyup", onKeyAlt, { capture: true });

		return () => {
			document.removeEventListener("click", onClick);
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("keyup", onKeyAlt, { capture: true });
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
				<div className={styles.navButtons} ref={navbuttons}>
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
									true,
									"Warning",
									<p>
										The current skin will be lost! Are you
										sure you want to continue?
									</p>,
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
								requestFiles(".deltaskin", false, (files) => {
									args.loadDeltaskin(files[0]);
								});
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
								requestFiles(
									"application/json",
									false,
									(files) => {
										files[0].text().then((val: string) => {
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
													true,
													"Error",
													<p>
														Unable to parse JSON!
													</p>,
													() => {},
												);
											}
										});
									},
								);
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
								args.showPopup(
									false,
									"Controls",
									<ControlsInfo />,
									() => {},
								);
							}}
						/>
						<MenuButton
							key="donate"
							label="Donate"
							onClick={() => {
								args.showPopup(
									false,
									`Sponsor ${CONSTANT.NAME}`,
									<SponsorInfo />,
									() => {},
								);
							}}
						/>
						<MenuButton
							key="about"
							label="About"
							onClick={() => {
								args.showPopup(
									false,
									`About ${CONSTANT.NAME}`,
									<AboutInfo />,
									() => {},
								);
							}}
						/>
					</MenuCategory>
				</div>
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
