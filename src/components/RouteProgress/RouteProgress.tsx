import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import * as S from "./RouteProgress.style";

export default function RouteProgress() {
  const router = useRouter();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const trickleRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const start = () => {
      clearInterval(trickleRef.current);
      clearTimeout(hideTimeoutRef.current);
      setVisible(true);
      setWidth(20);
      // Real progress is unknowable (no download-progress API for a route change), so this
      // trickles toward — never reaches — 90% while the navigation is in flight.
      trickleRef.current = setInterval(() => {
        setWidth((w) => (w < 90 ? w + (90 - w) * 0.2 : w));
      }, 300);
    };

    const done = () => {
      clearInterval(trickleRef.current);
      setWidth(100);
      hideTimeoutRef.current = setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 200);
    };

    const events = router.events;
    events.on("routeChangeStart", start);
    events.on("routeChangeComplete", done);
    events.on("routeChangeError", done);

    return () => {
      events.off("routeChangeStart", start);
      events.off("routeChangeComplete", done);
      events.off("routeChangeError", done);
      clearInterval(trickleRef.current);
      clearTimeout(hideTimeoutRef.current);
    };
    // router.events is a stable singleton for the app's lifetime — depending on `router` itself
    // would re-run this effect on every navigation (its identity changes with pathname/query),
    // which tore down the hideTimeout scheduled by `done()` before it could ever fire, leaving
    // the bar stuck at 100% width forever.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <S.Bar $width={width} $visible={visible} />;
}
