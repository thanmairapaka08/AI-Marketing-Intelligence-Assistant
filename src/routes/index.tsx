import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Bot,
  FileDown,
  Gauge,
  History,
  Link2,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
} from "lucide-react";

import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { DashboardPreview } from "@/features/landing/dashboard-preview";
import { PublicNav } from "@/features/landing/public-nav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Marketing Intelligence Assistant — AI-powered SEO audits" },
      {
        name: "description",
        content: "Turn website data into smarter marketing decisions with technical SEO audits, AI recommendations and competitor benchmarks.",
      },
      { property: "og:title", content: "AI Marketing Intelligence Assistant — AI-powered SEO audits" },
      {
        property: "og:description",
        content: "Technical SEO audits, AI recommendations and competitor benchmarks in one workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

const FEATURES = [
  { icon: ScanSearch, title: "Deep technical audits", body: "Crawl your site and score titles, meta descriptions, links, alt text, headings and canonicals." },
  { icon: Gauge, title: "Weighted SEO score", body: "One transparent score out of 100, built from five weighted metrics you can drill into." },
  { icon: Sparkles, title: "AI recommendations", body: "Prioritised fixes with expected impact, effort and step-by-step guidance." },
  { icon: BarChart3, title: "Competitor benchmarks", body: "Compare technical SEO against up to three competitors, metric by metric." },
  { icon: History, title: "Audit history", body: "Track scores over time and compare any two audits side by side." },
  { icon: FileDown, title: "Exportable reports", body: "Download PDF, CSV or JSON reports to share with clients and teams." },
];

const STEPS = [
  { title: "Add your website", body: "Enter a URL. We validate it and queue a crawl straight away." },
  { title: "We crawl and score", body: "Every page is checked against five core technical SEO metrics." },
  { title: "Act on the insights", body: "Fix what matters first with prioritised, AI-assisted recommendations." },
];

const BENEFITS = [
  { icon: Target, title: "Focus on what moves rankings", body: "Severity and impact ratings keep your team on high-value fixes." },
  { icon: Timer, title: "Hours of manual checks, automated", body: "No more spreadsheets of broken links and missing tags." },
  { icon: Link2, title: "Honest link checks", body: "Timeouts are reported separately, so you only chase links that are truly broken." },
  { icon: ShieldCheck, title: "Secure by design", body: "Session cookies are HttpOnly and AI calls never run in your browser." },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-28">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground shadow-card">
            <Bot className="size-3.5 text-primary" aria-hidden /> AI-powered SEO auditing
          </p>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Turn Website Data Into Smarter Marketing Decisions
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Audit any website's technical SEO in minutes. Get a clear score, see exactly which pages need work, and follow
            prioritised AI recommendations to fix them.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/audit">
                Analyze Your Website <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#features">Explore Features</a>
            </Button>
          </div>
          <div className="mt-16 animate-fade-up">
            <DashboardPreview />
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-20 border-t bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">Features</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Everything you need to audit and improve SEO</h2>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-card p-6">
                <span className="grid size-9 place-items-center rounded-lg bg-primary-soft text-primary">
                  <Icon className="size-4" aria-hidden />
                </span>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-20 border-t">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <p className="text-sm font-medium text-primary">How it works</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">From URL to action plan in three steps</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="relative rounded-2xl border bg-card p-6 shadow-card">
                <span className="font-mono text-sm text-muted-foreground">0{index + 1}</span>
                <h3 className="mt-3 font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="benefits" className="scroll-mt-20 border-t bg-surface/40">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="text-sm font-medium text-primary">Benefits</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Built for marketers who need answers, not raw data</h2>
            <p className="mt-4 text-muted-foreground">
              Every number comes straight from the crawl. When something can't be measured, we say so instead of guessing.
            </p>
            <Button asChild className="mt-6">
              <Link to="/dashboard">
                Go to dashboard <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {BENEFITS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border bg-card p-5">
                <Icon className="size-5 text-primary" aria-hidden />
                <h3 className="mt-3 text-sm font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <Logo />
          <p>© {new Date().getFullYear()} AI Marketing Intelligence Assistant. Technical SEO insights.</p>
        </div>
      </footer>
    </div>
  );
}