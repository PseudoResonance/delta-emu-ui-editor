"use client";
import dynamic from "next/dynamic";
import React, { ReactNode } from "react";

const NoSSRWrapper = (props: { children: ReactNode }) => (
	<React.Fragment>{props.children}</React.Fragment>
);

const NoSSR = dynamic(() => Promise.resolve(NoSSRWrapper), {
	ssr: false,
});

export default NoSSR;
