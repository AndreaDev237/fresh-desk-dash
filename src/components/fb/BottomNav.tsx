import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const items: Array<{ to: "/" | "/orders" | "/profile"; label: string; icon: string; exact?: boolean }> = [
  { to: "/", label: "Home", icon: "home", exact: true },
  { to: "/orders", label: "Ordini", icon: "receipt_long" },
  { to: "/profile", label: "Profilo", icon: "person" },
];

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-[520px] border-t border-outline-variant/30 bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
      <ul className="flex h-[68px] items-stretch justify-around">
        {items.map((it) => {
          const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
          return (
            <li key={it.to} className="flex-1">
              <Link
                to={it.to}
                className={cn(
                  "relative flex h-full flex-col items-center justify-center gap-0.5 text-[11px] font-bold tracking-tight transition-colors",
                  active ? "text-primary" : "text-on-surface-variant/60",
                )}
              >
                {active && (
                  <span className="absolute top-0 left-1/2 h-1 w-8 -translate-x-1/2 rounded-b-full bg-primary" />
                )}
                <span
                  className={cn(
                    "material-symbols-outlined text-[24px]",
                    active && "fill",
                  )}
                >
                  {it.icon}
                </span>
                <span>{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
