@saturnbtcio/apl-ata

TypeScript helpers for constructing Associated Token Account (ATA) program instructions for the Arch chain. This package provides type-safe factories for both ATA instructions and exposes the program ID.

### Installation

```bash
pnpm add @saturnbtcio/apl-ata
# or
npm i @saturnbtcio/apl-ata
```

### Program ID

```typescript
import { ASSOCIATED_TOKEN_PROGRAM_ID } from '@saturnbtcio/apl-ata';
```

### Quick Start

```typescript
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createIdempotentAssociatedTokenAccountInstruction,
} from '@saturnbtcio/apl-ata';
import { Instruction, Pubkey } from '@saturnbtcio/arch-sdk';

// Required accounts
const payer: Pubkey = /* wallet pubkey */ new Uint8Array(32) as unknown as Pubkey;
const owner: Pubkey = /* token account owner */ new Uint8Array(32) as unknown as Pubkey;
const mint: Pubkey = /* token mint */ new Uint8Array(32) as unknown as Pubkey;
const associatedToken: Pubkey = /* precomputed ATA address */ new Uint8Array(32) as unknown as Pubkey;

// Other program IDs
const tokenProgramId: Pubkey = /* token program id */ new Uint8Array(32) as unknown as Pubkey;
const systemProgramId: Pubkey = /* system program id */ new Uint8Array(32) as unknown as Pubkey;

const ix: Instruction = createIdempotentAssociatedTokenAccountInstruction({
  payer,
  owner,
  mint,
  associatedToken,
  tokenProgramId,
  systemProgramId,
  associatedTokenProgramId: ASSOCIATED_TOKEN_PROGRAM_ID,
});
```

## Instruction Reference

The ATA program in this SDK supports two instructions:

- CreateAssociatedTokenAccount (tag 0)
- CreateIdempotentAssociatedTokenAccount (tag 1)

Both instructions have the same account layout; the idempotent variant succeeds even if the ATA already exists.

### 1. CreateAssociatedTokenAccount

Creates the associated token account at a precomputed address.

```typescript
import { createAssociatedTokenAccountInstruction } from '@saturnbtcio/apl-ata';

const ix = createAssociatedTokenAccountInstruction({
  payer,
  owner,
  mint,
  associatedToken,
  tokenProgramId,
  systemProgramId,
  associatedTokenProgramId: ASSOCIATED_TOKEN_PROGRAM_ID,
});
```

**Accounts:**

- payer: Signer, writable — funds account creation
- associatedToken: Writable — the ATA address
- owner: Readonly — owner of the ATA
- mint: Readonly — token mint
- systemProgramId: Readonly — system program
- tokenProgramId: Readonly — token program

**Data:**

- Single byte tag: `0` (Create)

### 2. CreateIdempotentAssociatedTokenAccount

Creates the associated token account if it does not exist; no-op if it already exists.

```typescript
import { createIdempotentAssociatedTokenAccountInstruction } from '@saturnbtcio/apl-ata';

const ix = createIdempotentAssociatedTokenAccountInstruction({
  payer,
  owner,
  mint,
  associatedToken,
  tokenProgramId,
  systemProgramId,
  associatedTokenProgramId: ASSOCIATED_TOKEN_PROGRAM_ID,
});
```

**Accounts:** Same as CreateAssociatedTokenAccount

**Data:**

- Single byte tag: `1` (CreateIdempotent)

## API

### Types

```typescript
import type {
  CreateAssociatedTokenAccount,
  CreateIdempotentAssociatedTokenAccount,
} from '@saturnbtcio/apl-ata';

// Parameters shared by both helpers
interface AssociatedTokenAccountParams {
  payer: Pubkey;
  owner: Pubkey;
  mint: Pubkey;
  associatedToken: Pubkey;
  tokenProgramId: Pubkey;
  associatedTokenProgramId: Pubkey;
  systemProgramId: Pubkey;
}
```

### Functions

```typescript
import {
  createAssociatedTokenAccountInstruction,
  createIdempotentAssociatedTokenAccountInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@saturnbtcio/apl-ata';
```

- createAssociatedTokenAccountInstruction(params): Instruction
- createIdempotentAssociatedTokenAccountInstruction(params): Instruction
- ASSOCIATED_TOKEN_PROGRAM_ID: Pubkey

## Notes

- The `associatedToken` address must be precomputed according to your chain's addressing scheme. This SDK does not derive the ATA address.
- All public keys are the `Pubkey` type from `@saturnbtcio/arch-sdk` (a `Uint8Array` of 32 bytes).

## Building

```bash
pnpm build
```

