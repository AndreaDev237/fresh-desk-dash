import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Header } from "@/components/fb/Header";
import { BottomNav } from "@/components/fb/BottomNav";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    throw redirect({ to: "/auth" });
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-[520px] flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[64px] pb-[84px]">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
