import { useNavigate } from "@tanstack/react-router";
import { Globe, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/services/errors";
import { isValidWebsiteUrl, normalizeUrl } from "@/utils/url";

import { useCreateAudit } from "./hooks";

/** URL input that POSTs /audits and opens the audit report. */
export function QuickAuditForm({ size = "default", autoFocus = false }: { size?: "default" | "lg"; autoFocus?: boolean }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const createAudit = useCreateAudit();
  const navigate = useNavigate();

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!isValidWebsiteUrl(value)) {
      setError("Enter a valid website address, e.g. https://example.com");
      return;
    }
    setError(null);
    const url = normalizeUrl(value);
    createAudit.mutate(url, {
      onSuccess: (data) => {
        toast.success("Audit queued", { description: url });
        void navigate({ to: "/audits/$id", params: { id: data.audit_id } });
      },
      onError: (err) => toast.error("Couldn't start the audit", { description: getErrorMessage(err) }),
    });
  };

  const large = size === "lg";
  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <label htmlFor={large ? "audit-url-lg" : "audit-url"} className="sr-only">
        Website URL
      </label>
      <div className={cn("flex flex-col gap-2 sm:flex-row", large && "sm:gap-3")}>
        <div className="relative flex-1">
          <Globe className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            id={large ? "audit-url-lg" : "audit-url"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="https://example.com"
            inputMode="url"
            autoComplete="url"
            autoFocus={autoFocus}
            aria-invalid={!!error}
            aria-describedby={error ? "audit-url-error" : undefined}
            className={cn("pl-9", large && "h-11 text-base")}
          />
        </div>
        <Button type="submit" disabled={createAudit.isPending} size={large ? "lg" : "default"} className={cn(large && "h-11")}>
          {createAudit.isPending && <Loader2 className="animate-spin" />}
          {createAudit.isPending ? "Starting…" : "Start Audit"}
        </Button>
      </div>
      {error && (
        <p id="audit-url-error" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </form>
  );
}
