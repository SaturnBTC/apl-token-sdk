# apl-token-sdk

A TypeScript SDK for constructing and serializing token program instructions, compatible with the Rust implementation. This SDK provides type-safe methods to create, serialize, and deserialize all token program instructions.

## Installation

```bash
npm install apl-token-sdk
# or
pnpm add apl-token-sdk
```

## Quick Start

```typescript
import {
  createInitializeMintInstruction,
  createTransferInstruction,
  TokenInstructionTag,
} from 'apl-token-sdk';

// Create a mint initialization instruction
const initMintInstruction = createInitializeMintInstruction(
  mintPubkey, // The mint to initialize
  decimals, // Number of decimal places (0-255)
  mintAuthorityPubkey, // Authority that can mint tokens
  freezeAuthorityPubkey, // Authority that can freeze accounts (optional)
  programId, // Token program ID
);

// Create a transfer instruction
const transferInstruction = createTransferInstruction(
  sourcePubkey, // Source account
  destinationPubkey, // Destination account
  ownerPubkey, // Owner of source account
  amount, // Amount to transfer (as bigint)
  programId, // Token program ID
);
```

## Core Concepts

### Instruction Structure

Every instruction consists of:

- **Program ID**: The token program's public key
- **Accounts**: Array of accounts the instruction operates on
- **Data**: Serialized instruction data (tag + parameters)

### Account Metadata

Each account in an instruction has metadata:

```typescript
interface AccountMeta {
  pubkey: Pubkey; // Account's public key
  is_signer: boolean; // Whether account must sign
  is_writable: boolean; // Whether account can be modified
}
```

### Data Types

- **Pubkey**: `Uint8Array` (32 bytes)
- **COption<Pubkey>**: Optional public key with discriminator
- **u64**: `bigint` for large numbers
- **u8**: `number` for small integers

## Instructions Reference

### 1. InitializeMint

Creates a new mint with specified decimals and authorities.

```typescript
import { createInitializeMintInstruction } from 'apl-token-sdk';

const instruction = createInitializeMintInstruction(
  mintPubkey, // Uint8Array - The mint to initialize
  decimals, // number - Decimal places (0-255)
  mintAuthorityPubkey, // Uint8Array - Authority that can mint
  freezeAuthorityPubkey, // Uint8Array | null - Authority that can freeze
  programId, // Uint8Array - Token program ID
);
```

**Accounts Required:**

- `mint`: Writable, the mint to initialize
- `rent`: Readonly, rent sysvar

**Data Fields:**

- `decimals`: Number of decimal places
- `mintAuthority`: Authority that can mint tokens
- `freezeAuthority`: Optional authority that can freeze accounts

### 2. InitializeAccount

Initializes a new token account with default settings.

```typescript
import { createInitializeAccountInstruction } from 'apl-token-sdk';

const instruction = createInitializeAccountInstruction(
  accountPubkey, // Uint8Array - Account to initialize
  mintPubkey, // Uint8Array - Mint this account holds
  ownerPubkey, // Uint8Array - Owner of the account
  programId, // Uint8Array - Token program ID
);
```

**Accounts Required:**

- `account`: Writable, the account to initialize
- `mint`: Readonly, the mint this account holds
- `owner`: Readonly, the owner of the account
- `rent`: Readonly, rent sysvar

### 3. InitializeMultisig

Creates a multisignature account requiring M of N signatures.

```typescript
import { createInitializeMultisigInstruction } from 'apl-token-sdk';

const instruction = createInitializeMultisigInstruction(
  multisigPubkey, // Uint8Array - Multisig account to initialize
  signers, // Uint8Array[] - Array of signer public keys
  requiredSigners, // number - Number of required signatures (1-255)
  programId, // Uint8Array - Token program ID
);
```

**Accounts Required:**

- `multisig`: Writable, the multisig account to initialize
- `rent`: Readonly, rent sysvar
- `signers`: Readonly, array of signer accounts

**Data Fields:**

- `requiredSigners`: Number of signatures required (M of N)

### 4. Transfer

Transfers tokens from one account to another.

```typescript
import { createTransferInstruction } from 'apl-token-sdk';

const instruction = createTransferInstruction(
  sourcePubkey, // Uint8Array - Source account
  destinationPubkey, // Uint8Array - Destination account
  ownerPubkey, // Uint8Array - Owner of source account
  amount, // bigint - Amount to transfer
  programId, // Uint8Array - Token program ID
);
```

**Accounts Required:**

- `source`: Writable, source account
- `destination`: Writable, destination account
- `owner`: Signer, owner of source account (or multisig)

**Data Fields:**

- `amount`: Amount to transfer as u64

### 5. Approve

Approves a delegate to spend tokens from an account.

```typescript
import { createApproveInstruction } from 'apl-token-sdk';

const instruction = createApproveInstruction(
  accountPubkey, // Uint8Array - Account to approve from
  delegatePubkey, // Uint8Array - Delegate to approve
  ownerPubkey, // Uint8Array - Owner of the account
  amount, // bigint - Amount to approve
  programId, // Uint8Array - Token program ID
);
```

**Accounts Required:**

- `account`: Writable, account to approve from
- `delegate`: Readonly, delegate to approve
- `owner`: Signer, owner of the account (or multisig)

**Data Fields:**

- `amount`: Amount to approve as u64

### 6. Revoke

Revokes a delegate's approval to spend tokens.

```typescript
import { createRevokeInstruction } from 'apl-token-sdk';

const instruction = createRevokeInstruction(
  accountPubkey, // Uint8Array - Account to revoke from
  ownerPubkey, // Uint8Array - Owner of the account
  programId, // Uint8Array - Token program ID
);
```

**Accounts Required:**

- `account`: Writable, account to revoke from
- `owner`: Signer, owner of the account (or multisig)

### 7. SetAuthority

Sets a new authority for a mint or account.

```typescript
import { createSetAuthorityInstruction, AuthorityType } from 'apl-token-sdk';

const instruction = createSetAuthorityInstruction(
  accountPubkey, // Uint8Array - Account or mint
  currentAuthorityPubkey, // Uint8Array - Current authority
  newAuthorityPubkey, // Uint8Array | null - New authority (null to disable)
  authorityType, // AuthorityType - Type of authority
  programId, // Uint8Array - Token program ID
);
```

**Authority Types:**

- `AuthorityType.MintTokens`: Authority to mint tokens
- `AuthorityType.FreezeAccount`: Authority to freeze accounts
- `AuthorityType.AccountOwner`: Authority to close accounts
- `AuthorityType.CloseAccount`: Authority to close accounts

### 8. MintTo

Mints new tokens to an account.

```typescript
import { createMintToInstruction } from 'apl-token-sdk';

const instruction = createMintToInstruction(
  mintPubkey, // Uint8Array - Mint to mint from
  destinationPubkey, // Uint8Array - Destination account
  mintAuthorityPubkey, // Uint8Array - Mint authority
  amount, // bigint - Amount to mint
  programId, // Uint8Array - Token program ID
);
```

**Accounts Required:**

- `mint`: Writable, mint to mint from
- `destination`: Writable, destination account
- `authority`: Signer, mint authority (or multisig)

### 9. Burn

Burns tokens from an account.

```typescript
import { createBurnInstruction } from 'apl-token-sdk';

const instruction = createBurnInstruction(
  accountPubkey, // Uint8Array - Account to burn from
  mintPubkey, // Uint8Array - Mint of the tokens
  ownerPubkey, // Uint8Array - Owner of the account
  amount, // bigint - Amount to burn
  programId, // Uint8Array - Token program ID
);
```

**Accounts Required:**

- `account`: Writable, account to burn from
- `mint`: Writable, mint of the tokens
- `owner`: Signer, owner of the account (or multisig)

### 10. CloseAccount

Closes an account and transfers its rent to a specified account.

```typescript
import { createCloseAccountInstruction } from 'apl-token-sdk';

const instruction = createCloseAccountInstruction(
  accountPubkey, // Uint8Array - Account to close
  destinationPubkey, // Uint8Array - Destination for rent
  ownerPubkey, // Uint8Array - Owner of the account
  programId, // Uint8Array - Token program ID
);
```

**Accounts Required:**

- `account`: Writable, account to close
- `destination`: Writable, destination for rent
- `owner`: Signer, owner of the account (or multisig)

### 11. FreezeAccount

Freezes an account, preventing transfers.

```typescript
import { createFreezeAccountInstruction } from 'apl-token-sdk';

const instruction = createFreezeAccountInstruction(
  accountPubkey, // Uint8Array - Account to freeze
  mintPubkey, // Uint8Array - Mint of the account
  freezeAuthorityPubkey, // Uint8Array - Freeze authority
  programId, // Uint8Array - Token program ID
);
```

**Accounts Required:**

- `account`: Writable, account to freeze
- `mint`: Readonly, mint of the account
- `authority`: Signer, freeze authority (or multisig)

### 12. ThawAccount

Thaws a frozen account, allowing transfers again.

```typescript
import { createThawAccountInstruction } from 'apl-token-sdk';

const instruction = createThawAccountInstruction(
  accountPubkey, // Uint8Array - Account to thaw
  mintPubkey, // Uint8Array - Mint of the account
  freezeAuthorityPubkey, // Uint8Array - Freeze authority
  programId, // Uint8Array - Token program ID
);
```

**Accounts Required:**

- `account`: Writable, account to thaw
- `mint`: Readonly, mint of the account
- `authority`: Signer, freeze authority (or multisig)

### 13. TransferChecked

Transfers tokens with additional decimal validation.

```typescript
import { createTransferCheckedInstruction } from 'apl-token-sdk';

const instruction = createTransferCheckedInstruction(
  sourcePubkey, // Uint8Array - Source account
  mintPubkey, // Uint8Array - Mint of the tokens
  destinationPubkey, // Uint8Array - Destination account
  ownerPubkey, // Uint8Array - Owner of source account
  amount, // bigint - Amount to transfer
  decimals, // number - Expected decimals
  programId, // Uint8Array - Token program ID
);
```

**Accounts Required:**

- `source`: Writable, source account
- `mint`: Readonly, mint of the tokens
- `destination`: Writable, destination account
- `owner`: Signer, owner of source account (or multisig)

**Data Fields:**

- `amount`: Amount to transfer as u64
- `decimals`: Expected decimal places as u8

### 14. ApproveChecked

Approves a delegate with decimal validation.

```typescript
import { createApproveCheckedInstruction } from 'apl-token-sdk';

const instruction = createApproveCheckedInstruction(
  accountPubkey, // Uint8Array - Account to approve from
  mintPubkey, // Uint8Array - Mint of the account
  delegatePubkey, // Uint8Array - Delegate to approve
  ownerPubkey, // Uint8Array - Owner of the account
  amount, // bigint - Amount to approve
  decimals, // number - Expected decimals
  programId, // Uint8Array - Token program ID
);
```

**Accounts Required:**

- `account`: Writable, account to approve from
- `mint`: Readonly, mint of the account
- `delegate`: Readonly, delegate to approve
- `owner`: Signer, owner of the account (or multisig)

### 15. MintToChecked

Mints tokens with decimal validation.

```typescript
import { createMintToCheckedInstruction } from 'apl-token-sdk';

const instruction = createMintToCheckedInstruction(
  mintPubkey, // Uint8Array - Mint to mint from
  destinationPubkey, // Uint8Array - Destination account
  mintAuthorityPubkey, // Uint8Array - Mint authority
  amount, // bigint - Amount to mint
  decimals, // number - Expected decimals
  programId, // Uint8Array - Token program ID
);
```

**Accounts Required:**

- `mint`: Writable, mint to mint from
- `destination`: Writable, destination account
- `authority`: Signer, mint authority (or multisig)

### 16. BurnChecked

Burns tokens with decimal validation.

```typescript
import { createBurnCheckedInstruction } from 'apl-token-sdk';

const instruction = createBurnCheckedInstruction(
  accountPubkey, // Uint8Array - Account to burn from
  mintPubkey, // Uint8Array - Mint of the tokens
  ownerPubkey, // Uint8Array - Owner of the account
  amount, // bigint - Amount to burn
  decimals, // number - Expected decimals
  programId, // Uint8Array - Token program ID
);
```

**Accounts Required:**

- `account`: Writable, account to burn from
- `mint`: Writable, mint of the tokens
- `owner`: Signer, owner of the account (or multisig)

### 17. InitializeAccount2

Initializes an account with owner in instruction data (CPI optimized).

```typescript
import { createInitializeAccount2Instruction } from 'apl-token-sdk';

const instruction = createInitializeAccount2Instruction(
  accountPubkey, // Uint8Array - Account to initialize
  mintPubkey, // Uint8Array - Mint this account holds
  rentSysvarPubkey, // Uint8Array - Rent sysvar
  ownerPubkey, // Uint8Array - Owner of the account
  programId, // Uint8Array - Token program ID
);
```

**Accounts Required:**

- `account`: Writable, the account to initialize
- `mint`: Readonly, the mint this account holds
- `rent`: Readonly, rent sysvar

**Data Fields:**

- `owner`: Owner public key embedded in instruction data

### 18. InitializeAccount3

Initializes an account without rent sysvar (CPI optimized).

```typescript
import { createInitializeAccount3Instruction } from 'apl-token-sdk';

const instruction = createInitializeAccount3Instruction(
  accountPubkey, // Uint8Array - Account to initialize
  mintPubkey, // Uint8Array - Mint this account holds
  ownerPubkey, // Uint8Array - Owner of the account
  programId, // Uint8Array - Token program ID
);
```

**Accounts Required:**

- `account`: Writable, the account to initialize
- `mint`: Readonly, the mint this account holds

**Data Fields:**

- `owner`: Owner public key embedded in instruction data

### 19. InitializeMint2

Initializes a mint without rent sysvar (CPI optimized).

```typescript
import { createInitializeMint2Instruction } from 'apl-token-sdk';

const instruction = createInitializeMint2Instruction(
  mintPubkey, // Uint8Array - The mint to initialize
  decimals, // number - Decimal places (0-255)
  mintAuthorityPubkey, // Uint8Array - Authority that can mint
  freezeAuthorityPubkey, // Uint8Array | null - Authority that can freeze
  programId, // Uint8Array - Token program ID
);
```

**Accounts Required:**

- `mint`: Writable, the mint to initialize

**Data Fields:**

- `decimals`: Number of decimal places
- `mintAuthority`: Authority that can mint tokens
- `freezeAuthority`: Optional authority that can freeze accounts

### 20. GetAccountDataSize

Gets the size of account data for a given mint.

```typescript
import { createGetAccountDataSizeInstruction } from 'apl-token-sdk';

const instruction = createGetAccountDataSizeInstruction(
  mintPubkey, // Uint8Array - Mint to get size for
  programId, // Uint8Array - Token program ID
);
```

**Accounts Required:**

- `mint`: Readonly, mint to get account data size for

**Return Data:** The program returns a little-endian `u64` that can be fetched using `sol_get_return_data`.

### 21. InitializeImmutableOwner

Initializes an account with immutable owner extension.

```typescript
import { createInitializeImmutableOwnerInstruction } from 'apl-token-sdk';

const instruction = createInitializeImmutableOwnerInstruction(
  accountPubkey, // Uint8Array - Account to initialize
  programId, // Uint8Array - Token program ID
);
```

**Accounts Required:**

- `account`: Writable, account to initialize

### 22. AmountToUiAmount

Converts a raw amount to a UI amount using the given mint's decimals.

```typescript
import { createAmountToUiAmountInstruction } from 'apl-token-sdk';

const instruction = createAmountToUiAmountInstruction(
  mintPubkey, // Uint8Array - Mint to calculate for
  amount, // bigint - Raw amount to convert
  programId, // Uint8Array - Token program ID
);
```

**Accounts Required:**

- `mint`: Readonly, mint to calculate for

**Data Fields:**

- `amount`: Raw amount as u64

**Return Data:** The program returns a string that can be fetched using `sol_get_return_data`.

### 23. UiAmountToAmount

Converts a UI amount to a raw amount using the given mint's decimals.

```typescript
import { createUiAmountToAmountInstruction } from 'apl-token-sdk';

const instruction = createUiAmountToAmountInstruction(
  mintPubkey, // Uint8Array - Mint to calculate for
  uiAmount, // string - UI amount to convert
  programId, // Uint8Array - Token program ID
);
```

**Accounts Required:**

- `mint`: Readonly, mint to calculate for

**Data Fields:**

- `uiAmount`: UI amount as string

**Return Data:** The program returns a little-endian `u64` that can be fetched using `sol_get_return_data`.

## Advanced Usage

### Serialization and Deserialization

```typescript
import {
  serializeTokenInstruction,
  deserializeTokenInstruction,
  TokenInstruction,
} from 'apl-token-sdk';

// Create an instruction
const instruction: TokenInstruction = {
  type: TokenInstructionTag.Transfer,
  value: { amount: 1000n },
};

// Serialize to bytes
const serialized = serializeTokenInstruction(instruction);

// Deserialize from bytes
const deserialized = deserializeTokenInstruction(serialized);
```

### Working with COption<Pubkey>

```typescript
import {
  COptionPubkey,
  serializeCOptionPubkey,
  deserializeCOptionPubkey,
} from 'apl-token-sdk';

// Some value
const somePubkey: COptionPubkey = {
  option: 1,
  value: new Uint8Array(32).fill(1),
};

// None value
const nonePubkey: COptionPubkey = { option: 0 };

// Serialize
const serialized = serializeCOptionPubkey(somePubkey);

// Deserialize
const deserialized = deserializeCOptionPubkey(serialized, 0);
```

### Error Handling

```typescript
import {
  InstructionDeserializationError,
  UnknownInstructionTagError,
  InvalidCOptionError,
} from 'apl-token-sdk';

try {
  const instruction = deserializeTokenInstruction(buffer);
} catch (error) {
  if (error instanceof UnknownInstructionTagError) {
    console.log(`Unknown instruction tag: ${error.tag}`);
  } else if (error instanceof InstructionDeserializationError) {
    console.log(`Deserialization failed: ${error.message}`);
  }
}
```

## Building and Testing

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build
```

## API Reference

### Core Types

- `TokenInstructionTag`: Enum of all instruction tags (0-22)
- `TokenInstruction`: Discriminated union of all instruction types
- `Pubkey`: `Uint8Array` representing a public key
- `COptionPubkey`: Optional public key with discriminator

### Core Functions

- `serializeTokenInstruction(instruction)`: Serialize any instruction
- `deserializeTokenInstruction(buffer)`: Deserialize instruction from bytes
- `create*Instruction(...)`: Create specific instruction objects

### Error Classes

- `InstructionDeserializationError`: General deserialization errors
- `UnknownInstructionTagError`: Unknown instruction tag errors
- `InvalidCOptionError`: COption parsing errors
