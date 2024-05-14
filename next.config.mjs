/** @type {import('next').NextConfig} */

import { PHASE_DEVELOPMENT_SERVER } from "next/dist/shared/lib/constants.js";

const defaultConfig = {};

const nextConfig = (phase) => {
	if (phase === PHASE_DEVELOPMENT_SERVER) {
		return {
			...defaultConfig,
		};
	}

	return {
		...defaultConfig,
		output: "standalone",
		basePath: "/deltaemu",
	};
};

export default nextConfig;
