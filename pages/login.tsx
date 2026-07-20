import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import styled from "styled-components";
import { useTranslation } from "next-i18next/pages";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import type { GetStaticProps } from "next";

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: #f8fafc;
`;

const Card = styled.div`
  width: 100%;
  max-width: 28rem;
  background: white;
  border-radius: 0;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin: 1.5rem 0 0.5rem;
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const ErrorBox = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 0.75rem 1rem;
  border-radius: 0;
  font-size: 0.875rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 600;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FooterNote = styled.p`
  font-size: 0.75rem;
  color: #94a3b8;
  text-align: center;
  margin-top: 1.5rem;
`;

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t("login.invalidPassword"));
        setIsLoading(false);
        return;
      }

      const redirect = typeof router.query.redirect === "string" ? router.query.redirect : "/";
      window.location.href = redirect;
    } catch {
      setError(t("login.error"));
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Card>
        <Image
          src="/plava-laguna-partners-logo.png"
          alt="Plava Laguna Partners"
          width={200}
          height={100}
          priority
          style={{ height: "auto", width: "auto", maxWidth: "100%" }}
        />
        <Title>{t("login.title")}</Title>
        <Description>{t("login.description")}</Description>
        <Form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="password">{t("login.password")}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("login.passwordPlaceholder")}
              required
              autoFocus
              disabled={isLoading}
            />
          </div>
          {error && <ErrorBox>{error}</ErrorBox>}
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? t("login.signingIn") : t("login.signIn")}
          </SubmitButton>
        </Form>
      </Card>
      <FooterNote>{t("login.footer")}</FooterNote>
    </Wrapper>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
});
