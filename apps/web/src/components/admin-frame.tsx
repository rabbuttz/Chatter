"use client";

import type { ReactNode } from "react";

import { usePathname } from "next/navigation";

import { adminRoutes } from "@ichijiuke/domain";
import { AppShell } from "@ichijiuke/ui";

import type { DemoSession } from "@/lib/auth";

type AdminFrameProps = {
  eyebrow: string;
  title: string;
  description: string;
  session: DemoSession;
  children: ReactNode;
};

export function AdminFrame({
  eyebrow,
  title,
  description,
  session,
  children,
}: AdminFrameProps) {
  const pathname = usePathname();

  return (
    <AppShell
      eyebrow={eyebrow}
      title={title}
      description={`${description} Demo session: ${session.displayName} / ${session.email}`}
      nav={adminRoutes}
      currentPath={pathname}
    >
      {children}
    </AppShell>
  );
}
