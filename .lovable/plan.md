## Obiettivo
Aggiungere un toggle tema (chiaro/scuro) nell'header con icone sole/luna. Cliccando si alterna il tema; la scelta persiste tra sessioni.

## Cambiamenti

### 1. `src/styles.css` — variante dark
- Aggiungere un blocco `.dark { ... }` con override dei token colore chiave (background, surface, surface-container*, on-surface, on-surface-variant, outline, outline-variant, card, popover, muted, accent, border, input, ring-offset-background, primary-container tuning se serve) per una palette scura coerente con Fresh Desk (verde primario mantenuto, sfondi scuri es. `#101410` / `#181c18`, testo chiaro).
- Il custom variant `dark` esiste già (`@custom-variant dark (&:is(.dark *))`), quindi utilities `dark:` funzionano, ma la strategia principale è l'override dei CSS variables su `.dark` così i componenti esistenti si adattano senza modifiche.

### 2. `src/lib/theme.tsx` (nuovo) — ThemeProvider
- Context con `theme: 'light' | 'dark'` e `toggleTheme()`.
- Init: legge `localStorage.getItem('fb-theme')`; fallback a `light` (per evitare mismatch SSR non tenta di leggere `prefers-color-scheme` prima dell'hydration).
- `useEffect` applica/rimuove la classe `dark` su `document.documentElement` e persiste in localStorage.
- Aggiornare `theme-color` meta opzionalmente (nice-to-have, non bloccante).

### 3. `src/routes/__root.tsx`
- Avvolgere `<CartProvider>` con `<ThemeProvider>` (dentro `QueryClientProvider`, fuori/dentro `AuthProvider` — lo metto come outermost dopo QueryClient così è disponibile ovunque).

### 4. `src/components/fb/ThemeToggle.tsx` (nuovo)
- Bottone rotondo 44×44 (coerente col carrello) con `aria-label` dinamico ("Attiva tema scuro" / "Attiva tema chiaro"), `aria-pressed`.
- Icona: Material Symbols `light_mode` quando tema è dark (mostra cosa attiverai) oppure convenzione opposta — scelgo la convenzione comune: mostra l'icona del tema **corrente** (`light_mode` se light, `dark_mode` se dark). Al click chiama `toggleTheme()`.
- Classe `press` e hover come il bottone carrello.

### 5. `src/components/fb/Header.tsx`
- Inserire `<ThemeToggle />` a sinistra del link carrello nella parte destra dell'header.

## Non fare
- Nessuna modifica alle pagine, al carrello, alla logica di business.
- Nessuna preferenza di sistema auto-applicata (evita FOUC/hydration mismatch); solo scelta esplicita utente, default light.
- Nessuna animazione elaborata (basta la transizione colori esistente).

## Verifica
- Toggle nell'header, click alterna tema, refresh mantiene la scelta, tutte le schermate (home, carrello, checkout, conferma, ordini, profilo, auth) restano leggibili in dark.