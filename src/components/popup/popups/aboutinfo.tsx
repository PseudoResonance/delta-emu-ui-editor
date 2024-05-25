"use client";
import * as CONSTANT from "@/utils/constants";

export default function AboutInfo() {
	return (
		<>
			<h2>About {CONSTANT.NAME}</h2>

			<p>
				Created By{" "}
				<a
					href="https://github.com/PseudoResonance/"
					rel="noreferrer noopener"
					target="_blank"
				>
					PseudoResonance
				</a>
				<br />
				PDF importing with{" "}
				<a
					href="https://mozilla.github.io/pdf.js/"
					rel="noreferrer noopener"
					target="_blank"
				>
					PDF.js
				</a>
				<br />
				Zip file support with{" "}
				<a
					href="https://gildas-lormeau.github.io/zip.js/"
					rel="noreferrer noopener"
					target="_blank"
				>
					ZIP.js
				</a>
				<br />
				Vectors and icons by{" "}
				<a
					href="https://www.svgrepo.com"
					rel="noreferrer noopener"
					target="_blank"
				>
					SVG Repo
				</a>
			</p>
		</>
	);
}
