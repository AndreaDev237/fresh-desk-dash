import { createFileRoute } from "@tanstack/react-router";

/**
 * Webhook chiamato dal database (trigger + pg_net) ogni volta che
 * viene creato un nuovo ordine. Simula una notifica al team frutteria:
 * qui si loggano solamente i dettagli, ma in produzione potrebbe
 * inviare un messaggio Slack/Telegram/email.
 *
 * Route pubblica (bypassa auth) — protetta da un secret condiviso
 * nell'header `x-notify-secret` per evitare chiamate da estranei.
 */
export const Route = createFileRoute("/api/public/hooks/notify-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.NOTIFY_ORDER_SECRET;
        if (!secret) {
          console.error("[notify-order] NOTIFY_ORDER_SECRET non configurato");
          return new Response("Server misconfigured", { status: 500 });
        }

        const provided = request.headers.get("x-notify-secret");
        if (provided !== secret) {
          console.warn("[notify-order] secret non valido");
          return new Response("Unauthorized", { status: 401 });
        }

        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const order = payload as {
          code?: string;
          total?: number;
          pickup_name?: string;
          pickup_detail?: string;
          items?: Array<{ name?: string; qty?: number }>;
          user_id?: string;
          created_at?: string;
        };

        const itemsSummary =
          order.items
            ?.map((i) => `${i.qty ?? 1}× ${i.name ?? "?"}`)
            .join(", ") ?? "(nessun dettaglio)";

        console.log("🍎 [Fresh Desk] NUOVO ORDINE RICEVUTO");
        console.log("─────────────────────────────────────");
        console.log(`Codice:      ${order.code ?? "?"}`);
        console.log(`Totale:      € ${order.total?.toFixed(2) ?? "?"}`);
        console.log(`Ritiro:      ${order.pickup_name ?? "?"}`);
        console.log(`Dettaglio:   ${order.pickup_detail ?? "?"}`);
        console.log(`Prodotti:    ${itemsSummary}`);
        console.log(`Utente:      ${order.user_id ?? "?"}`);
        console.log(`Creato il:   ${order.created_at ?? new Date().toISOString()}`);
        console.log("─────────────────────────────────────");

        return Response.json({
          ok: true,
          code: order.code,
          notified_at: new Date().toISOString(),
        });
      },
    },
  },
});
