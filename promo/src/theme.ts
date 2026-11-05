import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

/* The same typefaces as the app itself. The files live in public/fonts, so
   rendering needs no network. The Chinese file holds only 向量场画板中文. */
const faces: [string, string, string][] = [
  ["Source Serif 4", "SourceSerif4-500.woff2", "500"],
  ["Source Serif 4", "SourceSerif4-600.woff2", "600"],
  ["IBM Plex Sans", "IBMPlexSans-400.woff2", "400"],
  ["IBM Plex Sans", "IBMPlexSans-600.woff2", "600"],
  ["JetBrains Mono", "JetBrainsMono-400.woff2", "400"],
  ["Noto Serif SC", "NotoSerifSC-500-subset.woff2", "500"],
];
for (const [family, file, weight] of faces) {
  loadFont({ family, url: staticFile(`fonts/${file}`), weight, display: "block" });
}

/* CSS font-family values. Names are quoted: "Source Serif 4" ends in a digit,
   which is not valid unquoted CSS. */
export const serif = '"Source Serif 4", Georgia, serif';
export const sans = '"IBM Plex Sans", system-ui, sans-serif';
export const mono = '"JetBrains Mono", ui-monospace, monospace';
export const zh = '"Noto Serif SC", serif';
