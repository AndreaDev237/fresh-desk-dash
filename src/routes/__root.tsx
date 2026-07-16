import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "@/lib/auth";
import { CartProvider } from "@/store/cart";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-on-surface">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-on-surface">Pagina non trovata</h2>
        <p className="mt-2 text-sm text-on-surface-variant">
          La pagina che cerchi non esiste o è stata spostata.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-colors hover:bg-surface-tint"
        >
          Torna alla home
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-on-surface">Impossibile caricare la pagina</h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Qualcosa è andato storto. Prova a ricaricare o torna alla home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-surface-tint"
          >
            Riprova
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-outline-variant bg-surface px-4 py-2 text-sm font-semibold text-on-surface"
          >
            Torna alla home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#3c6a00" },
      { title: "Frutteria Boolean — Ordina la tua frutta-box" },
      {
        name: "description",
        content:
          "Ordina la tua frutta-box monoporzione entro le 10:00 e ritirala in ufficio alle 13:00. Zero attese.",
      },
      { property: "og:title", content: "Frutteria Boolean — Ordina la tua frutta-box" },
      {
        property: "og:description",
        content: "Ordina la tua frutta-box monoporzione entro le 10:00 e ritirala in ufficio alle 13:00. Zero attese.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Frutteria Boolean — Ordina la tua frutta-box" },
      { name: "twitter:description", content: "Ordina la tua frutta-box monoporzione entro le 10:00 e ritirala in ufficio alle 13:00. Zero attese." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/02b460b0-a087-44bb-b964-2268bad23f07/id-preview-d29bcaa3--1b8cf52f-44d0-42a6-bd2f-7eb13ff70bcf.lovable.app-1783759591135.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/02b460b0-a087-44bb-b964-2268bad23f07/id-preview-d29bcaa3--1b8cf52f-44d0-42a6-bd2f-7eb13ff70bcf.lovable.app-1783759591135.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Outlet />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
