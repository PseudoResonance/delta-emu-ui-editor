"use client";

import { EmulatorElementType } from "@/data/types";

interface ConsoleInfo {
	name: string;
	buttons: {
		[key in EmulatorElementType]?: {
			values: string[] | Record<string, string[]>;
		};
	};
	inputScreen: {
		width: number;
		height: number;
	};
	screens: {
		x: number;
		y: number;
		width: number;
		height: number;
	}[];
}

const INPUT_PRESETS: Record<string, ConsoleInfo> = {
	"com.rileytestut.delta.game.gbc": {
		name: "GameBoy (Color)",
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
					up: ["up"],
					down: ["down"],
					left: ["left"],
					right: ["right"],
				},
			},
			[EmulatorElementType.Thumbstick]: {
				values: {
					up: ["up"],
					down: ["down"],
					left: ["left"],
					right: ["right"],
				},
			},
		},
		inputScreen: {
			width: 160,
			height: 144,
		},
		screens: [
			{
				x: 0,
				y: 0,
				width: 160,
				height: 144,
			},
		],
	},
	"com.rileytestut.delta.game.gba": {
		name: "GameBoy Advance",
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
					up: ["up"],
					down: ["down"],
					left: ["left"],
					right: ["right"],
				},
			},
			[EmulatorElementType.Thumbstick]: {
				values: {
					up: ["up"],
					down: ["down"],
					left: ["left"],
					right: ["right"],
				},
			},
		},
		inputScreen: {
			width: 240,
			height: 160,
		},
		screens: [
			{
				x: 0,
				y: 0,
				width: 240,
				height: 160,
			},
		],
	},
	"com.rileytestut.delta.game.ds": {
		name: "Nintendo DS",
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
					up: ["up"],
					down: ["down"],
					left: ["left"],
					right: ["right"],
				},
			},
			[EmulatorElementType.Thumbstick]: {
				values: {
					up: ["up"],
					down: ["down"],
					left: ["left"],
					right: ["right"],
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
			width: 256,
			height: 384,
		},
		screens: [
			{
				x: 0,
				y: 0,
				width: 256,
				height: 192,
			},
			{
				x: 0,
				y: 192,
				width: 256,
				height: 192,
			},
		],
	},
	"com.rileytestut.delta.game.nes": {
		name: "Nintendo Entertainment System",
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
					up: ["up"],
					down: ["down"],
					left: ["left"],
					right: ["right"],
				},
			},
			[EmulatorElementType.Thumbstick]: {
				values: {
					up: ["up"],
					down: ["down"],
					left: ["left"],
					right: ["right"],
				},
			},
		},
		inputScreen: {
			width: 256,
			height: 240,
		},
		screens: [
			{
				x: 0,
				y: 0,
				width: 256,
				height: 240,
			},
		],
	},
	"com.rileytestut.delta.game.snes": {
		name: "Super Nintendo Entertainment System",
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
					up: ["up"],
					down: ["down"],
					left: ["left"],
					right: ["right"],
				},
			},
			[EmulatorElementType.Thumbstick]: {
				values: {
					up: ["up"],
					down: ["down"],
					left: ["left"],
					right: ["right"],
				},
			},
		},
		inputScreen: {
			width: 256,
			height: 224,
		},
		screens: [
			{
				x: 0,
				y: 0,
				width: 256,
				height: 224,
			},
		],
	},
	"com.rileytestut.delta.game.n64": {
		name: "Nintendo 64",
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
					up: ["up"],
					down: ["down"],
					left: ["left"],
					right: ["right"],
				},
			},
			[EmulatorElementType.Thumbstick]: {
				values: {
					up: ["analogStickUp"],
					down: ["analogStickDown"],
					left: ["analogStickLeft"],
					right: ["analogStickRight"],
				},
			},
		},
		inputScreen: {
			width: 256,
			height: 224,
		},
		screens: [
			{
				x: 0,
				y: 0,
				width: 256,
				height: 224,
			},
		],
	},
	"com.rileytestut.delta.game.genesis": {
		name: "Sega Genesis",
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
					up: ["up"],
					down: ["down"],
					left: ["left"],
					right: ["right"],
				},
			},
			[EmulatorElementType.Thumbstick]: {
				values: {
					up: ["up"],
					down: ["down"],
					left: ["left"],
					right: ["right"],
				},
			},
		},
		inputScreen: {
			width: 320,
			height: 240,
		},
		screens: [
			{
				x: 0,
				y: 0,
				width: 320,
				height: 224,
			},
			{
				x: 0,
				y: 0,
				width: 256,
				height: 224,
			},
			{
				x: 0,
				y: 0,
				width: 320,
				height: 240,
			},
		],
	},
};

export default INPUT_PRESETS;
