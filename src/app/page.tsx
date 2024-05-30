"use client";
import themes from "./themes.module.css";
import colorSchemes from "./colorSchemes.module.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import MenuBar from "@/components/menubar";
import Sidebar, { SidebarPosition } from "@/components/sidebar";
import VisualEditor from "@/components/visualEditor";
import styles from "@/app/main.module.css";
import PopupWrapper from "@/components/popup";
import { loadAssetHelper } from "@/utils/readImage";
import * as ContextMenu from "@/components/contextMenu";
import {
	Asset,
	AssetType,
	EmulatorElement,
	EmulatorElementType,
	EmulatorLayout,
	FocusState,
	FocusTarget,
	HistoryEvent,
	InfoFile,
	Mutable,
	Representation,
	ScaleData,
	ShowContextMenuFunc,
	ShowPopupFunc,
} from "@/data/types";
import update, { Spec } from "immutability-helper";
import * as CONSTANT from "@/data/constants";
import ValueInput from "@/components/inputs/valueinput";
import INPUT_PRESETS from "@/data/consoleInfo";
import SkinInfoWindow from "@/components/windows/skinInfoWindow";
import RepresentationTreeWindow from "@/components/windows/representationTreeWindow";
import ZoomWindow from "@/components/windows/zoomWindow";
import ElementListWindow from "@/components/windows/elementListWindow";
import ElementValueWindow from "@/components/windows/elementValueWindow";
import JSONParseError from "@/components/commonPopups/jsonparseerror";
import * as Preferences from "@/preferences/preferences";
import PreferencesWindow from "@/components/windows/preferences";
import zipRead from "@/utils/zip/zipRead";
import writeZip from "@/utils/zip/zipWrite";
import CenteredElement from "@/components/centeredElement";
import Popup from "@/components/popup/popup";

const MAX_HISTORY = 100;
const HISTORY_DEBOUNCE = 200;

const historyInfo = {
	writing: false,
	isHistoryEdit: false,
	currentState: 0,
	processing: false,
};

const defaultLayout: EmulatorLayout = {
	lockBackgroundRatio: false,
	assets: {
		type: AssetType.PDF,
		resizable: "",
		small: "",
		medium: "",
		large: "",
	},
	canvas: {
		width: 500,
		height: 500,
	},
	padding: {
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	},
	translucent: false,
};

const defaultRepresentation: Representation = {
	elements: [],
	layout: structuredClone(defaultLayout),
};

const defaultInfoFile: InfoFile = {
	hiddenLoadedFileName: "",
	name: "",
	identifier: "",
	gameTypeIdentifier: "",
	debug: false,
	representations: {
		iphone: {
			standard: {
				portrait: structuredClone(defaultRepresentation),
				landscape: structuredClone(defaultRepresentation),
			},
			edgeToEdge: {
				portrait: structuredClone(defaultRepresentation),
				landscape: structuredClone(defaultRepresentation),
			},
		},
		ipad: {
			standard: {
				portrait: structuredClone(defaultRepresentation),
				landscape: structuredClone(defaultRepresentation),
			},
			splitView: {
				portrait: structuredClone(defaultRepresentation),
				landscape: structuredClone(defaultRepresentation),
			},
		},
	},
};

const getFirstRepresentation = (newInfoFile: InfoFile) => {
	let representation = "";
	const recurse = (data: Record<string, object>, dataKey: string) => {
		if ("elements" in data || "layout" in data) {
			if (representation.length === 0) {
				representation = dataKey.slice(1);
			}
			return true;
		} else {
			Object.keys(data)
				.sort()
				.find((key: string) => {
					return recurse(
						data[key] as Record<string, object>,
						`${dataKey}.${key}`,
					);
				});
			return false;
		}
	};
	recurse(newInfoFile.representations, "");
	return representation;
};

export default function Home() {
	const [sidebarVisibility, setSidebarVisibility] = useState<{
		left: boolean;
		right: boolean;
	}>({
		left: true,
		right: true,
	});
	const [preferencesVisible, setPreferencesVisible] =
		useState<boolean>(false);
	const [preferences, setPreferences] = useState<Preferences.State>(
		Preferences.load(),
	);
	const [assets, setAssets] = useState<Record<string, Asset> | null>(null);
	const [popups, setPopups] = useState<
		{
			data: React.JSX.Element;
			onClose: () => void;
			onAccept?: () => void;
		}[]
	>([]);
	const [contextMenu, setContextMenu] = useState<{
		data: ContextMenu.Entry[] | null;
		x: number;
		y: number;
	}>({
		data: null,
		x: 0,
		y: 0,
	});
	const [history, setHistory] = useState<HistoryEvent[]>([]);
	const [infoFile, setInfoFile] = useState<InfoFile>(
		structuredClone(defaultInfoFile),
	);
	const [currentRepresentation, setCurrentRepresentation] = useState<string>(
		getFirstRepresentation(defaultInfoFile),
	);
	const [scale, setScale] = useState<ScaleData>({
		scale: 1,
		xOffset: 0,
		yOffset: 0,
	});
	const [focusState, setFocusState] = useState<FocusState>({
		target: null,
		elements: [],
		representation: "",
	});
	const [editingElement, setEditingElementInternal] = useState<number>(-1);
	const setEditingElement = useCallback((val: number) => {
		setEditingElementInternal(val);
		if (val > -1) {
			setFocusState((state) => {
				const ret = {
					target: FocusTarget.ELEMENT,
					elements: state.elements.includes(val)
						? state.elements.sort((x, y) =>
								x == val ? 1 : y == val ? -1 : 0,
							)
						: [...state.elements, val],
					representation: currentRepresentation,
				};
				return ret;
			});
		} else {
			setFocusState((state) =>
				update(state, {
					target: { $set: FocusTarget.REPRESENTATION },
					representation: { $set: currentRepresentation },
				}),
			);
		}
	}, []);
	const [hoverIndex, setHoverIndex] = useState<number>(-1);
	const [pressedKeys, setPressedKeys] = useState<string[]>([]);

	const updatePreferences: (
		stateUpdate: Spec<Preferences.State, never>,
	) => void = (stateUpdate: Spec<Preferences.State, never>) => {
		setPreferences((state: Preferences.State) =>
			update(state, stateUpdate),
		);
	};

	const updateSkinState: (stateUpdate: Spec<InfoFile, never>) => void = (
		stateUpdate: Spec<InfoFile, never>,
	) => {
		setInfoFile((state: InfoFile) => update(state, stateUpdate));
	};

	const updateRepresentationState: (
		stateUpdate: Spec<Representation, never>,
		representation: string,
	) => void = (
		stateUpdate: Spec<Representation, never>,
		representation: string,
	) => {
		const data: Record<string, never> = {};
		let dataSub: Record<string, never> = data;
		const split = representation.split(".");
		split.forEach((val, i) => {
			if (i < split.length - 1) {
				dataSub[val] = {} as never;
				dataSub = dataSub[val];
			} else {
				dataSub[val] = stateUpdate as never;
			}
		});
		updateSkinState({ representations: data } as Spec<InfoFile, never>);
	};

	useEffect(() => {
		const onChange = () => {
			setPreferences((oldPreferences) => {
				return { ...oldPreferences, ...Preferences.load() };
			});
		};
		window.addEventListener("storage", onChange);
		return () => {
			window.removeEventListener("storage", onChange);
		};
	}, []);

	useEffect(() => {
		Preferences.save(preferences);
	}, [preferences]);

	const addElement: () => void = () => {
		addElementData({
			type: EmulatorElementType.Default,
			data: {
				inputs: [],
				inputsobj: {
					up: "up",
					down: "down",
					left: "left",
					right: "right",
					x: "touchScreenX",
					y: "touchScreenY",
				},
				thumbstick: {
					name: "",
					width: 0,
					height: 0,
					hidden: false,
				},
				screen: {
					x: 0,
					y: 0,
					width: 0,
					height: 0,
				},
			},
			x: 0,
			y: 0,
			width: 100,
			height: 100,
			paddingTop: 0,
			paddingBottom: 0,
			paddingLeft: 0,
			paddingRight: 0,
			hidden: false,
		});
	};

	const addElementData: (data: EmulatorElement) => void = (
		data: EmulatorElement,
	) => {
		updateRepresentationState(
			{ elements: { $push: [data] } },
			currentRepresentation,
		);
	};

	const updateElement: (
		key: number,
		data: Spec<EmulatorElement, never>,
	) => void = (key: number, data: Spec<EmulatorElement, never>) => {
		const elements: Spec<EmulatorElement[], never> = {};
		elements[key] = data;
		updateRepresentationState(
			{ elements: elements },
			currentRepresentation,
		);
	};

	const removeElement: (key: number) => void = (key: number) => {
		updateRepresentationState(
			{ elements: { $splice: [[key, 1]] } },
			currentRepresentation,
		);
		setFocusState((state) =>
			update(state, {
				elements: {
					$set: state.elements.flatMap((val) => {
						if (val < key) return val;
						else if (val > key) return val - 1;
						else return [];
					}),
				},
			}),
		);
	};

	const loadDeltaskin: (file: File) => void = useCallback((file: File) => {
		zipRead(file)
			.then((tree) => {
				if ("info.json" in tree) {
					tree["info.json"].file.text().then((val: string) => {
						try {
							const readJson = JSON.parse(val);
							parseJSON(readJson, file.name);
							setAssets(tree);
						} catch (e) {
							console.error("Error parsing imported JSON!", e);
							showPopup(<JSONParseError />, () => {});
						}
					});
				} else {
					console.error("Skin file missing info.json!");
					showPopup(
						<>
							<h1>Error</h1>

							<p>Skin file is missing info.json!</p>
						</>,
						() => {},
					);
				}
			})
			.catch((e) => {
				console.error("Error reading skin file!", e);
				showPopup(
					<>
						<h1>Error</h1>

						<p>Unable to read skin file!</p>
					</>,
					() => {},
				);
			});
	}, []);

	const saveDeltaskin: () => void = useCallback(() => {
		const exportObj = saveJSON();
		const file = new File(
			[
				new Blob([exportObj.json], {
					type: "application/json",
				}),
			],
			"info.json",
		);
		const tree = getReferencedAssets(exportObj.infoFile);
		tree["info.json"] = {
			file: file,
			type: null,
			url: null,
			width: -1,
			height: -1,
		};
		const name = exportObj.infoFile.hiddenLoadedFileName
			? exportObj.infoFile.hiddenLoadedFileName
			: (exportObj.infoFile.name.trim().length > 0
					? exportObj.infoFile.name
					: "skin") + ".deltaskin";
		writeZip(tree)
			.then((url) => {
				const elem = document.createElement("a");
				elem.href = url;
				elem.download = name;
				document.body.appendChild(elem);
				elem.click();
				document.body.removeChild(elem);
			})
			.catch((e) => {
				console.error("Error exporting skin file!", e);
				showPopup(
					<>
						<h1>Error</h1>

						<p>Unable to export skin file!</p>
					</>,
					() => {},
				);
			});
	}, [infoFile]);

	useEffect(() => {
		/* Additional save listener */
		const keyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.code === "KeyS") {
				saveDeltaskin();
				e.preventDefault();
			}
		};
		window.addEventListener("keydown", keyDown);
		return () => {
			window.removeEventListener("keydown", keyDown);
		};
	}, [saveDeltaskin]);

	useEffect(() => {
		const keyDown = (e: KeyboardEvent) => {
			if (pressedKeys.indexOf(e.code) === -1) {
				const newElements = pressedKeys.slice();
				newElements.push(e.code);
				setPressedKeys(newElements);
			}
			const nodeType = e.target
				? (e.target as HTMLElement).nodeName.toLocaleLowerCase()
				: "";
			if (!(nodeType === "input" || nodeType === "textarea")) {
				if (e.ctrlKey) {
					/* Global keybind listener */
					if (
						(e.code === "KeyZ" && !e.shiftKey) ||
						(e.code === "KeyY" && e.shiftKey)
					) {
						if (historyInfo.writing) {
							revertHistory(historyInfo.currentState);
						} else if (historyInfo.currentState > 1) {
							revertHistory(historyInfo.currentState - 1);
						}
						e.preventDefault();
					} else if (
						(e.code === "KeyY" && !e.shiftKey) ||
						(e.code === "KeyZ" && e.shiftKey)
					) {
						if (historyInfo.currentState < history.length) {
							revertHistory(historyInfo.currentState + 1);
						}
						e.preventDefault();
					}
				}
			}
		};
		window.addEventListener("keydown", keyDown);

		const keyUp = (e: KeyboardEvent) => {
			const index = pressedKeys.indexOf(e.code);
			const newElements = pressedKeys.slice();
			newElements.splice(index, 1);
			setPressedKeys(newElements);
		};
		window.addEventListener("keyup", keyUp);

		const copy = (e: ClipboardEvent) => {
			const nodeType = e.target
				? (e.target as HTMLElement).nodeName.toLocaleLowerCase()
				: "";
			if (
				focusState.target &&
				e.clipboardData &&
				!(nodeType === "input" || nodeType === "textarea")
			) {
				let representation;
				switch (focusState.target) {
					case FocusTarget.ELEMENT:
						representation = getRepresentation(
							infoFile,
							currentRepresentation,
						);
						if (representation && hoverIndex > -1) {
							e.clipboardData.setData(
								CONSTANT.CLIPBOARD_ELEMENT,
								JSON.stringify(
									representation.elements[hoverIndex],
								),
							);
							e.preventDefault();
						}
						break;
					case FocusTarget.REPRESENTATION:
						if (focusState.representation.length > 0) {
							representation = getRepresentation(
								infoFile,
								focusState.representation,
							);
							if (representation) {
								e.clipboardData.setData(
									CONSTANT.CLIPBOARD_REPRESENTATION,
									JSON.stringify(representation),
								);
								e.preventDefault();
							}
						}
						break;
				}
			}
		};
		window.addEventListener("copy", copy);

		const paste = (e: ClipboardEvent) => {
			const nodeType = e.target
				? (e.target as HTMLElement).nodeName.toLocaleLowerCase()
				: "";
			if (
				e.clipboardData &&
				!(nodeType === "input" || nodeType === "textarea")
			) {
				if (
					e.clipboardData.types.includes(CONSTANT.CLIPBOARD_ELEMENT)
				) {
					addElementData({
						...JSON.parse(
							e.clipboardData.getData(CONSTANT.CLIPBOARD_ELEMENT),
						),
					});
					e.preventDefault();
				} else if (
					e.clipboardData.types.includes(
						CONSTANT.CLIPBOARD_REPRESENTATION,
					)
				) {
					const newData = [""];
					const split = currentRepresentation.split(".");
					const newRepresentation: Representation = JSON.parse(
						e.clipboardData.getData(
							CONSTANT.CLIPBOARD_REPRESENTATION,
						),
					);
					let newKey = "";
					if (split.length > 0) {
						newKey = split.slice(0, split.length - 1).join(".");
					}
					showPopup(
						<>
							<h2>Paste Node</h2>
							<p>Paste node under &quot;{newKey}&quot;</p>
							<ValueInput
								context={"-1"}
								label="Name"
								onChange={(val: string) => {
									newData[0] = val;
								}}
								value=""
							/>
						</>,
						() => {},
						() => {
							if ((newData[0] as string).length > 0) {
								addNode(
									`${newKey}.${newData[0]}`,
									newRepresentation,
								);
							}
						},
					);
					e.preventDefault();
				}
			}
		};
		window.addEventListener("paste", paste);

		const onClear = () => {
			setPressedKeys([]);
		};
		window.addEventListener("blur", onClear);

		return () => {
			window.removeEventListener("keydown", keyDown);
			window.removeEventListener("keyup", keyUp);
			window.removeEventListener("copy", copy);
			window.removeEventListener("paste", paste);
			window.removeEventListener("blur", onClear);
		};
	}, [focusState]);

	const createNode: (key: string, isLayout: boolean) => void = (
		key: string,
		isLayout: boolean,
	) => {
		const newInfoFile = Object.assign({}, infoFile);
		const parts = key.split(".");
		let data: Record<string, object> = newInfoFile.representations;
		parts.forEach((val: string, i: number) => {
			if (i == parts.length - 1) {
				if (!(val in data)) {
					data[val] = isLayout
						? {
								elements: [],
								layout: structuredClone(defaultLayout),
							}
						: {};
				}
			} else {
				if (val in data) {
					data = data[val] as Record<string, object>;
				} else {
					console.error(`Unable to find key ${val} in data!`);
				}
			}
		});
		setInfoFile(newInfoFile);
	};

	const addNode: (key: string, representation: Representation) => void = (
		key: string,
		representation: Representation,
	) => {
		const newInfoFile = Object.assign({}, infoFile);
		const parts = key.split(".");
		let data: Record<string, object> = newInfoFile.representations;
		parts.forEach((val: string, i: number) => {
			if (i == parts.length - 1) {
				if (!(val in data)) {
					data[val] = representation;
				} else {
					console.error(`Node ${key} already exists!`);
					showPopup(
						<>
							<h1>Error</h1>

							<p>Node &quot;{key}&quot; already exists!</p>
						</>,
						() => {},
					);
				}
			} else {
				if (val in data) {
					data = data[val] as Record<string, object>;
				} else {
					console.error(`Unable to find key ${val} in data!`);
				}
			}
		});
		setInfoFile(newInfoFile);
	};

	const getRepresentation: (
		infoFile: InfoFile,
		representation: string,
	) => Representation | null = (
		infoFile: InfoFile,
		representation: string,
	) => {
		if (representation.length === 0) {
			return null;
		}
		const parts = representation.split(".");
		let data: Record<string, object> = infoFile.representations;
		parts.forEach((val: string) => {
			if (val in data) {
				data = data[val] as Record<string, object>;
			} else {
				console.error(`Unable to find key ${val} in data!`);
			}
		});
		if ("elements" in data && "layout" in data)
			return data as unknown as Representation;
		return null;
	};

	const deleteNode: (key: string) => void = (key: string) => {
		const data: Record<string, never> = {};
		let dataSub: Record<string, never> = data;
		const split = key.split(".");
		split.forEach((val, i) => {
			if (i < split.length - 1) {
				dataSub[val] = {} as never;
				dataSub = dataSub[val];
			} else {
				dataSub["$unset"] = [val] as never;
			}
		});
		if (currentRepresentation.startsWith(key)) {
			clearUI();
		}
		updateSkinState({ representations: data });
	};

	const applyRepresentation: (key: string, newInfoFile?: InfoFile) => void = (
		key: string,
		newInfoFile?: InfoFile,
	) => {
		const data = getRepresentation(
			newInfoFile ? newInfoFile : infoFile,
			key,
		);
		if (data) {
			setEditingElementInternal(-1);
			setHoverIndex(-1);
			setFocusState({
				target: FocusTarget.REPRESENTATION,
				elements: [],
				representation: key,
			});
			setCurrentRepresentation(key);
			if (assets) {
				const layoutAssets = data.layout.assets;
				let file = "";
				switch (layoutAssets.type) {
					case AssetType.PDF:
						file = layoutAssets.resizable;
						if (file in assets!) {
							loadAssetHelper(file, assets, setAssets);
						}
						break;
					case AssetType.PNG:
						file = layoutAssets.large;
						if (file in assets!) {
							loadAssetHelper(file, assets, setAssets);
						}
						file = layoutAssets.medium;
						if (file in assets!) {
							loadAssetHelper(file, assets, setAssets);
						}
						file = layoutAssets.small;
						if (file in assets!) {
							loadAssetHelper(file, assets, setAssets);
						}
						break;
				}
				data.elements.forEach((val: EmulatorElement) => {
					switch (val.type) {
						case EmulatorElementType.Thumbstick:
							file = val.data.thumbstick.name;
							if (file in assets!) {
								loadAssetHelper(file, assets, setAssets);
							}
							break;
						default:
							break;
					}
				});
			}
		}
	};

	const addAsset: (path: string, asset: Asset) => void = (
		path: string,
		asset: Asset,
	) => {
		setAssets((oldAssets) => {
			const newAssets = Object.assign({}, oldAssets);
			newAssets[path] = asset;
			return newAssets;
		});
	};

	const getReferencedAssets: (infoFile: InfoFile) => Record<string, Asset> = (
		infoFile: InfoFile,
	) => {
		const retAssets: Record<string, Asset> = {};
		const recurse = (data: Record<string, object>, dataKey: string) => {
			if ("elements" in data || "layout" in data) {
				const layoutAssets = (data as unknown as Representation).layout
					.assets;
				let file;
				switch (layoutAssets.type) {
					case AssetType.PDF:
						file = layoutAssets.resizable;
						if (file in assets! && !(file in retAssets)) {
							retAssets[file] = assets![file];
						}
						break;
					case AssetType.PNG:
						file = layoutAssets.large;
						if (file in assets! && !(file in retAssets)) {
							retAssets[file] = assets![file];
						}
						file = layoutAssets.medium;
						if (file in assets! && !(file in retAssets)) {
							retAssets[file] = assets![file];
						}
						file = layoutAssets.small;
						if (file in assets! && !(file in retAssets)) {
							retAssets[file] = assets![file];
						}
						break;
				}
				(data as unknown as Representation).elements.forEach(
					(val: EmulatorElement) => {
						let file;
						switch (val.type) {
							case EmulatorElementType.Thumbstick:
								file = val.data.thumbstick.name;
								if (file in assets! && !(file in retAssets)) {
									retAssets[file] = assets![file];
								}
								break;
							default:
								break;
						}
					},
				);
				return false;
			} else {
				Object.keys(data)
					.sort()
					.find((key: string) => {
						return recurse(
							data[key] as Record<string, object>,
							`${dataKey}.${key}`,
						);
					});
				return false;
			}
		};
		if (assets) {
			recurse(infoFile.representations, "");
		}
		return retAssets;
	};

	const clearUI: () => void = () => {
		setEditingElementInternal(-1);
		setFocusState({ target: null, elements: [], representation: "" });
		setCurrentRepresentation("");
	};

	const saveJSON: () => { json: string; infoFile: InfoFile } = () => {
		const exportObj: InfoFile = {
			hiddenLoadedFileName: infoFile.hiddenLoadedFileName,
			name: infoFile.name,
			identifier: infoFile.identifier,
			gameTypeIdentifier: infoFile.gameTypeIdentifier,
			debug: infoFile.debug,
			representations: {},
		};
		if ("representations" in infoFile) {
			const recurse = (
				data: Record<string, object>,
				newInfoFileKey: string,
				newInfoFile: Record<string, object>,
			) => {
				if ("elements" in data || "layout" in data) {
					newInfoFile[newInfoFileKey] = saveRepresentation(
						data as unknown as Representation,
					);
				} else {
					Object.keys(data).forEach((key: string) => {
						(newInfoFile[newInfoFileKey] as Record<string, object>)[
							key
						] = {};
						recurse(
							data[key] as Record<string, object>,
							key,
							newInfoFile[newInfoFileKey] as Record<
								string,
								object
							>,
						);
					});
				}
			};
			recurse(
				infoFile.representations,
				"representations",
				exportObj as unknown as Record<string, object>,
			);
		}
		return { json: JSON.stringify(exportObj), infoFile: infoFile };
	};

	const saveRepresentation = (data: Representation) => {
		const exportObj: {
			assets: Record<string, string>;
			items: {
				inputs: string[] | Record<string, string>;
				frame: {
					x: number;
					y: number;
					width: number;
					height: number;
				};
				extendedEdges: {
					top: number;
					bottom: number;
					left: number;
					right: number;
				};
			}[];
			screens: {
				inputFrame: {
					x: number;
					y: number;
					width: number;
					height: number;
				};
				outputFrame: {
					x: number;
					y: number;
					width: number;
					height: number;
				};
			}[];
			mappingSize: {
				width: number;
				height: number;
			};
			extendedEdges: {
				top: number;
				bottom: number;
				left: number;
				right: number;
			};
			translucent: boolean;
		} = {
			assets:
				data.layout.assets.type === AssetType.PDF
					? {
							resizable: data.layout.assets.resizable
								? data.layout.assets.resizable
								: "",
						}
					: {
							small: data.layout.assets.small
								? data.layout.assets.small
								: "",
							medium: data.layout.assets.medium
								? data.layout.assets.medium
								: "",
							large: data.layout.assets.large
								? data.layout.assets.large
								: "",
						},
			items: [],
			screens: [],
			mappingSize: {
				width: Math.round(data.layout.canvas.width),
				height: Math.round(data.layout.canvas.height),
			},
			extendedEdges: {
				top: Math.round(data.layout.padding.top),
				bottom: Math.round(data.layout.padding.bottom),
				left: Math.round(data.layout.padding.left),
				right: Math.round(data.layout.padding.right),
			},
			translucent: data.layout.translucent,
		};
		data.elements.forEach((val: EmulatorElement) => {
			let inputs: string[] | Record<string, string> = [];
			const thumbstick:
				| {
						thumbstick: {
							name: string;
							width: number;
							height: number;
						};
				  }
				| Record<string, object> = {};
			switch (val.type) {
				case EmulatorElementType.Thumbstick:
					thumbstick.thumbstick = {
						name: val.data.thumbstick.name,
						width: val.data.thumbstick.width
							? Math.round(val.data.thumbstick.width)
							: 0,
						height: val.data.thumbstick.height
							? Math.round(val.data.thumbstick.height)
							: 0,
					};
				// eslint-disable-next-line no-fallthrough
				case EmulatorElementType.Dpad:
					inputs = {
						up: val.data.inputsobj.up ? val.data.inputsobj.up : "",
						down: val.data.inputsobj.down
							? val.data.inputsobj.down
							: "",
						left: val.data.inputsobj.left
							? val.data.inputsobj.left
							: "",
						right: val.data.inputsobj.right
							? val.data.inputsobj.right
							: "",
					};
					break;
				case EmulatorElementType.Touchscreen:
					inputs = {
						x: val.data.inputsobj.x ? val.data.inputsobj.x : "",
						y: val.data.inputsobj.y ? val.data.inputsobj.y : "",
					};
					break;
				case EmulatorElementType.Screen:
					exportObj.screens.push({
						inputFrame: {
							x: Math.round(val.data.screen.x),
							y: Math.round(val.data.screen.y),
							width: Math.round(val.data.screen.width),
							height: Math.round(val.data.screen.height),
						},
						outputFrame: {
							x: Math.round(val.x),
							y: Math.round(val.y),
							width: Math.round(val.width),
							height: Math.round(val.height),
						},
					});
					return;
				case EmulatorElementType.Default:
					inputs = val.data.inputs ? val.data.inputs : [];
					break;
			}
			exportObj.items.push({
				...thumbstick,
				inputs: inputs,
				frame: {
					x: Math.round(val.x),
					y: Math.round(val.y),
					width: Math.round(val.width),
					height: Math.round(val.height),
				},
				extendedEdges: {
					top: Math.round(val.paddingTop),
					bottom: Math.round(val.paddingBottom),
					left: Math.round(val.paddingLeft),
					right: Math.round(val.paddingRight),
				},
			});
		});
		return exportObj;
	};

	const parseJSON = (json: Record<string, unknown>, fileName?: string) => {
		try {
			const newInfoFile: InfoFile = {
				hiddenLoadedFileName: fileName ? fileName : "",
				name: "name" in json ? (json.name as string) : "",
				identifier:
					"identifier" in json ? (json.identifier as string) : "",
				gameTypeIdentifier:
					"gameTypeIdentifier" in json
						? (json.gameTypeIdentifier as string)
						: "",
				debug: "debug" in json ? (json.debug as boolean) : false,
				representations: {},
			};
			const gameTypeIdentifier = newInfoFile.gameTypeIdentifier;
			if ("representations" in json) {
				const recurse = (
					data: Record<string, object>,
					newInfoFileKey: string,
					newInfoFile: Record<string, object>,
				) => {
					if (
						"items" in data ||
						"assets" in data ||
						"mappingSize" in data
					) {
						const parsed = parseRepresentation(
							data as {
								items: Record<string, object>[];
								assets: Record<string, string>;
								mappingSize: Record<string, string>;
								extendedEdges?: Record<string, string>;
							},
							gameTypeIdentifier,
						);
						if (parsed) newInfoFile[newInfoFileKey] = parsed;
					} else {
						Object.keys(data).forEach((key: string) => {
							(
								newInfoFile[newInfoFileKey] as Record<
									string,
									object
								>
							)[key] = {};
							recurse(
								data[key] as Record<string, object>,
								key,
								newInfoFile[newInfoFileKey] as Record<
									string,
									object
								>,
							);
						});
					}
				};
				recurse(
					json.representations as Record<string, object>,
					"representations",
					newInfoFile as unknown as Record<string, object>,
				);
			}
			setInfoFile(newInfoFile);
			const newRepresentation = getFirstRepresentation(newInfoFile);
			if (newRepresentation.length > 0)
				applyRepresentation(newRepresentation, newInfoFile);
			else clearUI();
			historyInfo.writing = false;
			historyInfo.currentState = 0;
			historyInfo.processing = false;
			historyInfo.isHistoryEdit = false;
			setHistory([]);
		} catch (e) {
			console.error("Error parsing JSON!", e);
			showPopup(<JSONParseError />, () => {});
		}
	};

	const parseRepresentation = (
		json: {
			items: Record<string, unknown>[];
			assets: Record<string, string>;
			mappingSize: Record<string, string>;
			extendedEdges?: Record<string, string>;
		},
		gameTypeIdentifier: string,
	) => {
		try {
			const representationObj: Mutable<Representation> = {
				elements: [],
				layout: structuredClone(defaultLayout),
			};
			const newElements: EmulatorElement[] = [];
			json.items?.forEach((val: Record<string, unknown>) => {
				let type: EmulatorElementType = EmulatorElementType.Default;
				const data = {
					inputs: [] as string[],
					inputsobj: {
						up: "up",
						down: "down",
						left: "left",
						right: "right",
						x: "touchScreenX",
						y: "touchScreenY",
					},
					thumbstick: {
						name: "",
						width: 0,
						height: 0,
						hidden: false,
					},
					screen: {
						x: 0,
						y: 0,
						width: 0,
						height: 0,
					},
				};
				if (val.inputs instanceof Array) {
					data.inputs = val.inputs ? val.inputs : [];
				} else if (val.inputs instanceof Object) {
					if ("x" in val.inputs && "y" in val.inputs) {
						type = EmulatorElementType.Touchscreen;
						data.inputsobj.x = val.inputs?.x
							? (val.inputs.x as string)
							: "";
						data.inputsobj.y = val.inputs?.y
							? (val.inputs.y as string)
							: "";
					} else {
						type = EmulatorElementType.Dpad;
						if ("up" in val.inputs)
							data.inputsobj.up = val.inputs?.up
								? (val.inputs.up as string)
								: "";
						if ("down" in val.inputs)
							data.inputsobj.down = val.inputs?.down
								? (val.inputs.down as string)
								: "";
						if ("left" in val.inputs)
							data.inputsobj.left = val.inputs?.left
								? (val.inputs.left as string)
								: "";
						if ("right" in val.inputs)
							data.inputsobj.right = val.inputs?.right
								? (val.inputs.right as string)
								: "";
						if (
							val.thumbstick != null &&
							typeof val.thumbstick === "object"
						) {
							type = EmulatorElementType.Thumbstick;
							if ("name" in val.thumbstick)
								data.thumbstick.name = val.thumbstick?.name
									? (val.thumbstick.name as string)
									: "";
							if ("width" in val.thumbstick)
								data.thumbstick.width = val.thumbstick?.width
									? (val.thumbstick.width as number)
									: 0;
							if ("height" in val.thumbstick)
								data.thumbstick.height = val.thumbstick?.height
									? (val.thumbstick.height as number)
									: 0;
						}
					}
				}
				if (val.frame && typeof val.frame === "object") {
					newElements.push({
						type: type,
						data: data,
						x:
							"x" in val.frame
								? parseInt(val.frame.x as string)
								: 0,
						y:
							"y" in val.frame
								? parseInt(val.frame.y as string)
								: 0,
						width:
							"width" in val.frame
								? parseInt(val.frame.width as string)
								: 0,
						height:
							"height" in val.frame
								? parseInt(val.frame.height as string)
								: 0,
						paddingTop:
							val.extendedEdges &&
							typeof val.extendedEdges === "object" &&
							"top" in val.extendedEdges
								? parseInt(val.extendedEdges.top as string)
								: 0,
						paddingBottom:
							val.extendedEdges &&
							typeof val.extendedEdges === "object" &&
							"bottom" in val.extendedEdges
								? parseInt(val.extendedEdges.bottom as string)
								: 0,
						paddingLeft:
							val.extendedEdges &&
							typeof val.extendedEdges === "object" &&
							"left" in val.extendedEdges
								? parseInt(val.extendedEdges.left as string)
								: 0,
						paddingRight:
							val.extendedEdges &&
							typeof val.extendedEdges === "object" &&
							"right" in val.extendedEdges
								? parseInt(val.extendedEdges.right as string)
								: 0,
						hidden: false,
					});
				}
			});
			if (
				"gameScreenFrame" in json &&
				json.gameScreenFrame &&
				typeof json.gameScreenFrame === "object"
			) {
				const screenInputDefault = {
					x: 0,
					y: 0,
					width: 0,
					height: 0,
				};
				if (gameTypeIdentifier in INPUT_PRESETS) {
					screenInputDefault.width =
						INPUT_PRESETS[gameTypeIdentifier].inputScreen.width;
					screenInputDefault.height =
						INPUT_PRESETS[gameTypeIdentifier].inputScreen.height;
				}
				newElements.push({
					type: EmulatorElementType.Screen,
					data: {
						inputs: [],
						inputsobj: {
							up: "up",
							down: "down",
							left: "left",
							right: "right",
							x: "touchScreenX",
							y: "touchScreenY",
						},
						thumbstick: {
							name: "",
							width: 0,
							height: 0,
							hidden: false,
						},
						screen: screenInputDefault,
					},
					x:
						"x" in json.gameScreenFrame
							? parseInt(json.gameScreenFrame.x as string)
							: 0,
					y:
						"y" in json.gameScreenFrame
							? parseInt(json.gameScreenFrame.y as string)
							: 0,
					width:
						"width" in json.gameScreenFrame
							? parseInt(json.gameScreenFrame.width as string)
							: 0,
					height:
						"height" in json.gameScreenFrame
							? parseInt(json.gameScreenFrame.height as string)
							: 0,
					paddingTop: 0,
					paddingBottom: 0,
					paddingLeft: 0,
					paddingRight: 0,
					hidden: false,
				});
			}
			if (
				"screens" in json &&
				json.screens &&
				Array.isArray(json.screens)
			) {
				json.screens?.forEach((val: Record<string, object>) => {
					newElements.push({
						type: EmulatorElementType.Screen,
						data: {
							inputs: [],
							inputsobj: {
								up: "up",
								down: "down",
								left: "left",
								right: "right",
								x: "touchScreenX",
								y: "touchScreenY",
							},
							thumbstick: {
								name: "",
								width: 0,
								height: 0,
								hidden: false,
							},
							screen: {
								x:
									"x" in val.inputFrame
										? parseInt(val.inputFrame.x as string)
										: 0,
								y:
									"y" in val.inputFrame
										? parseInt(val.inputFrame.y as string)
										: 0,
								width:
									"width" in val.inputFrame
										? parseInt(
												val.inputFrame.width as string,
											)
										: 0,
								height:
									"height" in val.inputFrame
										? parseInt(
												val.inputFrame.height as string,
											)
										: 0,
							},
						},
						x:
							"x" in val.outputFrame
								? parseInt(val.outputFrame.x as string)
								: 0,
						y:
							"y" in val.outputFrame
								? parseInt(val.outputFrame.y as string)
								: 0,
						width:
							"width" in val.outputFrame
								? parseInt(val.outputFrame.width as string)
								: 0,
						height:
							"height" in val.outputFrame
								? parseInt(val.outputFrame.height as string)
								: 0,
						paddingTop: 0,
						paddingBottom: 0,
						paddingLeft: 0,
						paddingRight: 0,
						hidden: false,
					});
				});
			}
			const newLayoutData: Mutable<EmulatorLayout> =
				structuredClone(defaultLayout);
			newLayoutData.lockBackgroundRatio = false;
			if (json.mappingSize) {
				if ("width" in json.mappingSize) {
					newLayoutData.canvas.width = parseInt(
						json.mappingSize.width as unknown as string,
					);
				}
				if ("height" in json.mappingSize) {
					newLayoutData.canvas.height = parseInt(
						json.mappingSize.height as unknown as string,
					);
				}
			}
			if (json.extendedEdges) {
				if ("top" in json.extendedEdges) {
					newLayoutData.padding.top = parseInt(
						json.extendedEdges.top,
					);
				}
				if ("bottom" in json.extendedEdges) {
					newLayoutData.padding.bottom = parseInt(
						json.extendedEdges.bottom,
					);
				}
				if ("left" in json.extendedEdges) {
					newLayoutData.padding.left = parseInt(
						json.extendedEdges.left,
					);
				}
				if ("right" in json.extendedEdges) {
					newLayoutData.padding.right = parseInt(
						json.extendedEdges.right,
					);
				}
			}
			if ("translucent" in json) {
				newLayoutData.translucent = json.translucent as boolean;
			} else {
				newLayoutData.translucent = false;
			}
			if (json.assets) {
				if ("resizable" in json.assets) {
					newLayoutData.assets.type = AssetType.PDF;
					newLayoutData.assets.resizable = json.assets.resizable;
				} else if (
					"small" in json.assets ||
					"medium" in json.assets ||
					"large" in json.assets
				) {
					newLayoutData.assets.type = AssetType.PNG;
					if ("small" in json.assets) {
						newLayoutData.assets.small = json.assets.small;
					}
					if ("medium" in json.assets) {
						newLayoutData.assets.medium = json.assets.medium;
					}
					if ("large" in json.assets) {
						newLayoutData.assets.large = json.assets.large;
					}
				} else {
					newLayoutData.assets.type = AssetType.PDF;
				}
			} else {
				newLayoutData.assets.type = AssetType.PDF;
			}
			representationObj.elements = newElements;
			representationObj.layout = newLayoutData;
			return representationObj;
		} catch (e) {
			console.error("Error parsing JSON representation!", e);
			showPopup(<JSONParseError />, () => {});
		}
		return null;
	};

	useEffect(() => {
		if (!historyInfo.isHistoryEdit) {
			historyInfo.writing = true;
			const timeout = setTimeout(() => {
				if (!historyInfo.isHistoryEdit) {
					setHistory((oldHistory) => {
						const newHistory =
							historyInfo.currentState != oldHistory.length &&
							historyInfo.currentState <= MAX_HISTORY
								? oldHistory.slice(0, historyInfo.currentState)
								: oldHistory.slice(-MAX_HISTORY);
						newHistory.push({
							infoFile: structuredClone(infoFile),
							currentRepresentation: currentRepresentation,
							focusState: focusState,
						});
						historyInfo.currentState = newHistory.length;
						return newHistory;
					});
				}
				historyInfo.writing = false;
			}, HISTORY_DEBOUNCE);
			return () => {
				clearTimeout(timeout);
				historyInfo.writing = false;
			};
		} else if (!historyInfo.processing) {
			historyInfo.isHistoryEdit = false;
		}
	}, [infoFile]);

	const revertHistory: (index: number) => void = (index: number) => {
		if (index <= history.length && index > 0) {
			historyInfo.isHistoryEdit = true;
			historyInfo.processing = true;
			const newRepresentation = getRepresentation(
				history[index - 1].infoFile,
				history[index - 1].currentRepresentation,
			);
			if (
				newRepresentation &&
				editingElement >= newRepresentation.elements.length
			) {
				setEditingElement(-1);
			}
			if (
				newRepresentation &&
				hoverIndex >= newRepresentation.elements.length
			) {
				setHoverIndex(-1);
			}
			setFocusState(history[index - 1].focusState);
			setInfoFile(history[index - 1].infoFile);
			setCurrentRepresentation(history[index - 1].currentRepresentation);
			historyInfo.currentState = index;
			historyInfo.processing = false;
		}
	};

	const showPopup: ShowPopupFunc = (
		data: React.JSX.Element,
		onClose: () => void,
		onAccept?: () => void,
	) => {
		setPopups([
			...popups.slice(),
			{
				data: data,
				onClose: onClose,
				...(onAccept === undefined ? {} : { onAccept: onAccept }),
			},
		]);
	};

	const showContextMenu: ShowContextMenuFunc = (
		data: ContextMenu.Entry[],
		x: number,
		y: number,
	) => {
		setContextMenu({
			data: data,
			x: x,
			y: y,
		});
	};

	const getCurrentBackgroundAssetName: () => string = () => {
		const representation = getRepresentation(
			infoFile,
			currentRepresentation,
		);
		if (representation) {
			const layoutData = representation.layout;
			let targetAsset: string = "";
			switch (layoutData.assets.type) {
				case AssetType.PDF:
					targetAsset = layoutData.assets.resizable;
					break;
				case AssetType.PNG:
					if (layoutData.assets.large.length > 0)
						targetAsset = layoutData.assets.large;
					else if (layoutData.assets.medium.length > 0)
						targetAsset = layoutData.assets.medium;
					else if (layoutData.assets.small.length > 0)
						targetAsset = layoutData.assets.small;
					break;
			}
			return targetAsset;
		}
		return "";
	};

	const representation = getRepresentation(infoFile, currentRepresentation);
	const currentElements: EmulatorElement[] = representation
		? representation.elements
		: [];
	const currentLayout: EmulatorLayout | null = representation
		? representation.layout
		: null;

	const newProject = useCallback(() => {
		setInfoFile(defaultInfoFile);
		const newRepresentation = getFirstRepresentation(defaultInfoFile);
		if (newRepresentation.length > 0)
			applyRepresentation(newRepresentation, defaultInfoFile);
		else clearUI();
		historyInfo.writing = false;
		historyInfo.currentState = 0;
		historyInfo.processing = false;
		historyInfo.isHistoryEdit = false;
		setHistory([]);
	}, []);

	const extraClasses = useMemo(() => {
		const ret = [];
		switch (preferences.theme) {
			case Preferences.Theme.DARK:
				ret.push(themes.dark);
				break;
			case Preferences.Theme.LIGHT:
				break;
			case Preferences.Theme.DEFAULT:
			default:
				if (
					window.matchMedia &&
					window.matchMedia("(prefers-color-scheme: dark)").matches
				)
					ret.push(themes.dark);
				break;
		}
		switch (preferences.colorScheme) {
			case Preferences.ColorScheme.DEUTERANOMALY:
				ret.push(colorSchemes.deuteranomaly);
				break;
			case Preferences.ColorScheme.PROTANOMALY:
				ret.push(colorSchemes.protanomaly);
				break;
			case Preferences.ColorScheme.TRITANOMALY:
				ret.push(colorSchemes.tritanomaly);
				break;
			case Preferences.ColorScheme.DEFAULT:
			default:
				break;
		}
		return ret.join(" ");
	}, [preferences]);

	const showPreferences = useCallback(() => {
		setPreferencesVisible(true);
	}, []);

	return (
		<div className={`${themes.root} ${extraClasses}`}>
			<main
				className={styles.main}
				inert={
					popups.length > 0 || contextMenu.data || preferencesVisible
						? ("" as unknown as boolean)
						: undefined
				}
				onScrollCapture={(e: React.UIEvent) => {
					if (e.target === e.currentTarget) {
						(e.target as HTMLElement).scrollTop = 0;
						(e.target as HTMLElement).scrollLeft = 0;
						e.preventDefault();
					}
				}}
			>
				<MenuBar
					canRedo={historyInfo.currentState < history.length}
					canUndo={
						historyInfo.currentState > 1 || historyInfo.writing
					}
					clearUI={newProject}
					getReferencedAssets={getReferencedAssets}
					loadDeltaskin={loadDeltaskin}
					parseJSON={parseJSON}
					redo={() => {
						if (historyInfo.currentState < history.length) {
							revertHistory(historyInfo.currentState + 1);
						}
					}}
					saveDeltaskin={saveDeltaskin}
					saveJSON={saveJSON}
					setAssets={setAssets}
					setScale={setScale}
					setSidebarVisibility={setSidebarVisibility}
					showPopup={showPopup}
					showPreferences={showPreferences}
					undo={() => {
						if (historyInfo.writing) {
							revertHistory(historyInfo.currentState);
						} else if (historyInfo.currentState > 1) {
							revertHistory(historyInfo.currentState - 1);
						}
					}}
				/>

				<Sidebar
					hiddenNarrow={sidebarVisibility.left}
					position={SidebarPosition.LEFT}
					requestVisible={() => {
						setSidebarVisibility({
							left: false,
							right: true,
						});
					}}
				>
					<SkinInfoWindow
						infoFile={infoFile}
						setInfoFile={updateSkinState}
					/>
					<RepresentationTreeWindow
						applyRepresentation={applyRepresentation}
						createNode={createNode}
						currentRepresentation={currentRepresentation}
						deleteNode={deleteNode}
						infoFile={infoFile}
						showContextMenu={showContextMenu}
						showPopup={showPopup}
					/>
				</Sidebar>

				<VisualEditor
					addElementData={addElementData}
					assets={assets}
					editingElement={editingElement}
					elements={currentElements}
					focusState={focusState}
					getCurrentBackgroundAssetName={
						getCurrentBackgroundAssetName
					}
					hoverIndex={hoverIndex}
					layoutData={currentLayout}
					pressedKeys={pressedKeys}
					removeElement={removeElement}
					scale={scale}
					setAssets={setAssets}
					setEditingElement={setEditingElement}
					setHoverIndex={setHoverIndex}
					setScale={setScale}
					showContextMenu={showContextMenu}
					showPopup={showPopup}
					updateElement={updateElement}
				/>

				<Sidebar
					hiddenNarrow={sidebarVisibility.right}
					position={SidebarPosition.RIGHT}
					requestVisible={() => {
						setSidebarVisibility({
							left: true,
							right: false,
						});
					}}
				>
					<div>
						<ZoomWindow
							currentRepresentation={currentRepresentation}
							scale={scale}
							setScale={setScale}
						/>
						<ElementListWindow
							addElement={addElement}
							addElementData={addElementData}
							editingElement={editingElement}
							elements={currentElements}
							hoverIndex={hoverIndex}
							layoutData={currentLayout}
							removeElement={removeElement}
							setEditingElement={setEditingElement}
							setHoverIndex={setHoverIndex}
							showContextMenu={showContextMenu}
							showPopup={showPopup}
							updateAllElements={(
								elements: Spec<EmulatorElement[], never>,
							) => {
								updateRepresentationState(
									{ elements: elements },
									currentRepresentation,
								);
							}}
							updateElement={updateElement}
						/>
					</div>
					<div>
						<ElementValueWindow
							addAsset={addAsset}
							addElementData={addElementData}
							assets={assets}
							currentRepresentation={currentRepresentation}
							editingElement={editingElement}
							elements={currentElements}
							getCurrentBackgroundAssetName={
								getCurrentBackgroundAssetName
							}
							infoFile={infoFile}
							layoutData={currentLayout}
							removeElement={removeElement}
							setAssets={setAssets}
							setEditingElement={setEditingElement}
							setLayoutData={(
								layout: Spec<EmulatorLayout, never>,
							) => {
								updateRepresentationState(
									{ layout: layout },
									currentRepresentation,
								);
							}}
							showPopup={showPopup}
							updateElement={updateElement}
						/>
					</div>
				</Sidebar>
			</main>

			<div className={styles.overlay}>
				{preferencesVisible && (
					<CenteredElement>
						<Popup
							onClose={() => {}}
							removeSelf={() => setPreferencesVisible(false)}
						>
							<PreferencesWindow
								preferences={preferences}
								setPreferences={updatePreferences}
							/>
						</Popup>
					</CenteredElement>
				)}
				<PopupWrapper elements={popups} setPopups={setPopups} />

				<ContextMenu.Wrapper
					clear={() => {
						setContextMenu({
							data: null,
							x: 0,
							y: 0,
						});
					}}
					menu={contextMenu}
				/>
			</div>
		</div>
	);
}
