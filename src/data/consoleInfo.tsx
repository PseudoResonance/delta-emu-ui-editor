"use client";

import { EmulatorElementType } from "@/data/types";

interface ConsoleInfo {
	buttons: {
		[key in EmulatorElementType]?: {
			values: string[] | Record<string, string[]>;
		};
	};
	inputScreen: {
		height: number;
		width: number;
	};
	name: string;
	screens: {
		height: number;
		width: number;
		x: number;
		y: number;
	}[];
}

const INPUT_PRESETS: Record<string, ConsoleInfo> = {
	"com.rileytestut.delta.game.ds": {
		buttons: {
			[EmulatorElementType.Default]: {
				values: [
					"a",
					"b",
					"x",
					"y",
					"select",
					"start",
					"l",
					"r",
					"menu",
					"quickSave",
					"quickLoad",
					"fastForward",
					"toggleFastForward",
				],
			},
			[EmulatorElementType.Dpad]: {
				values: {
					down: ["down"],
					left: ["left"],
					right: ["right"],
					up: ["up"],
				},
			},
			[EmulatorElementType.Thumbstick]: {
				values: {
					down: ["down"],
					left: ["left"],
					right: ["right"],
					up: ["up"],
				},
			},
			[EmulatorElementType.Touchscreen]: {
				values: {
					x: ["touchScreenX"],
					y: ["touchScreenY"],
				},
			},
		},
		inputScreen: {
			height: 384,
			width: 256,
		},
		name: "Nintendo DS",
		screens: [
			{
				height: 192,
				width: 256,
				x: 0,
				y: 0,
			},
			{
				height: 192,
				width: 256,
				x: 0,
				y: 192,
			},
		],
	},
	"com.rileytestut.delta.game.gba": {
		buttons: {
			[EmulatorElementType.Default]: {
				values: [
					"a",
					"b",
					"select",
					"start",
					"l",
					"r",
					"menu",
					"quickSave",
					"quickLoad",
					"fastForward",
					"toggleFastForward",
				],
			},
			[EmulatorElementType.Dpad]: {
				values: {
					down: ["down"],
					left: ["left"],
					right: ["right"],
					up: ["up"],
				},
			},
			[EmulatorElementType.Thumbstick]: {
				values: {
					down: ["down"],
					left: ["left"],
					right: ["right"],
					up: ["up"],
				},
			},
		},
		inputScreen: {
			height: 160,
			width: 240,
		},
		name: "GameBoy Advance",
		screens: [
			{
				height: 160,
				width: 240,
				x: 0,
				y: 0,
			},
		],
	},
	"com.rileytestut.delta.game.gbc": {
		buttons: {
			[EmulatorElementType.Default]: {
				values: [
					"a",
					"b",
					"select",
					"start",
					"menu",
					"quickSave",
					"quickLoad",
					"fastForward",
					"toggleFastForward",
				],
			},
			[EmulatorElementType.Dpad]: {
				values: {
					down: ["down"],
					left: ["left"],
					right: ["right"],
					up: ["up"],
				},
			},
			[EmulatorElementType.Thumbstick]: {
				values: {
					down: ["down"],
					left: ["left"],
					right: ["right"],
					up: ["up"],
				},
			},
		},
		inputScreen: {
			height: 144,
			width: 160,
		},
		name: "GameBoy (Color)",
		screens: [
			{
				height: 144,
				width: 160,
				x: 0,
				y: 0,
			},
		],
	},
	"com.rileytestut.delta.game.genesis": {
		buttons: {
			[EmulatorElementType.Default]: {
				values: [
					"a",
					"b",
					"c",
					"x",
					"y",
					"start",
					"mode",
					"z",
					"menu",
					"quickSave",
					"quickLoad",
					"fastForward",
					"toggleFastForward",
				],
			},
			[EmulatorElementType.Dpad]: {
				values: {
					down: ["down"],
					left: ["left"],
					right: ["right"],
					up: ["up"],
				},
			},
			[EmulatorElementType.Thumbstick]: {
				values: {
					down: ["down"],
					left: ["left"],
					right: ["right"],
					up: ["up"],
				},
			},
		},
		inputScreen: {
			height: 240,
			width: 320,
		},
		name: "Sega Genesis",
		screens: [
			{
				height: 224,
				width: 320,
				x: 0,
				y: 0,
			},
			{
				height: 224,
				width: 256,
				x: 0,
				y: 0,
			},
			{
				height: 240,
				width: 320,
				x: 0,
				y: 0,
			},
		],
	},
	"com.rileytestut.delta.game.n64": {
		buttons: {
			[EmulatorElementType.Default]: {
				values: [
					"a",
					"b",
					"start",
					"cUp",
					"cDown",
					"cLeft",
					"cRight",
					"l",
					"r",
					"z",
					"menu",
					"quickSave",
					"quickLoad",
					"fastForward",
					"toggleFastForward",
				],
			},
			[EmulatorElementType.Dpad]: {
				values: {
					down: ["down"],
					left: ["left"],
					right: ["right"],
					up: ["up"],
				},
			},
			[EmulatorElementType.Thumbstick]: {
				values: {
					down: ["analogStickDown"],
					left: ["analogStickLeft"],
					right: ["analogStickRight"],
					up: ["analogStickUp"],
				},
			},
		},
		inputScreen: {
			height: 224,
			width: 256,
		},
		name: "Nintendo 64",
		screens: [
			{
				height: 224,
				width: 256,
				x: 0,
				y: 0,
			},
		],
	},
	"com.rileytestut.delta.game.nes": {
		buttons: {
			[EmulatorElementType.Default]: {
				values: [
					"a",
					"b",
					"select",
					"start",
					"menu",
					"quickSave",
					"quickLoad",
					"fastForward",
					"toggleFastForward",
				],
			},
			[EmulatorElementType.Dpad]: {
				values: {
					down: ["down"],
					left: ["left"],
					right: ["right"],
					up: ["up"],
				},
			},
			[EmulatorElementType.Thumbstick]: {
				values: {
					down: ["down"],
					left: ["left"],
					right: ["right"],
					up: ["up"],
				},
			},
		},
		inputScreen: {
			height: 240,
			width: 256,
		},
		name: "Nintendo Entertainment System",
		screens: [
			{
				height: 240,
				width: 256,
				x: 0,
				y: 0,
			},
		],
	},
	"com.rileytestut.delta.game.snes": {
		buttons: {
			[EmulatorElementType.Default]: {
				values: [
					"a",
					"b",
					"x",
					"y",
					"select",
					"start",
					"l",
					"r",
					"menu",
					"quickSave",
					"quickLoad",
					"fastForward",
					"toggleFastForward",
				],
			},
			[EmulatorElementType.Dpad]: {
				values: {
					down: ["down"],
					left: ["left"],
					right: ["right"],
					up: ["up"],
				},
			},
			[EmulatorElementType.Thumbstick]: {
				values: {
					down: ["down"],
					left: ["left"],
					right: ["right"],
					up: ["up"],
				},
			},
		},
		inputScreen: {
			height: 224,
			width: 256,
		},
		name: "Super Nintendo Entertainment System",
		screens: [
			{
				height: 224,
				width: 256,
				x: 0,
				y: 0,
			},
		],
	},
};

export default INPUT_PRESETS;
