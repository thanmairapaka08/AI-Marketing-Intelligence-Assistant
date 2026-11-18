import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, PlugZap } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toApiError } from "@/services/errors";
import { safeRedirect } from "@/utils/url";

import { useAuth } from "./auth-context";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

const registerSchema = z
  .object({
    full_name: z.string().trim().min(2, "Enter your full name").max(100),
    email: z.string().trim().email("Enter a valid email").max(255),
    password: z.string().min(8, "Use at least 8 characters").max(128),
    confirm_password: z.string(),
  })
  .refine((v) => v.password === v.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords don't match",
  });

type FormValues = {
  full_name?: string;
  email: string;
  password: string;
  confirm_password?: string;
};

function PasswordInput({ id, ...props }: React.ComponentProps<typeof Input>) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input id={id} type={show ? "text" : "password"} className="pr-10" {...props} />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted-foreground hover:text-foreground"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

export function AuthForm({ mode, redirect }: { mode: "login" | "register"; redirect?: string | undefined }) {
  const { login, register: registerUser, status, enterPreview } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [unreachable, setUnreachable] = useState(false);
  const isLogin = mode === "login";

  const form = useForm<FormValues>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema) as never,
    defaultValues: { email: "", password: "", full_name: "", confirm_password: "" },
  });
  const { errors, isSubmitting } = form.formState;

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    try {
      if (isLogin) await login({ email: values.email, password: values.password });
      else
        await registerUser({
          full_name: values.full_name ?? "",
          email: values.email,
          password: values.password,
        });
      toast.success(isLogin ? "Welcome back" : "Account created");
      void navigate({ to: safeRedirect(redirect) });
    } catch (error) {
      const apiError = toApiError(error);
      setUnreachable(apiError.kind === "network" || apiError.kind === "timeout");
      for (const [field, message] of Object.entries(apiError.fieldErrors)) {
        form.setError(field as keyof FormValues, { message });
      }
      setServerError(apiError.message);
    }
  });

  const showExplore = unreachable || status === "unreachable";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background bg-grid px-4 py-12">
      <div className="w-full max-w-sm animate-fade-up">
        <Link to="/" className="mb-8 flex justify-center">
          <Logo />
        </Link>
        <div className="rounded-2xl border bg-card p-6 shadow-elevated sm:p-8">
          <h1 className="text-xl font-semibold tracking-tight">{isLogin ? "Sign in" : "Create your account"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLogin ? "Welcome back. Enter your details to continue." : "Start auditing your websites in minutes."}
          </p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
            {!isLogin && (
              <div className="space-y-1.5">
                <Label htmlFor="full_name">Full name</Label>
                <Input id="full_name" autoComplete="name" aria-invalid={!!errors.full_name} {...form.register("full_name")} />
                {errors.full_name && <p className="text-xs text-danger">{errors.full_name.message}</p>}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...form.register("email")} />
              {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                aria-invalid={!!errors.password}
                {...form.register("password")}
              />
              {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
            </div>
            {!isLogin && (
              <div className="space-y-1.5">
                <Label htmlFor="confirm_password">Confirm password</Label>
                <PasswordInput
                  id="confirm_password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirm_password}
                  {...form.register("confirm_password")}
                />
                {errors.confirm_password && <p className="text-xs text-danger">{errors.confirm_password.message}</p>}
              </div>
            )}
            {serverError && (
              <p role="alert" className="rounded-md bg-danger-soft px-3 py-2 text-sm text-danger">
                {serverError}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              {isLogin ? "Sign in" : "Create account"}
            </Button>
          </form>
          {showExplore && (
            <div className="mt-5 rounded-lg border border-dashed bg-surface/60 p-4">
              <p className="flex items-center gap-2 text-sm font-medium">
                <PlugZap className="size-4 text-warning" /> Backend unreachable
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                You can still explore the interface. Pages will show honest empty states with no sample data.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={() => {
                  enterPreview();
                  void navigate({ to: "/dashboard" });
                }}
              >
                Explore without backend
              </Button>
            </div>
          )}
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isLogin ? "New here? " : "Already have an account? "}
          {isLogin ? (
            <Link to="/register" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          ) : (
            <Link to="/login" search={{}} className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          )}
        </p>
      </div>
    </div>
  );
}
