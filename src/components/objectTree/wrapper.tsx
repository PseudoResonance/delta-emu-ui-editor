"use client";
import React, { CSSProperties } from "react";

export default function TreeWrapper(args: {
	ariaLabel?: string;
	children?: React.JSX.Element | React.JSX.Element[];
	style?: CSSProperties | undefined;
}) {
	return (
		<div
			aria-label={args.ariaLabel ? args.ariaLabel : undefined}
			onKeyDown={(e) => {
				if (e.target === e.currentTarget && e.key === "Enter") {
					const node = (e.target as HTMLElement).querySelector(
						'[data-type="tree-node"]',
					);
					if (node) (node as HTMLElement).focus();
				}
			}}
			role={"tree"}
			style={args.style}
			tabIndex={0}
		>
			{...args.children
				? args.children instanceof Array
					? args.children
					: [args.children]
				: []}
		</div>
	);
}
