"use client";

import ValueInput from "../inputs/valueinput";
import CheckboxInput from "../inputs/checkbox";
import { InfoFile, ShowContextMenuFunc, ShowPopupFunc } from "@/data/types";
import * as Tree from "../objectTree";

export default function RepresentationTreeWindow(args: {
	infoFile: InfoFile;
	applyRepresentation: (key: string) => void;
	currentRepresentation: string;
	showPopup: ShowPopupFunc;
	showContextMenu: ShowContextMenuFunc;
	deleteNode: (key: string) => void;
	createNode: (key: string, isLayout: boolean) => void;
}) {
	const getChildren: (
		e: Record<string, unknown>,
		keyStr: string,
		depth: number,
	) => React.JSX.Element[] = (e, keyStr, depth) => {
		if (e && !("elements" in e) && !("layout" in e)) {
			return Object.keys(e)
				.sort()
				.map((key: string, i: number) => (
					<Tree.Item
						data={e[key] as Record<string, unknown>}
						depth={depth + 1}
						getChildren={getChildren}
						key={i}
						keyStr={`${keyStr}.${key}`}
						label={key}
						onClick={() => {
							args.applyRepresentation(
								`${keyStr}.${key}`.slice(1),
							);
						}}
						onContextMenu={(event) => {
							event.preventDefault();
							const menuElements = [];
							if (
								!(
									"elements" in
									(e[key] as Record<string, unknown>)
								) &&
								!(
									"layout" in
									(e[key] as Record<string, unknown>)
								)
							) {
								const newData = ["", depth >= 1];
								menuElements.push({
									label: "Add Node",
									onClick: () => {
										args.showPopup(
											<>
												<h2>Create Node</h2>
												<p>
													Add a node under &quot;
													{`${keyStr}.${key}`.slice(
														1,
													)}
													&quot;
												</p>
												<ValueInput
													context={"-1"}
													label="Name"
													onChange={(val: string) => {
														newData[0] = val;
													}}
													value=""
												/>
												<CheckboxInput
													onChange={(
														val: boolean,
													) => {
														newData[1] = val;
													}}
													value={depth >= 1}
												>
													Layout Node
												</CheckboxInput>
											</>,
											() => {},
											() => {
												if (
													(newData[0] as string)
														.length > 0
												) {
													args.createNode(
														`${keyStr}.${key}.${newData[0]}`.slice(
															1,
														),
														newData[1] as boolean,
													);
												}
											},
										);
									},
								});
							}
							args.showContextMenu(
								[
									...menuElements,
									{
										label: "Delete",
										onClick: () => {
											args.showPopup(
												<>
													<h2>Warning</h2>

													<p>
														Confirm deleting &quot;
														{`${keyStr}.${key}`.slice(
															1,
														)}
														&quot;
													</p>
												</>,
												() => {},
												() => {
													args.deleteNode(
														`${keyStr}.${key}`.slice(
															1,
														),
													);
												},
											);
										},
									},
								],
								event.pageX,
								event.pageY,
							);
						}}
						showActive={
							`${keyStr}.${key}`.slice(1) ===
							args.currentRepresentation
						}
					/>
				));
		} else {
			return [];
		}
	};
	return (
		<Tree.Wrapper style={{ padding: "3px 5px" }}>
			<Tree.Item
				data={args.infoFile.representations}
				depth={0}
				getChildren={getChildren}
				keyStr=""
				label="representations"
				onContextMenu={(event) => {
					event.preventDefault();
					const newData = ["", false];
					args.showContextMenu(
						[
							{
								label: "Add Node",
								onClick: () => {
									args.showPopup(
										<>
											<h2>Create Node</h2>
											<p>
												Add a node under
												&quot;Representations&quot;
											</p>

											<ValueInput
												context={"-1"}
												label="Name"
												onChange={(val: string) => {
													newData[0] = val;
												}}
												value=""
											/>

											<CheckboxInput
												onChange={(val: boolean) => {
													newData[1] = val;
												}}
												value={false}
											>
												Layout Node
											</CheckboxInput>
										</>,
										() => {},
										() => {
											if (
												(newData[0] as string).length >
												0
											) {
												args.createNode(
													String(newData[0]),
													newData[1] as boolean,
												);
											}
										},
									);
								},
							},
						],
						event.pageX,
						event.pageY,
					);
				}}
			/>
		</Tree.Wrapper>
	);
}
