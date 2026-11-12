# Next.js & HeroUI Template

This is a template for creating applications using Next.js 16 (app directory) and HeroUI (v3).

[Try it on CodeSandbox](https://githubbox.com/heroui-inc/heroui/next-app-template)

## Technologies Used

- [Next.js 16](https://nextjs.org/docs/getting-started)
- [HeroUI v3](https://heroui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## How to Use

### Use the template with create-next-app

To create a new project based on this template using `create-next-app`, run the following command:

```bash
npx create-next-app -e https://github.com/heroui-inc/next-app-template
```

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

## Product catalogue flag

Whether products are visible is controlled by one Vercel Flag, `product-catalog`
(defined in `flags.ts`, default **off**). Production is off, Development and
Preview are on. When it's off, product pages redirect to the RFQ and product
links are hidden.

- **Toggle it** in the Vercel dashboard (project, Flags), or with
  `vercel flags enable product-catalog` / `vercel flags disable product-catalog`.
  No redeploy is needed.
- **See it yourself in production** without changing it for visitors: use the
  Flags Explorer in the Vercel Toolbar. It needs `FLAGS_SECRET`, which Vercel sets for you (see `.env.example`).
- **Locally**, run `vercel link` and `vercel env pull`. That provides the
  OIDC token the Vercel adapter signs in with (no SDK key needed). Without it
  the flag evaluates to off.
- **In code**, never import `flags.ts` directly. Use `isCatalogEnabled()` or
  `isCategoryBrowsable()` from `lib/catalog/visibility.ts`.

## License

Licensed under the [MIT license](https://github.com/heroui-inc/next-app-template/blob/main/LICENSE).
