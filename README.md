# Monorepo: APL Token SDKs

This repository contains multiple packages for constructing and working with APL token-related programs on top of `@saturnbtcio/arch-sdk`.

## Packages

- @saturnbtcio/apl-token
  - TypeScript SDK for constructing and serializing the APL Token Program instructions (initialize mint/account, transfer, approve, burn, freeze, thaw, checked variants, utility conversions, etc.).
  - README: packages/apl-token/README.md

- @saturnbtcio/apl-ata
  - Helpers for creating Associated Token Accounts (ATA) and idempotent ATA instructions compatible with `@saturnbtcio/arch-sdk`.
  - README: packages/ata-instructions/README.md

- @saturnbtcio/apl-token-metadata
  - Helpers for Token Metadata: PDAs, program constants, and instruction builders.
  - README: packages/apl-token-metadata/README.md

## Getting Started

This is a pnpm workspace. From the repo root:

```bash
pnpm install
pnpm -r build
```

To work within a specific package, `cd` into it and run its scripts (e.g., `pnpm build`).

## Development

- Each package is published independently and specifies its own `build` and `lint` scripts.
- All packages depend on `@saturnbtcio/arch-sdk` for shared primitives like `Instruction`, `AccountMeta`, and `Pubkey`.

## Links

- APL Token SDK: packages/apl-token/README.md
- ATA Instructions: packages/ata-instructions/README.md
- Token Metadata SDK: packages/apl-token-metadata-sdk/README.md
