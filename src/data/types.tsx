import * as ContextMenu from "@/components/contextMenu";

/* Mutability helpers */
type ImmutableObject<T> = {
	readonly [K in keyof T]: Immutable<T[K]>;
};

export type Immutable<T> = {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
	readonly [K in keyof T]: T[K] extends Function
		? T[K]
		: ImmutableObject<T[K]>;
};

type MutableObject<T> = {
	-readonly [K in keyof T]: Mutable<T[K]>;
};

export type Mutable<T> = {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
	-readonly [K in keyof T]: T[K] extends Function
		? T[K]
		: MutableObject<T[K]>;
};

/* Element data */
export enum EmulatorElementType {
	Default = "Default",
	Dpad = "Dpad",
	Screen = "Screen",
	Thumbstick = "Thumbstick",
	Touchscreen = "Touchscreen",
}

interface EmulatorElementBase {
	readonly height: number;
	readonly hidden: boolean;
	readonly type: EmulatorElementType;
	readonly width: number;
	readonly x: number;
	readonly y: number;
}

interface EmulatorElementPadded {
	readonly paddingBottom: number;
	readonly paddingBottomGlobal: boolean;
	readonly paddingLeft: number;
	readonly paddingLeftGlobal: boolean;
	readonly paddingRight: number;
	readonly paddingRightGlobal: boolean;
	readonly paddingTop: number;
	readonly paddingTopGlobal: boolean;
}

interface EmulatorElementThumbstick
	extends EmulatorElementBase, EmulatorElementPadded {
	readonly data: {
		readonly inputsobj: {
			readonly down: string;
			readonly left: string;
			readonly right: string;
			readonly up: string;
		};
		readonly thumbstick: {
			readonly height: number;
			readonly hidden: boolean;
			readonly name: string;
			readonly width: number;
		};
	};
}

interface EmulatorElementDpad
	extends EmulatorElementBase, EmulatorElementPadded {
	readonly data: {
		readonly inputsobj: {
			readonly down: string;
			readonly left: string;
			readonly right: string;
			readonly up: string;
		};
	};
}

interface EmulatorElementTouchscreen
	extends EmulatorElementBase, EmulatorElementPadded {
	readonly data: {
		readonly inputsobj: {
			readonly x: string;
			readonly y: string;
		};
	};
}

interface EmulatorElementScreen extends EmulatorElementBase {
	readonly data: {
		readonly screen: {
			readonly height: number;
			readonly width: number;
			readonly x: number;
			readonly y: number;
		};
	};
}

interface EmulatorElementDefault
	extends EmulatorElementBase, EmulatorElementPadded {
	readonly data: {
		readonly inputs: string[];
	};
}

export type EmulatorElement = EmulatorElementDefault &
	EmulatorElementScreen &
	EmulatorElementTouchscreen &
	EmulatorElementDpad &
	EmulatorElementThumbstick;

/* Skin assets */
export enum AssetType {
	PDF = "PDF",
	PNG = "PNG",
}

export interface Asset {
	readonly attemptLoad?: boolean;
	readonly file: File;
	readonly height: number;
	readonly type: AssetType | null;
	readonly url: string | null;
	readonly width: number;
}

/* Emulator general skin and layout data */
export interface EmulatorLayout {
	readonly assets: {
		readonly large: string;
		readonly medium: string;
		readonly resizable: string;
		readonly small: string;
		readonly type: AssetType;
	};
	readonly canvas: {
		readonly height: number;
		readonly width: number;
	};
	readonly lockBackgroundRatio: boolean;
	readonly padding: {
		readonly bottom: number;
		readonly left: number;
		readonly right: number;
		readonly top: number;
	};
	readonly translucent: boolean;
}

export interface Representation {
	readonly elements: EmulatorElement[];
	readonly layout: EmulatorLayout;
}

export interface InfoFile {
	readonly debug: boolean;
	readonly gameTypeIdentifier: string;
	readonly hiddenLoadedFileName: string;
	readonly identifier: string;
	readonly name: string;
	readonly representations: Record<
		string,
		Record<string, Record<string, Representation>>
	>;
}

/* History entry */
export interface HistoryEvent {
	readonly currentRepresentation: string;
	readonly focusState: FocusState;
	readonly infoFile: InfoFile;
}

/* Editor pan/zoom state */
export interface ScaleData {
	scale: number;
	xOffset: number;
	yOffset: number;
}

/* Editor focus for copy/paste and z-index reordering */
export enum FocusTarget {
	ELEMENT = "ELEMENT",
	REPRESENTATION = "REPRESENTATION",
}

export interface FocusState {
	elements: number[];
	representation: string;
	target: FocusTarget | null;
}

/* Boilerplate types */
export type ShowPopupFunc = (
	alert: boolean,
	title: string,
	popup: React.JSX.Element,
	onClose: () => void,
	onAccept?: () => void,
) => void;

export type ShowContextMenuFunc = (
	data: ContextMenu.Entry[],
	x: number,
	y: number,
) => void;
