import { redirect } from "next/navigation";

import { AdminFrame } from "@/components/admin-frame";
import { getDemoSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getDemoSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <AdminFrame
      eyebrow="Admin Workspace"
      title="個人販売者向け AI 一次受け"
      description="ダッシュボード、設定、履歴の route skeleton を先に固定している。setup から publish までの導線をこの shell に載せる。"
      session={session}
    >
      {children}
    </AdminFrame>
  );
}
