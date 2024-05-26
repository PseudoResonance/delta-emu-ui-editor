import * as ContextMenu from "@/components/contextMenu";

export enum EmulatorElementType {
	Thumbstick = "Thumbstick",
	Dpad = "Dpad",
	Touchscreen = "Touchscreen",
	Screen = "Screen",
	Default = "Default",
}

interface EmulatorElementBase {
	readonly type: EmulatorElementType;
	readonly x: number;
	readonly y: number;
	readonly width: number;
	readonly height: number;
	readonly hidden: boolean;
}

interface EmulatorElementThumbstick extends EmulatorElementBase {
	readonly data: {
		readonly inputsobj: {
			readonly up: string;
			readonly down: string;
			readonly left: string;
			readonly right: string;
		};
		readonly thumbstick: {
			readonly name: string;
			readonly width: number;
			readonly height: number;
			readonly hidden: boolean;
		};
	};
	readonly paddingTop: number;
	readonly paddingBottom: number;
	readonly paddingLeft: number;
	readonly paddingRight: number;
}

interface EmulatorElementDpad extends EmulatorElementBase {
	readonly data: {
		readonly inputsobj: {
			readonly up: string;
			readonly down: string;
			readonly left: string;
			readonly right: string;
		};
	};
	readonly paddingTop: number;
	readonly paddingBottom: number;
	readonly paddingLeft: number;
	readonly paddingRight: number;
}

interface EmulatorElementTouchscreen extends EmulatorElementBase {
	readonly data: {
		readonly inputsobj: {
			readonly x: string;
			readonly y: string;
		};
	};
	readonly paddingTop: number;
	readonly paddingBottom: number;
	readonly paddingLeft: number;
	readonly paddingRight: number;
}

interface EmulatorElementScreen extends EmulatorElementBase {
	readonly data: {
		readonly screen: {
			readonly x: number;
			readonly y: number;
			readonly width: number;
			readonly height: number;
		};
	};
}

interface EmulatorElementDefault extends EmulatorElementBase {
	readonly data: {
		readonly inputs: string[];
	};
	readonly paddingTop: number;
	readonly paddingBottom: number;
	readonly paddingLeft: number;
	readonly paddingRight: number;
}

export type EmulatorElement = EmulatorElementDefault &
	EmulatorElementScreen &
	EmulatorElementTouchscreen &
	EmulatorElementDpad &
	EmulatorElementThumbstick;

export enum AssetType {
	PDF = "PDF",
	PNG = "PNG",
}

export interface EmulatorLayout {
	readonly lockBackgroundRatio: boolean;
	readonly assets: {
		readonly type: AssetType;
		readonly resizable: string;
		readonly small: string;
		readonly medium: string;
		readonly large: string;
	};
	readonly canvas: {
		readonly width: number;
		readonly height: number;
	};
	readonly padding: {
		readonly top: number;
		readonly bottom: number;
		readonly left: number;
		readonly right: number;
	};
	readonly translucent: boolean;
}

export interface Representation {
	readonly elements: EmulatorElement[];
	readonly layout: EmulatorLayout;
}

export interface InfoFile {
	readonly name: string;
	readonly identifier: string;
	readonly gameTypeIdentifier: string;
	readonly debug: boolean;
	readonly representations: Record<
		string,
		Record<string, Record<string, Representation>>
	>;
}

export interface Asset {
	readonly file: File;
	type: AssetType | null;
	url: string | null;
	width: number;
	height: number;
	attemptLoad?: boolean;
}

export interface HistoryEvent {
	readonly infoFile: InfoFile;
	readonly currentRepresentation: string;
	readonly focusState: FocusState;
}

type ImmutableObject<T> = {
	readonly [K in keyof T]: Immutable<T[K]>;
};

export type Immutable<T> = {
	// eslint-disable-next-line @typescript-eslint/ban-types
	readonly [K in keyof T]: T[K] extends Function
		? T[K]
		: ImmutableObject<T[K]>;
};

type MutableObject<T> = {
	-readonly [K in keyof T]: Mutable<T[K]>;
};

export type Mutable<T> = {
	// eslint-disable-next-line @typescript-eslint/ban-types
	-readonly [K in keyof T]: T[K] extends Function
		? T[K]
		: MutableObject<T[K]>;
};

export type ShowPopupFunc = (
	popup: React.JSX.Element,
	onClose: () => void,
	onAccept?: () => void,
) => void;

export type ShowContextMenuFunc = (
	data: ContextMenu.Entry[],
	x: number,
	y: number,
) => void;

export interface ScaleData {
	scale: number;
	xOffset: number;
	yOffset: number;
}

export enum FocusTarget {
	ELEMENT = "ELEMENT",
	REPRESENTATION = "REPRESENTATION",
}

export interface FocusState {
	target: FocusTarget | null;
	elements: number[];
	representation: string;
}
