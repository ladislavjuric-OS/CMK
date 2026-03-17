# CMK Elite Growth — The Architect

## Dva deploya (preporuka dok ne bude Supabase + sve gotovo)

| Što | Gdje | Domain |
|-----|------|--------|
| **Stari site** (static HTML) | Root repoa: `index.html`, `materials.html`, `audit.html`, `momentum.html`, `tools/`, `data/`, `api/` | **cmk.elitegrowth.pro** — ostaje live |
| **Novi site** (Next.js) | `web/` | Preview URL (npr. cmk-preview.vercel.app) dok ne implementiraš Supabase itd. |

Kad budeš spreman prebaciti domenu na Next: u Vercelu stavi **Root Directory** = `web` i domenu dodaš na taj projekt.

## Stari site (trenutno live)

Deploy iz **roota** (npr. Vercel s Root Directory prazan ili GitHub Pages). Koristi `index.html`, `tools/readinesschecker.html`, `api/analyze.js` itd.

## Novi site (Next) — lokalno / preview

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).  
Env u `web/`: `ANTHROPIC_API_KEY`; opcionalno `RESEND_API_KEY`, `SYSTEME_API_KEY`, `SYSTEME_TAG_ID`.

## Repo layout

| Path       | Purpose                    |
|-----------|----------------------------|
| **Root**  | Stari static site (live na domeni) |
| `web/`    | Next.js app (preview dok ne bude sve spremno) |
| `_archive/` | Kopija starih fajlova (README + prazno ili backup); fajlovi su vraćeni u root/tools/data/api |
| `assets/` | CSS za stari HTML |
| `CNAME`   | Custom domain (cmk.elitegrowth.pro) |
