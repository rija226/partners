import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next/pages";
import * as S from "./SearchBox.style";

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.5" />
      <line x1="11.25" y1="11.25" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function SearchBox() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();

    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = value.trim();
    if (!query) return;
    router.push({ pathname: "/accommodation", query: { search: query } });
    setOpen(false);
  };

  return (
    <S.Wrapper ref={wrapperRef}>
      <S.IconButton
        type="button"
        $active={open}
        onClick={() => setOpen((v) => !v)}
        aria-label={t("search.label")}
        aria-expanded={open}
      >
        <SearchIcon />
      </S.IconButton>
      {open && (
        <S.Panel onSubmit={handleSubmit} role="search">
          <S.Input
            ref={inputRef}
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={t("search.placeholder")}
          />
          <S.SubmitButton type="submit" aria-label={t("search.label")}>
            <SearchIcon />
          </S.SubmitButton>
        </S.Panel>
      )}
    </S.Wrapper>
  );
}
