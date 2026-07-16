## Obiettivo
Aggiungere una **Box del Giorno** in evidenza in home, con sconto -25% sul prezzo pieno, tempo limitato (fino al cut-off giornaliero), messa in cima al catalogo. Se in carrello: badge distintivo. Sconto quantità -15% cumulativo quando l'utente compra ≥3 unità della box del giorno.

## Cambiamenti

### 1. `src/lib/products.ts`
- Aggiungere un 4° prodotto `box-del-giorno` con:
  - `id: "box-del-giorno"`, nome es. "Box del Giorno", descrizione dedicata
  - `price`: prezzo scontato (es. 6.00) e `originalPrice: 8.00` (nuovo campo opzionale)
  - `isDeal: true` (nuovo campo)
  - `discountPct: 25` (per label)
  - Riuso dell'immagine `boxPremium` (o una delle esistenti) — non abbiamo asset nuovi
- Estendere il tipo `Product` con `originalPrice?: number`, `isDeal?: boolean`, `discountPct?: number`
- Esportare costante `DAILY_DEAL_QTY_THRESHOLD = 3` e `DAILY_DEAL_QTY_DISCOUNT = 0.15`

### 2. `src/routes/_authenticated/index.tsx` — Home
- Individuare il prodotto con `isDeal` e renderizzarlo **sopra** il resto del catalogo dentro una card "hero deal" distintiva:
  - Bordo/ring in colore `secondary-container` o gradiente, badge grande "PROMO -25%"
  - Countdown al cut-off (riuso `useCutoff()` per mostrare "Termina tra HH:MM")
  - Prezzo scontato grande + prezzo originale barrato accanto
  - Bottone "Aggiungi" identico agli altri (usa `add(p.id)`)
- Gli altri 3 prodotti continuano a renderizzarsi sotto, invariati
- Ordinamento: filtro `PRODUCTS` in due liste (`deal` + `rest`), deal sempre primo

### 3. `src/store/cart.tsx`
- Aggiungere logica sconto quantità nel `useMemo`:
  - Calcolare `dealDiscount`: se un item ha `product.isDeal` e `qty >= 3`, applicare -15% su `lineTotal` di quell'item
  - Restituire nuovi campi in `CartCtx`: `dealDiscount: number` (totale sconto in €), `subtotal` resta il subtotale pre-sconto, aggiungere `total: number` (subtotal - dealDiscount)
- I `lineTotal` in `detailed` restano al prezzo pieno; lo sconto è mostrato come riga separata (più chiaro per l'utente)

### 4. `src/routes/_authenticated/cart.tsx`
- Nell'item del carrello, se `product.isDeal`:
  - Mostrare badge "PROMO -25%" accanto al nome
  - Bordo/accent colorato sulla card (`border-secondary`)
  - Se `qty >= 3`: piccola label sotto il prezzo "Sconto 3+ attivo: -15%"
  - Se `qty < 3` e `qty >= 1`: hint "Aggiungi {3-qty} per -15%"
- Sezione totali: aggiungere riga "Sconto quantità" (solo se > 0) tra Subtotale e Totale
- Totale finale usa `total` invece di `subtotal`
- Passare il totale scontato al checkout (già usa il context, quindi automatico se checkout legge `total`)

### 5. `src/routes/_authenticated/checkout.tsx` & `confirmation.$orderId.tsx`
- Verificare che leggano `total` (nuovo) invece di `subtotal` per l'importo pagato. Aggiornare se necessario.

## Non fare
- Nessuna modifica a auth, cut-off, punti di ritiro, tema
- Nessun nuovo asset immagine (riuso di quelli esistenti)
- Nessuna rotazione dinamica: la box del giorno è un prodotto fisso hardcoded (coerente con "catalogo fisso")

## Verifica
- Home: box del giorno in cima, badge -25%, prezzo barrato visibile
- Aggiunta al carrello funziona
- Carrello: card evidenziata, hint sotto 3, sconto -15% attivo da 3+
- Totale riflette lo sconto; checkout e conferma mostrano l'importo corretto
- Gli altri 3 box funzionano come prima