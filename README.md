# DubaiCar – Valutatore Import Auto (Web App)

Stack: Next.js 14 (App Router) · TypeScript · Prisma · PostgreSQL (Supabase) · TailwindCSS

## Funzioni MVP
- CRUD veicoli (marca, modello, anno, km, provenienza, VIN, optional, note)
- Costi: voci personalizzabili; totale = Prezzo Finale
- Mercato: Eurotax base/correzione km, min/avg IT, link annuncio minimo, prezzo target
- Calcoli automatici: Delta vs Eurotax/min IT, Margine atteso, Giudizio (Conveniente/Marginale/Non)
- API routes già pronte
- Esporta/Importa JSON (fase successiva)

## Setup locale (opzionale)
1. `pnpm i` (oppure `npm i` o `yarn`)
2. Crea un DB PostgreSQL (consigliato Supabase). Imposta `.env` come da esempio.
3. `pnpm prisma migrate dev` per creare le tabelle (locale)
4. `pnpm dev` e apri http://localhost:3000

## Deploy su Vercel + Supabase
1) Crea progetto su https://supabase.com e copia il `DATABASE_URL` (Project Settings > Database > Connection string > URI).
2) Vai su https://vercel.com → Add New Project → Importa da ZIP → carica questo progetto.
3) In Vercel, vai su **Settings > Environment Variables** e aggiungi:
   - `DATABASE_URL` = la stringa di Supabase
4) In **Settings > Build & Development Settings** imposta Build Command a:
   - `prisma migrate deploy && next build`
5) Deploy. Alla fine Vercel mostra l'URL pubblico.
6) Aggiungi dominio personalizzato (es. `valutatore.dubaicar.it`) in **Settings > Domains**. Segui le istruzioni DNS.

## Note
- Le migrazioni Prisma verranno eseguite automaticamente in build grazie al comando `prisma migrate deploy`.
- Puoi usare Supabase gratis per l'MVP.
