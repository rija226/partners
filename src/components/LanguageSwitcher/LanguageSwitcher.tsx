import { useRef, useState } from "react";
import { useRouter } from "next/router";
import * as S from "./LanguageSwitcher.style";

const LOCALE_LABELS: Record<string, string> = { en: "English", hr: "Hrvatski" };

export default function LanguageSwitcher() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  const currentLocale = router.locale ?? "en";
  const locales = router.locales ?? ["en", "hr"];

  return (
    <S.Wrapper onMouseEnter={openMenu} onMouseLeave={scheduleClose}>
      <S.Trigger onClick={() => setOpen((v) => !v)} aria-haspopup="menu" aria-expanded={open}>
        {currentLocale.toUpperCase()} <span>▾</span>
      </S.Trigger>
      {open && (
        <S.Menu role="menu" onMouseEnter={openMenu} onMouseLeave={scheduleClose}>
          {locales.map((loc) => (
            <S.MenuItem
              key={loc}
              href={{ pathname: router.pathname, query: router.query }}
              locale={loc}
              $active={loc === currentLocale}
              role="menuitem"
            >
              {LOCALE_LABELS[loc] ?? loc}
            </S.MenuItem>
          ))}
        </S.Menu>
      )}
    </S.Wrapper>
  );
}
