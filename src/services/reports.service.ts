import { api } from "./api";

export type ReportFormat = "pdf" | "csv" | "json";

function filenameFrom(disposition: string | undefined, fallback: string) {
  if (!disposition) return fallback;
  const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition);
  return match?.[1] ? decodeURIComponent(match[1]) : fallback;
}

export const reportsService = {
  /** Downloads a backend-generated export and saves it through the browser. */
  async download(auditId: string, format: ReportFormat) {
    const response = await api.get(`/audits/${auditId}/export/${format}`, {
      responseType: "blob",
      timeout: 120_000,
    });
    const name = filenameFrom(
      response.headers["content-disposition"] as string | undefined,
      `seo-audit-${auditId}.${format}`,
    );
    const url = URL.createObjectURL(response.data as Blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    return name;
  },
};
