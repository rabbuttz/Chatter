import type { ReactNode } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export type NavItem = {
  href: string;
  label: string;
  summary?: string;
};

function cn(...values: Array<string | false | null | undefined>) {
  return twMerge(clsx(values));
}

type AppShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  nav: readonly NavItem[];
  currentPath: string;
  children: ReactNode;
};

export function AppShell({
  eyebrow,
  title,
  description,
  nav,
  currentPath,
  children,
}: AppShellProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-10">
      <header className="rounded-[2rem] border border-line bg-surface px-6 py-6 shadow-[0_24px_80px_rgba(24,23,22,0.08)]">
        <p className="text-xs uppercase tracking-[0.28em] text-muted">{eyebrow}</p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{description}</p>
          </div>
          <a
            href="/c/demo-shop"
            className="inline-flex rounded-full border border-foreground/10 bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:translate-y-[-1px]"
          >
            public preview
          </a>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-[2rem] border border-line bg-surface px-4 py-4">
          <p className="px-3 pb-3 text-xs uppercase tracking-[0.22em] text-muted">Admin Routes</p>
          <nav className="space-y-2">
            {nav.map((item) => {
              const isActive = currentPath === item.href;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block rounded-[1.4rem] px-4 py-3 transition",
                    isActive ? "bg-foreground text-background" : "bg-transparent hover:bg-surface-strong",
                  )}
                >
                  <p className="text-sm font-semibold">{item.label}</p>
                  {item.summary ? <p className="mt-1 text-xs leading-5 opacity-80">{item.summary}</p> : null}
                </a>
              );
            })}
          </nav>
        </aside>
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}

type SectionCardProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function SectionCard({
  eyebrow,
  title,
  description,
  children,
  className,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "rounded-[2rem] border border-line bg-surface px-6 py-6 shadow-[0_18px_50px_rgba(24,23,22,0.06)]",
        className,
      )}
    >
      <p className="text-xs uppercase tracking-[0.24em] text-muted">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
      {description ? <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{description}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
  note: string;
};

export function MetricCard({ label, value, note }: MetricCardProps) {
  return (
    <div className="rounded-[1.6rem] border border-line bg-surface-strong px-4 py-4">
      <p className="text-xs uppercase tracking-[0.22em] text-muted">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-2 text-sm text-muted">{note}</p>
    </div>
  );
}

type StatusBadgeProps = {
  children?: ReactNode;
  label?: string;
  tone: "accent" | "neutral" | "warning";
};

export function StatusBadge({ children, label, tone }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase",
        tone === "accent" && "bg-accent-soft text-accent",
        tone === "neutral" && "bg-foreground/6 text-foreground",
        tone === "warning" && "bg-warning/10 text-warning",
      )}
    >
      {children ?? label}
    </span>
  );
}
