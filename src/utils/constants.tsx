export const NAME = "Delta Emulator UI Designer";
export const DESCRIPTION = "Visual UI designer for Delta Emulator";
export const SPONSOR_URLS: { name: string; url: string }[] = [
	{ name: "GitHub", url: "https://github.com/sponsors/PseudoResonance" },
	{ name: "Ko-fi", url: "https://ko-fi.com/pseudoresonance" },
];
export const CONTROLS: Record<string, string[][]> = {
	Copy: [["Ctrl", "C"]],
	Paste: [["Ctrl", "V"]],
	Undo: [
		["Ctrl", "Z"],
		["Ctrl", "Shift", "Y"],
	],
	Redo: [
		["Ctrl", "Y"],
		["Ctrl", "Shift", "Z"],
	],
	Zoom: [["Scroll Editor"]],
	Pan: [
		["Ctrl", "Drag"],
		["Middle Mouse", "Drag"],
	],
	"Resize Padding": [["Shift", "Drag Edge"]],
	"Nudge Element": [["Arrow Key"]],
	"Fast Nudge Element": [["Shift", "Arrow Key"]],
	"Delete Element": [["Backspace"], ["Delete"]],
};

export const CLIPBOARD_ELEMENT = "application/deltaemuuieditorelement";
export const CLIPBOARD_REPRESENTATION =
	"application/deltaemuuieditorrepresentation";

export const ELEMENT_BORDER_WIDTH = 2;
export const RESIZE_HANDLE_WIDTH = 15;
export const ZOOM_MAX = 100;
export const ZOOM_MIN = 0.01;
