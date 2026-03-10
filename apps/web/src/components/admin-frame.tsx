import type { ReactNode } from "react";
import { adminRoutes } from "@ichijiuke/domain";
import { AppShell } from "@ichijiuke/ui";

type AdminFrameProps = {
  currentPath: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AdminFrame({
  currentPath,
  eyebrow,
  title,
  description,
  children,
}: AdminFrameProps) {
  return (
    <AppShell
      eyebrow={eyebrow}
      title={title}
      description={description}
      nav={adminRoutes}
      currentPath={currentPath}
    >
      {children}
    </AppShell>
  );
}
