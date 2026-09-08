import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import styled from "styled-components";
import { ADMIN_COOKIE_NAME } from "@helpers/auth-cookie-name";

const Wrapper = styled.div`
  max-width: 32rem;
  margin: 0 auto;
  padding: 3rem 1rem;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: 0.875rem;
  color: #64748b;
  text-decoration: underline;
  cursor: pointer;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0;
  outline: none;
  background: white;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
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

const SubmitButton = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.colors.buttonBg};
  color: white;
  font-weight: 700;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatusBox = styled.div<{ $error?: boolean }>`
  padding: 0.75rem 1rem;
  border-radius: 0;
  font-size: 0.875rem;
  background: ${({ $error }) => ($error ? "#fef2f2" : "#f0fdf4")};
  border: 1px solid ${({ $error }) => ($error ? "#fecaca" : "#bbf7d0")};
  color: ${({ $error }) => ($error ? "#b91c1c" : "#15803d")};
`;

const NOTIFY_TYPES = [
  { value: "factSheetGroup", label: "New fact sheet published" },
  { value: "galleryBlock", label: "New images added" },
] as const;

// Internal tool, not partner-facing — no i18n/Layout, plain English only.
export default function AdminPage() {
  const router = useRouter();
  const [type, setType] = useState<string>(NOTIFY_TYPES[0].value);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<{ message: string; error?: boolean } | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin-logout", { method: "POST" });
    router.push("/admin/login");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);
    setIsSending(true);

    try {
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, title }),
      });
      const data = await response.json();

      if (!response.ok) {
        setStatus({ message: data.error || "Failed to send notification", error: true });
      } else {
        setStatus({ message: `Notification sent to ${data.sent} partner${data.sent === 1 ? "" : "s"}.` });
        setTitle("");
      }
    } catch {
      setStatus({ message: "An error occurred. Please try again.", error: true });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Wrapper>
      <TitleRow>
        <Title>Send Partner Notification</Title>
        <LogoutButton type="button" onClick={handleLogout}>
          Logout
        </LogoutButton>
      </TitleRow>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="type">What happened</Label>
          <Select id="type" value={type} onChange={(e) => setType(e.target.value)}>
            {NOTIFY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="title">Name (shown in the email)</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Hotel Parentium Fact Sheet"
            required
          />
        </div>
        {status && <StatusBox $error={status.error}>{status.message}</StatusBox>}
        <SubmitButton type="submit" disabled={isSending}>
          {isSending ? "Sending..." : "Send notification"}
        </SubmitButton>
      </Form>
    </Wrapper>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookie = req.cookies[ADMIN_COOKIE_NAME];
  if (cookie !== "authenticated") {
    return { redirect: { destination: "/admin/login", permanent: false } };
  }
  return { props: {} };
};
