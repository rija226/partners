import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { appWithTranslation } from "next-i18next/pages";
import { theme } from "@/src/styles/theme";
import { circe } from "@/src/styles/fonts";
import RouteProgress from "@components/RouteProgress/RouteProgress";

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <div className={circe.className} style={{ display: "contents" }}>
        <RouteProgress />
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  );
}

export default appWithTranslation(App);
