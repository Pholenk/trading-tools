# My App

A production-ready **Next.js** starter with **Material You** design tokens, **atomic design** architecture, **Redux Toolkit**, and full **light/dark theme** support — deployable to **GitHub Pages**.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, static export) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + ShadCN UI primitives |
| Design Tokens | Material You (Color.kt + Typography.json) |
| State | Redux Toolkit |
| Testing | Jest + React Testing Library |
| CI/CD | GitHub Actions → GitHub Pages |

## Project Structure

```
my-app/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (providers, SEO metadata)
│   ├── page.tsx                # / route → <HomePage />
│   └── globals.css             # CSS variables (Material You tokens)
├── components/
│   ├── atoms/                  # Button, Typography, Icon, Input, Badge, providers
│   ├── molecules/              # ThemeToggle, NavLink
│   ├── organisms/              # Navbar, Footer
│   ├── templates/              # Pure UI layouts (BaseTemplate, HomeTemplate)
│   └── pages/                  # HOC layer — logic + Redux + routing
├── store/                      # Redux (themeSlice, typed hooks)
├── types/                      # Shared TypeScript types
├── lib/                        # cn() utility
├── __tests__/                  # Mirrors component structure
└── .github/workflows/          # CI → Build → Deploy
```

## Atomic Design Rule

> **Templates** = pure JSX props only. **Pages** = all logic, Redux, routing.

## Getting Started

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_REPO_NAME
npm run dev                  # localhost:3000
npm test                     # run all tests
npm run test:coverage        # with coverage report
npm run build                # static export → ./out
```

## Adding New Pages

1. `components/templates/MyTemplate.tsx` — pure UI
2. `components/pages/MyPage.tsx` — logic HOC
3. `app/my-route/page.tsx` — route entry
4. `__tests__/templates/` + `__tests__/pages/` — tests

## GitHub Pages Deployment

Set **Settings → Pages → Source → GitHub Actions** in your repo, then push to `main`. The workflow runs tests → builds → deploys automatically.

Site URL: `https://<username>.github.io/<NEXT_PUBLIC_REPO_NAME>/`
