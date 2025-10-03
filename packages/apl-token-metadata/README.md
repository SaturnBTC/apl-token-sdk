# @saturnbtcio/apl-token-metadata

Helpers for working with APL Token Metadata: PDAs, program IDs, and instruction builders compatible with `@saturnbtcio/arch-sdk`.

## Installation

```bash
pnpm add @saturnbtcio/apl-token-metadata
# or
npm install @saturnbtcio/apl-token-metadata
```

## Features

- Program constants and ID helpers
- PDA derivations for metadata accounts
- Instruction builders for creating/updating metadata
- Re-exports of instruction utilities from this package's `src`

## Usage

```ts
import {
  // example export
  METADATA_PROGRAM_ID,
} from '@saturnbtcio/apl-token-metadata';

console.log(METADATA_PROGRAM_ID);
```

Explore the code in `src/` for available helpers (`instructions.ts`, `pda.ts`, `program.ts`).

## Build

```bash
pnpm build
```

