import Image from "next/image";
import AccommodationDropdown from "@components/AccommodationDropdown/AccommodationDropdown";
import LanguageSwitcher from "@components/LanguageSwitcher/LanguageSwitcher";
import * as S from "./Header.style";

export default function Header() {
  return (
    <S.Wrapper>
      <S.Bar>
        <nav>
          <AccommodationDropdown />
        </nav>
        <S.LogoLink href="/">
          <Image
            src="/plava-laguna-partners-logo.png"
            alt="Plava Laguna Partners"
            width={150}
            height={80}
            style={{ height: "100%", width: "auto", objectFit: "contain" }}
            priority
          />
        </S.LogoLink>
        <LanguageSwitcher />
      </S.Bar>
    </S.Wrapper>
  );
}
