import { adminRoutes } from "@ichijiuke/domain";
import { AppShell } from "@ichijiuke/ui";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppShell
      eyebrow="Admin Workspace"
      title="個人販売者向け AI 一次受け"
      description="ダッシュボード、設定、履歴の route skeleton を先に固定している。setup から publish までの導線をこの shell に載せる。"
      nav={adminRoutes}
      currentPath=""
    >
      {children}
    </AppShell>
  );
}
