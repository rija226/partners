import Image from "next/image";
import AccommodationDropdown from "@components/AccommodationDropdown/AccommodationDropdown";
import LanguageSwitcher from "@components/LanguageSwitcher/LanguageSwitcher";
import SearchBox from "@components/SearchBox/SearchBox";
import MobileMenu from "./MobileMenu";
import * as S from "./Header.style";

export default function Header() {
  return (
    <S.Wrapper>
      <S.Bar>
        <S.LeftGroup>
          <nav>
            <AccommodationDropdown />
          </nav>
          <MobileMenu />
        </S.LeftGroup>
        <S.LogoLink href="/">
          <Image
            src="/cropped-PL-Partners-LOGO-manji.png"
            alt="Plava Laguna Partners"
            width={200}
            height={200}
            style={{ height: "100%", width: "auto", objectFit: "contain" }}
            priority
          />
        </S.LogoLink>
        <S.RightGroup>
          <SearchBox />
          <LanguageSwitcher />
        </S.RightGroup>
      </S.Bar>
    </S.Wrapper>
  );
}
