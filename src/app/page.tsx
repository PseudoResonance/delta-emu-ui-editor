"use client";
import React, { useEffect, useState } from 'react';
import MenuBar from '@/components/menubar/menubar';
import Sidebar from "@/components/sidebar/sidebar";
import MainEditor from "@/components/editor/editor";
import styles from "@/app/main.module.css";
import RightSidebar from '@/components/sidebar/rightsidebar';
import PopupHolder from '@/components/popup/popupholder';
import ContextMenuHolder from '@/components/popup/contextmenuholder';

const MAX_HISTORY = 100;
const HISTORY_DEBOUNCE = 100;

const historyInfo = { writing: false, isHistoryEdit: false, currentState: 0, processing: false };

const defaultLayout = {
    background: {
        url: "",
        naturalHeight: -1,
        naturalWidth: -1,
        lockRatio: false,
    },
    assets: {},
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

export default function Home() {
    const [popups, setPopups] = useState<{
        data: React.JSX.Element,
        onClose: () => void,
        onAccept?: () => void,
    }[]>([]);
    const [contextMenu, setContextMenu] = useState<{
        data: {
            label: string,
            onClick: () => void,
        }[] | null,
        x: number,
        y: number,
    }>({
        data: null,
        x: 0,
        y: 0,
    });
    const [history, setHistory] = useState<Record<string, any>[]>([]);
    const [emulatorElements, setEmulatorElements] = useState<Array<{
        type: string,
        data: Record<string, any>,
        x: number,
        y: number,
        width: number,
        height: number,
        paddingTop: number,
        paddingBottom: number,
        paddingLeft: number,
        paddingRight: number,
    }>>([]);
    const [layoutData, setLayoutData] = useState<{
        background: {
            url: string,
            naturalHeight: number,
            naturalWidth: number,
            lockRatio: boolean,
        },
        assets: Record<string, string>,
        canvas: {
            width: number,
            height: number,
        },
        padding: {
            top: number,
            bottom: number,
            left: number,
            right: number,
        },
        translucent: boolean,
    }>(JSON.parse(JSON.stringify(defaultLayout)));
    const [infoFile, setInfoFile] = useState<{
        name: string,
        identifier: string,
        gameTypeIdentifier: string,
        debug: boolean,
        representations: Record<string, Record<string, Record<string, {
            elements?: {
                type: string,
                data: Record<string, any>,
                x: number,
                y: number,
                width: number,
                height: number,
                paddingTop: number,
                paddingBottom: number,
                paddingLeft: number,
                paddingRight: number,
            }[],
            layout?: {
                background: {
                    url: string,
                    naturalHeight: number,
                    naturalWidth: number,
                    lockRatio: boolean,
                },
                assets: Record<string, string>,
                canvas: {
                    width: number,
                    height: number,
                },
                padding: {
                    top: number,
                    bottom: number,
                    left: number,
                    right: number,
                },
                translucent: boolean,
            },
        }>>>,
    }>({
        name: "",
        identifier: "",
        gameTypeIdentifier: "",
        debug: false,
        representations: {
            iphone: {
                standard: {
                    portrait: {
                        elements: [],
                        layout: JSON.parse(JSON.stringify(defaultLayout)),
                    },
                    landscape: {
                        elements: [],
                        layout: JSON.parse(JSON.stringify(defaultLayout)),
                    },
                },
                edgeToEdge: {
                    portrait: {
                        elements: [],
                        layout: JSON.parse(JSON.stringify(defaultLayout)),
                    },
                    landscape: {
                        elements: [],
                        layout: JSON.parse(JSON.stringify(defaultLayout)),
                    },
                },
            },
            ipad: {
                standard: {
                    portrait: {
                        elements: [],
                        layout: JSON.parse(JSON.stringify(defaultLayout)),
                    },
                    landscape: {
                        elements: [],
                        layout: JSON.parse(JSON.stringify(defaultLayout)),
                    },
                },
                splitView: {
                    portrait: {
                        elements: [],
                        layout: JSON.parse(JSON.stringify(defaultLayout)),
                    },
                    landscape: {
                        elements: [],
                        layout: JSON.parse(JSON.stringify(defaultLayout)),
                    },
                },
            },
        },
    });
    const [currentRepresentation, setCurrentRepresentation] = useState<string>('iphone.standard.portrait');
    const [scale, setScale] = useState<number>(1);
    const [xOffset, setXOffset] = useState<number>(0);
    const [yOffset, setYOffset] = useState<number>(0);
    const [editingElement, setEditingElement] = useState<number>(-1);
    const [hoverIndex, setHoverIndex] = useState<number>(-1);
    const [pressedKeys, setPressedKeys] = useState<String[]>([]);

    const addElement = () => {
        setEmulatorElements([...emulatorElements, {
            type: "",
            data: { inputs: [], inputsobj: { up: "up", down: "down", left: "left", right: "right", x: "touchScreenX", y: "touchScreenY" }, thumbstick: { name: "", width: 0, height: 0 }, screen: { x: 0, y: 0, width: 0, height: 0 } },
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
        }]);
    };

    const addElementData = (data: {
        type: string,
        data: Record<string, any>,
        x: number,
        y: number,
        width: number,
        height: number,
        paddingTop: number,
        paddingBottom: number,
        paddingLeft: number,
        paddingRight: number,
    }) => {
        setEmulatorElements([...emulatorElements, data]);
    };

    const updateElement = (key: number, data: {
        type: string,
        data: Record<string, any>,
        x: number,
        y: number,
        width: number,
        height: number,
        paddingTop: number,
        paddingBottom: number,
        paddingLeft: number,
        paddingRight: number,
    }) => {
        const newElements = emulatorElements.slice();
        newElements[key] = data;
        setEmulatorElements(newElements);
    }

    const setElements = (data: {
        type: string,
        data: Record<string, any>,
        x: number,
        y: number,
        width: number,
        height: number,
        paddingTop: number,
        paddingBottom: number,
        paddingLeft: number,
        paddingRight: number,
    }[]) => {
        setEmulatorElements((data as {
            type: string,
            data: Record<string, any>,
            x: number,
            y: number,
            width: number,
            height: number,
            paddingTop: number,
            paddingBottom: number,
            paddingLeft: number,
            paddingRight: number,
        }[]));
    }

    const removeElement = (key: number) => {
        const newElements = emulatorElements.slice();
        newElements.splice(key, 1);
        setEmulatorElements(newElements);
    }

    useEffect(() => {
        const keyDown = (e: KeyboardEvent) => {
            if (pressedKeys.indexOf(e.code) === -1) {
                const newElements = pressedKeys.slice();
                newElements.push(e.code);
                setPressedKeys(newElements);
            }
        };
        window.addEventListener("keydown", keyDown);

        const keyUp = (e: KeyboardEvent) => {
            const index = pressedKeys.indexOf(e.code);
            let newElements = pressedKeys.slice();
            newElements.splice(index, 1);
            setPressedKeys(newElements);
        };
        window.addEventListener("keyup", keyUp);

        const copy = (e: ClipboardEvent) => {
            if (editingElement >= 0 && e.clipboardData) {
                e.clipboardData.setData("application/deltaemuuieditor", JSON.stringify(emulatorElements[editingElement]));
                e.preventDefault();
            }
        };
        window.addEventListener("copy", copy);

        const paste = (e: ClipboardEvent) => {
            if (e.clipboardData && e.clipboardData.types.includes("application/deltaemuuieditor")) {
                setEmulatorElements([...emulatorElements, {
                    ...JSON.parse(e.clipboardData.getData("application/deltaemuuieditor")),
                }]);
                e.preventDefault();
            }
        };
        window.addEventListener("paste", paste);

        return () => {
            window.removeEventListener("keydown", keyDown);
            window.removeEventListener("keyup", keyUp);
            window.removeEventListener("copy", copy);
            window.removeEventListener("paste", paste);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editingElement]);

    const createNode = (key: string, isLayout: boolean) => {
        const newInfoFile = Object.assign({}, infoFile);
        const parts = key.split('.');
        let data: any = newInfoFile.representations;
        parts.forEach((val: string, i: number) => {
            if (i == parts.length - 1) {
                data[val] = isLayout ? {
                    elements: [],
                    layout: JSON.parse(JSON.stringify(defaultLayout)),
                } : {};
            } else {
                data = data[val];
            }
        });
        setInfoFile(newInfoFile);
    };

    const deleteNode = (key: string) => {
        const newInfoFile = Object.assign({}, infoFile);
        const parts = key.split('.');
        let data: any = newInfoFile.representations;
        parts.forEach((val: string, i: number) => {
            if (i == parts.length - 1) {
                delete data[val];
            } else {
                data = data[val];
            }
        });
        setInfoFile(newInfoFile);
        if (currentRepresentation.startsWith(key)) {
            loadFirstRepresentation(newInfoFile);
        }
    };

    const applyRepresentation = (key: string) => {
        const partsOld = currentRepresentation.split('.');
        const newInfoFile = Object.assign({}, infoFile);
        let dataOld: any = newInfoFile.representations;
        partsOld.forEach((val: string) => {
            dataOld = dataOld[val];
        });
        const parts = key.split('.');
        let data: any = infoFile.representations;
        parts.forEach((val: string) => {
            data = data[val];
        });
        if ("layout" in data && "elements" in data) {
            dataOld.layout = layoutData;
            dataOld.elements = emulatorElements;
            setInfoFile(newInfoFile);
            setLayoutData(data.layout);
            setElements(data.elements);
            setEditingElement(-1);
            setCurrentRepresentation(key);
        }
    };

    const loadFirstRepresentation = (newInfoFile: any) => {
        let done = false;
        const recurse = (data: any, dataKey: string) => {
            if ("elements" in data || "layout" in data) {
                if (!done) {
                    done = true;
                    setLayoutData(data.layout);
                    setElements(data.elements);
                    setEditingElement(-1);
                    setCurrentRepresentation(dataKey.slice(1));
                }
                return true;
            } else {
                Object.keys(data).sort().find((key: string) => {
                    return recurse(data[key], `${dataKey}.${key}`);
                });
                return false;
            }
        };
        recurse(newInfoFile.representations, "");
        if (!done)
            clearUI();
    };

    const clearUI = () => {
        setLayoutData({
            background: {
                url: "",
                naturalHeight: -1,
                naturalWidth: -1,
                lockRatio: false,
            },
            assets: {},
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
        });
        setElements([]);
        setEditingElement(-1);
        setCurrentRepresentation('');
    };

    const saveJSON = () => {
        const exportObj: {
            name: string,
            identifier: string,
            gameTypeIdentifier: string,
            debug: boolean,
            representations: Record<string, any>,
        } = {
            name: "name" in infoFile ? infoFile.name : "",
            identifier: "identifier" in infoFile ? infoFile.identifier : "",
            gameTypeIdentifier: "gameTypeIdentifier" in infoFile ? infoFile.gameTypeIdentifier : "",
            debug: "debug" in infoFile ? infoFile.debug : false,
            representations: {},
        };
        if ("representations" in infoFile) {
            const recurse = (data: any, newInfoFileKey: string, newInfoFile: any) => {
                if ("elements" in data || "layout" in data) {
                    newInfoFile[newInfoFileKey] = saveRepresentation(data);
                } else {
                    Object.keys(data).forEach((key: string) => {
                        newInfoFile[newInfoFileKey][key] = {};
                        recurse(data[key], key, newInfoFile[newInfoFileKey]);
                    });
                }
            };
            recurse(infoFile.representations, "representations", exportObj);
        }
        return exportObj;
    };

    const saveRepresentation = (data: Record<string, any>) => {
        const exportObj: {
            assets: Record<string, string>,
            items: {
                inputs: String[],
                frame: {
                    x: number,
                    y: number,
                    width: number,
                    height: number,
                },
                extendedEdges: {
                    top: number,
                    bottom: number,
                    left: number,
                    right: number,
                },
            }[],
            screens: {
                inputFrame: {
                    x: number,
                    y: number,
                    width: number,
                    height: number,
                },
                outputFrame: {
                    x: number,
                    y: number,
                    width: number,
                    height: number,
                },
            }[],
            mappingSize: {
                width: number,
                height: number,
            },
            extendedEdges: {
                top: number,
                bottom: number,
                left: number,
                right: number,
            },
            translucent: boolean,
        } = {
            assets: data.layout.assets.type === "pdf" ? {
                resizable: data.layout.assets.resizable ? data.layout.assets.resizable : "",
            } : {
                small: data.layout.assets.small ? data.layout.assets.small : "",
                medium: data.layout.assets.medium ? data.layout.assets.medium : "",
                large: data.layout.assets.large ? data.layout.assets.large : "",
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
        data.elements.forEach((val: any) => {
            let inputs: any = [];
            const thumbstick: any = {};
            switch (val.type) {
                case "thumbstick":
                    thumbstick.thumbstick = {
                        name: val.data.thumbstick.name,
                        width: val.data.thumbstick.width ? Math.round(val.data.thumbstick.width) : 0,
                        height: val.data.thumbstick.height ? Math.round(val.data.thumbstick.height) : 0,
                    };
                case "dpad":
                    inputs = {
                        up: val.data.inputsobj.up ? val.data.inputsobj.up : "",
                        down: val.data.inputsobj.down ? val.data.inputsobj.down : "",
                        left: val.data.inputsobj.left ? val.data.inputsobj.left : "",
                        right: val.data.inputsobj.right ? val.data.inputsobj.right : "",
                    };
                    break;
                case "touchscreen":
                    inputs = {
                        x: val.data.inputsobj.x ? Math.round(val.data.inputsobj.x) : 0,
                        y: val.data.inputsobj.y ? Math.round(val.data.inputsobj.y) : 0,
                    };
                    break;
                case "screen":
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
                default:
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

    const parseJSON = (json: Record<string, any>) => {
        try {
            const newInfoFile: Record<string, any> = {};
            newInfoFile.name = "name" in json ? json.name : "";
            newInfoFile.identifier = "identifier" in json ? json.identifier : "";
            newInfoFile.gameTypeIdentifier = "gameTypeIdentifier" in json ? json.gameTypeIdentifier : "";
            newInfoFile.debug = "debug" in json ? json.debug : false;
            newInfoFile.representations = {};
            if ("representations" in json) {
                const recurse = (data: any, newInfoFileKey: string, newInfoFile: any) => {
                    if ("items" in data || "assets" in data || "mappingSize" in data) {
                        newInfoFile[newInfoFileKey] = parseRepresentation(data);
                    } else {
                        Object.keys(data).forEach((key: string) => {
                            newInfoFile[newInfoFileKey][key] = {};
                            recurse(data[key], key, newInfoFile[newInfoFileKey]);
                        });
                    }
                };
                recurse(json.representations, "representations", newInfoFile);
            }
            setInfoFile(newInfoFile as any);
            loadFirstRepresentation(newInfoFile);
            historyInfo.writing = false;
            historyInfo.currentState = 0;
            historyInfo.processing = false;
            historyInfo.isHistoryEdit = false;
            setHistory([]);
        } catch (e) {
            console.error("Error parsing JSON!", e);
            showPopup(<><h1>Error</h1><p>Unable to parse JSON!</p></>, () => {});
        }
    };

    const parseRepresentation = (json: Record<string, any>) => {
        try {
            const representationObj: {
                elements: Record<string, any>[],
                layout: Record<string, any>,
            } = {
                elements: [],
                layout: {},
            };
            const newElements: {
                type: string,
                data: Record<string, any>,
                x: number,
                y: number,
                width: number,
                height: number,
                paddingTop: number,
                paddingBottom: number,
                paddingLeft: number,
                paddingRight: number,
            }[] = [];
            json.items?.forEach((val: any) => {
                let type = "";
                let data = {
                    inputs: [],
                    inputsobj: {
                        up: "up",
                        down: "down",
                        left: "left",
                        right: "right",
                        x: "touchScreenX",
                        y: "touchScreenY"
                    },
                    thumbstick: {
                        name: "",
                        width: 0,
                        height: 0
                    },
                    screen: {
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 0
                    },
                };
                if (val.inputs instanceof Array) {
                    data.inputs = val.inputs ? val.inputs : [];
                } else if (val.inputs instanceof Object) {
                    if ("x" in val.inputs && "y" in val.inputs) {
                        type = "touchscreen";
                        data.inputsobj.x = val.inputs?.x ? val.inputs.x : "";
                        data.inputsobj.y = val.inputs?.y ? val.inputs.y : "";
                    } else {
                        type = "dpad";
                        data.inputsobj.up = val.inputs?.up ? val.inputs.up : "";
                        data.inputsobj.down = val.inputs?.down ? val.inputs.down : "";
                        data.inputsobj.left = val.inputs?.left ? val.inputs.left : "";
                        data.inputsobj.right = val.inputs?.right ? val.inputs.right : "";
                        if (val.thumbstick) {
                            type = "thumbstick";
                            data.thumbstick.name = val.thumbstick?.name ? val.thumbstick.name : "";
                            data.thumbstick.width = val.thumbstick?.width ? val.thumbstick.width : 0;
                            data.thumbstick.height = val.thumbstick?.height ? val.thumbstick.height : 0;
                        }
                    }
                }
                newElements.push({
                    type: type,
                    data: data,
                    x: val.frame?.x ? parseInt(val.frame.x) : 0,
                    y: val.frame?.y ? parseInt(val.frame.y) : 0,
                    width: val.frame?.width ? parseInt(val.frame.width) : 0,
                    height: val.frame?.height ? parseInt(val.frame.height) : 0,
                    paddingTop: val.extendedEdges?.top ? parseInt(val.extendedEdges.top) : 0,
                    paddingBottom: val.extendedEdges?.bottom ? parseInt(val.extendedEdges.bottom) : 0,
                    paddingLeft: val.extendedEdges?.left ? parseInt(val.extendedEdges.left) : 0,
                    paddingRight: val.extendedEdges?.right ? parseInt(val.extendedEdges.right) : 0,
                });
            });
            json.screens?.forEach((val: any) => {
                newElements.push({
                    type: "screen",
                    data: {
                        inputs: [],
                        inputsobj: { up: "up", down: "down", left: "left", right: "right", x: "touchScreenX", y: "touchScreenY" },
                        thumbstick: { name: "", width: 0, height: 0 },
                        screen: {
                            x: val.inputFrame?.x ? parseInt(val.inputFrame.x) : 0,
                            y: val.inputFrame?.y ? parseInt(val.inputFrame.y) : 0,
                            width: val.inputFrame?.width ? parseInt(val.inputFrame.width) : 0,
                            height: val.inputFrame?.height ? parseInt(val.inputFrame.height) : 0,
                        },
                    },
                    x: val.outputFrame?.x ? parseInt(val.outputFrame.x) : 0,
                    y: val.outputFrame?.y ? parseInt(val.outputFrame.y) : 0,
                    width: val.outputFrame?.width ? parseInt(val.outputFrame.width) : 0,
                    height: val.outputFrame?.height ? parseInt(val.outputFrame.height) : 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                });
            });
            const newLayoutData: {
                background: {
                    url: string,
                    naturalHeight: number,
                    naturalWidth: number,
                    lockRatio: boolean,
                },
                assets: Record<string, string>,
                canvas: {
                    width: number,
                    height: number,
                },
                padding: {
                    top: number,
                    bottom: number,
                    left: number,
                    right: number,
                },
                translucent: boolean,
            } = JSON.parse(JSON.stringify(layoutData));
            newLayoutData.background.url = "";
            newLayoutData.background.naturalHeight = -1;
            newLayoutData.background.naturalWidth = -1;
            newLayoutData.background.lockRatio = false;
            if (json.mappingSize) {
                if ("width" in json.mappingSize) {
                    newLayoutData.canvas.width = parseInt(json.mappingSize.width);
                }
                if ("height" in json.mappingSize) {
                    newLayoutData.canvas.height = parseInt(json.mappingSize.height);
                }
            }
            if (json.extendedEdges) {
                if ("top" in json.extendedEdges) {
                    newLayoutData.padding.top = parseInt(json.extendedEdges.top);
                }
                if ("bottom" in json.extendedEdges) {
                    newLayoutData.padding.bottom = parseInt(json.extendedEdges.bottom);
                }
                if ("left" in json.extendedEdges) {
                    newLayoutData.padding.left = parseInt(json.extendedEdges.left);
                }
                if ("right" in json.extendedEdges) {
                    newLayoutData.padding.right = parseInt(json.extendedEdges.right);
                }
            }
            if ("translucent" in json) {
                newLayoutData.translucent = json.translucent;
            } else {
                newLayoutData.translucent = false;
            }
            if (json.assets) {
                if ("resizable" in json.assets) {
                    newLayoutData.assets.type = "pdf";
                    newLayoutData.assets.resizable = json.assets.resizable;
                } else {
                    newLayoutData.assets.type = "png";
                    if ("small" in json.assets) {
                        newLayoutData.assets.small = json.assets.small;
                    }
                    if ("medium" in json.assets) {
                        newLayoutData.assets.medium = json.assets.medium;
                    }
                    if ("large" in json.assets) {
                        newLayoutData.assets.large = json.assets.large;
                    }
                }
            }
            representationObj.elements = newElements;
            representationObj.layout = newLayoutData;
            return representationObj;
        } catch (e) {
            console.error("Error parsing JSON representation!", e);
            showPopup(<><h1>Error</h1><p>Unable to parse JSON!</p></>, () => {});
        }
        return null;
    };

    useEffect(() => {
        if (!historyInfo.isHistoryEdit) {
            historyInfo.writing = true;
            const timeout = setTimeout(() => {
                if (!historyInfo.isHistoryEdit) {
                    const newHistory = historyInfo.currentState != history.length && historyInfo.currentState <= MAX_HISTORY ? history.slice(0, historyInfo.currentState) : history.slice(-MAX_HISTORY);
                    newHistory.push({
                        elements: structuredClone(emulatorElements),
                        layout: structuredClone(layoutData),
                        infoFile: structuredClone(infoFile),
                        currentRepresentation: currentRepresentation,
                    });
                    historyInfo.currentState = newHistory.length;
                    setHistory(newHistory);
                }
                historyInfo.writing = false;
            }, HISTORY_DEBOUNCE);
            return () => {
                clearTimeout(timeout);
            };
        } else if (!historyInfo.processing) {
            historyInfo.isHistoryEdit = false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [emulatorElements, layoutData, infoFile, currentRepresentation]);

    const revertHistory = (index: number) => {
        if (index <= history.length && index > 0) {
            historyInfo.isHistoryEdit = true;
            historyInfo.processing = true;
            setInfoFile(history[index - 1].infoFile);
            setLayoutData(history[index - 1].layout);
            setElements(history[index - 1].elements);
            setCurrentRepresentation(history[index - 1].currentRepresentation);
            if (editingElement >= history[index - 1].elements.length) {
                setEditingElement(-1);
            }
            if (hoverIndex >= history[index - 1].elements.length) {
                setHoverIndex(-1);
            }
            historyInfo.currentState = index;
            historyInfo.processing = false;
        }
    };

    const showPopup = (data: React.JSX.Element, onClose: () => void, onAccept?: () => void) => {
        setPopups([...popups.slice(), {data: data, onClose: onClose, ...(onAccept === undefined ? {} : {onAccept: onAccept})}]);
    };

    const showContextMenu = (data: {
        label: string,
        onClick: () => void,
    }[], x: number, y: number) => {
        setContextMenu({data: data, x: x, y: y});
    };

    return (
        <main className={styles.main}>
            <MenuBar showPopup={showPopup} showContextMenu={showContextMenu} elements={emulatorElements} pressedKeys={pressedKeys} canUndo={historyInfo.currentState > 1 || historyInfo.writing} undo={() => {
                if (historyInfo.writing) {
                    revertHistory(historyInfo.currentState);
                } else if (historyInfo.currentState > 1) {
                    revertHistory(historyInfo.currentState - 1);
                }
            }} canRedo={historyInfo.currentState < history.length} redo={() => {
                if (historyInfo.currentState < history.length) {
                    revertHistory(historyInfo.currentState + 1);
                }
            }} saveJSON={saveJSON} parseJSON={parseJSON} layoutData={layoutData} setLayoutData={setLayoutData} setScale={setScale} setXOffset={setXOffset} setYOffset={setYOffset} setElements={setElements} />
            <Sidebar showPopup={showPopup} showContextMenu={showContextMenu} elements={emulatorElements} pressedKeys={pressedKeys} createNode={createNode} deleteNode={deleteNode} currentRepresentation={currentRepresentation} applyRepresentation={applyRepresentation} infoFile={infoFile} setInfoFile={setInfoFile} layoutData={layoutData} setLayoutData={setLayoutData} addElementData={addElementData} addElement={addElement} updateElement={updateElement} removeElement={removeElement} setElements={setElements} editingElement={editingElement} setEditingElement={setEditingElement} />
            <MainEditor showPopup={showPopup} showContextMenu={showContextMenu} elements={emulatorElements} pressedKeys={pressedKeys} addElementData={addElementData} removeElement={removeElement} editingElement={editingElement}hoverIndex={hoverIndex} layoutData={layoutData} setLayoutData={setLayoutData} setEditingElement={setEditingElement} updateElement={updateElement} scale={scale} setScale={setScale} xOffset={xOffset} setXOffset={setXOffset} yOffset={yOffset} setYOffset={setYOffset} />
            <RightSidebar showPopup={showPopup} showContextMenu={showContextMenu} elements={emulatorElements} pressedKeys={pressedKeys} hoverIndex={hoverIndex} setHoverIndex={setHoverIndex} layoutData={layoutData} setLayoutData={setLayoutData} addElementData={addElementData} addElement={addElement} updateElement={updateElement} removeElement={removeElement} setElements={setElements} editingElement={editingElement} setEditingElement={setEditingElement} scale={scale} setScale={setScale} />
            <PopupHolder elements={popups} setPopups={setPopups} />
            <ContextMenuHolder clear={() => {
                setContextMenu({data: null, x: 0, y: 0});
            }} menu={contextMenu} />
        </main>
    );
}
