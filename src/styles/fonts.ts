import localFont from "next/font/local";

export const circe = localFont({
  src: [
    // CRC55__W.woff2 is a corrupted/truncated file (its own woff2 header declares 202180
    // bytes, the file on disk is 202179) — Next's font parser fails to load it, confirmed by
    // the same "woff2 throws a next/font error!" workaround already used in the other project
    // that ships this same font. The .woff sibling is intact, so it stands in until a proper
    // re-export of the .woff2 is provided.
    { path: "../../public/fonts/CRC55__W.woff", weight: "400", style: "normal" },
    { path: "../../public/fonts/CRC65__W.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
});
