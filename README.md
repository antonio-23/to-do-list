## To-Do List — React + Vite

Prosty projekt To-Do List z uwierzytelnianiem użytkownika, zbudowany przy użyciu React i Vite.

### Jak uruchomić

```bash
pnpm install
pnpm dev
```

Domyślnie aplikacja działa pod adresem http://localhost:5173

### Build produkcyjny

```bash
pnpm build
pnpm preview
```

### Struktura

- `src/main.tsx` – punkt wejścia, montuje aplikację, AuthProvider i BrowserRouter
- `src/App.tsx` – definicje tras: `/`, `/login`, `/register`
- `src/pages/*` – komponenty stron przeniesione z Next.js
- `components/*` – komponenty UI i logika jak wcześniej (z aliasem `@/`)
- `lib/*` – proste serwisy `auth` i `todos` oparte o `localStorage`
- `app/globals.css` – style globalne (Tailwind CSS v4)
