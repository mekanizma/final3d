import { Suspense } from "react";
import { AuthPageFallback } from "@/components/auth/AuthPageFallback";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthPageFallback />}>
      <LoginForm />
    </Suspense>
  );
}
