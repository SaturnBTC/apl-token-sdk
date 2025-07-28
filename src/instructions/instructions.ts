import {
  InitializeMint,
  serializeInitializeMint,
  deserializeInitializeMint,
} from './initialize-mint';
import {
  InitializeAccount,
  serializeInitializeAccount,
  deserializeInitializeAccount,
} from './initialize-account';
import {
  InitializeMultisig,
  serializeInitializeMultisig,
  deserializeInitializeMultisig,
} from './initialize-multisig';
import { Transfer, serializeTransfer, deserializeTransfer } from './transfer';
import { Approve, serializeApprove, deserializeApprove } from './approve';
import { Revoke, serializeRevoke, deserializeRevoke } from './revoke';
import {
  SetAuthority,
  serializeSetAuthority,
  deserializeSetAuthority,
} from './set-authority';
import { MintTo, serializeMintTo, deserializeMintTo } from './mint-to';
import { Burn, serializeBurn, deserializeBurn } from './burn';
import {
  BurnChecked,
  serializeBurnChecked,
  deserializeBurnChecked,
} from './burn-checked';
import {
  CloseAccount,
  serializeCloseAccount,
  deserializeCloseAccount,
} from './close-account';
import {
  FreezeAccount,
  serializeFreezeAccount,
  deserializeFreezeAccount,
} from './freeze-account';
import {
  ThawAccount,
  serializeThawAccount,
  deserializeThawAccount,
} from './thaw-account';
import {
  TransferChecked,
  serializeTransferChecked,
  deserializeTransferChecked,
} from './transfer-checked';
import {
  ApproveChecked,
  serializeApproveChecked,
  deserializeApproveChecked,
} from './approve-checked';
import {
  MintToChecked,
  serializeMintToChecked,
  deserializeMintToChecked,
} from './mint-to-checked';
import { UnknownInstructionTagError } from '../errors/unknown-instruction-tag-error';
import {
  deserializeInitializeAccount2,
  InitializeAccount2,
  serializeInitializeAccount2,
} from './initialize-account2';
import {
  deserializeInitializeAccount3,
  InitializeAccount3,
  serializeInitializeAccount3,
} from './initialize-account3';
import {
  InitializeMint2,
  serializeInitializeMint2,
  deserializeInitializeMint2,
} from './initialize-mint2';
import {
  GetAccountDataSize,
  serializeGetAccountDataSize,
  deserializeGetAccountDataSize,
} from './get-account-data-size';
import {
  InitializeImmutableOwner,
  serializeInitializeImmutableOwner,
  deserializeInitializeImmutableOwner,
} from './initialize-immutable-owner';
import {
  AmountToUiAmount,
  serializeAmountToUiAmount,
  deserializeAmountToUiAmount,
} from './amount-to-ui-amount';
import {
  UiAmountToAmount,
  serializeUiAmountToAmount,
  deserializeUiAmountToAmount,
} from './ui-amount-to-amount';

export enum TokenInstructionTag {
  InitializeMint = 0,
  InitializeAccount = 1,
  InitializeMultisig = 2,
  Transfer = 3,
  Approve = 4,
  Revoke = 5,
  SetAuthority = 6,
  MintTo = 7,
  Burn = 8,
  CloseAccount = 9,
  FreezeAccount = 10,
  ThawAccount = 11,
  TransferChecked = 12,
  ApproveChecked = 13,
  MintToChecked = 14,
  BurnChecked = 15,
  InitializeAccount2 = 16,
  InitializeAccount3 = 17,
  InitializeMint2 = 18,
  GetAccountDataSize = 19,
  InitializeImmutableOwner = 20,
  AmountToUiAmount = 21,
  UiAmountToAmount = 22,
  // Add other instructions as needed
}

export interface TokenInstructionValueMap {
  [TokenInstructionTag.InitializeMint]: InitializeMint;
  [TokenInstructionTag.InitializeAccount]: InitializeAccount;
  [TokenInstructionTag.InitializeMultisig]: InitializeMultisig;
  [TokenInstructionTag.Transfer]: Transfer;
  [TokenInstructionTag.Approve]: Approve;
  [TokenInstructionTag.Revoke]: Revoke;
  [TokenInstructionTag.SetAuthority]: SetAuthority;
  [TokenInstructionTag.MintTo]: MintTo;
  [TokenInstructionTag.Burn]: Burn;
  [TokenInstructionTag.CloseAccount]: CloseAccount;
  [TokenInstructionTag.FreezeAccount]: FreezeAccount;
  [TokenInstructionTag.ThawAccount]: ThawAccount;
  [TokenInstructionTag.TransferChecked]: TransferChecked;
  [TokenInstructionTag.ApproveChecked]: ApproveChecked;
  [TokenInstructionTag.MintToChecked]: MintToChecked;
  [TokenInstructionTag.BurnChecked]: BurnChecked;
  [TokenInstructionTag.InitializeAccount2]: InitializeAccount2;
  [TokenInstructionTag.InitializeAccount3]: InitializeAccount3;
  [TokenInstructionTag.InitializeMint2]: InitializeMint2;
  [TokenInstructionTag.GetAccountDataSize]: GetAccountDataSize;
  [TokenInstructionTag.InitializeImmutableOwner]: InitializeImmutableOwner;
  [TokenInstructionTag.AmountToUiAmount]: AmountToUiAmount;
  [TokenInstructionTag.UiAmountToAmount]: UiAmountToAmount;
  // Add more as you implement them
}

export type TokenInstruction = {
  [K in keyof TokenInstructionValueMap]: {
    type: K;
    value: TokenInstructionValueMap[K];
  };
}[keyof TokenInstructionValueMap];

const serializeMap: {
  [K in keyof TokenInstructionValueMap]: (
    value: TokenInstructionValueMap[K],
  ) => Uint8Array;
} = {
  [TokenInstructionTag.InitializeMint]: serializeInitializeMint,
  [TokenInstructionTag.InitializeAccount]: serializeInitializeAccount,
  [TokenInstructionTag.InitializeMultisig]: serializeInitializeMultisig,
  [TokenInstructionTag.Transfer]: serializeTransfer,
  [TokenInstructionTag.Approve]: serializeApprove,
  [TokenInstructionTag.Revoke]: serializeRevoke,
  [TokenInstructionTag.SetAuthority]: serializeSetAuthority,
  [TokenInstructionTag.MintTo]: serializeMintTo,
  [TokenInstructionTag.Burn]: serializeBurn,
  [TokenInstructionTag.CloseAccount]: serializeCloseAccount,
  [TokenInstructionTag.FreezeAccount]: serializeFreezeAccount,
  [TokenInstructionTag.ThawAccount]: serializeThawAccount,
  [TokenInstructionTag.TransferChecked]: serializeTransferChecked,
  [TokenInstructionTag.ApproveChecked]: serializeApproveChecked,
  [TokenInstructionTag.MintToChecked]: serializeMintToChecked,
  [TokenInstructionTag.BurnChecked]: serializeBurnChecked,
  [TokenInstructionTag.InitializeAccount2]: serializeInitializeAccount2,
  [TokenInstructionTag.InitializeAccount3]: serializeInitializeAccount3,
  [TokenInstructionTag.InitializeMint2]: serializeInitializeMint2,
  [TokenInstructionTag.GetAccountDataSize]: serializeGetAccountDataSize,
  [TokenInstructionTag.InitializeImmutableOwner]:
    serializeInitializeImmutableOwner,
  [TokenInstructionTag.AmountToUiAmount]: serializeAmountToUiAmount,
  [TokenInstructionTag.UiAmountToAmount]: serializeUiAmountToAmount,
  // Add more as you implement them
};

const deserializeMap: {
  [K in keyof TokenInstructionValueMap]: (
    buffer: Uint8Array,
  ) => TokenInstructionValueMap[K];
} = {
  [TokenInstructionTag.InitializeMint]: deserializeInitializeMint,
  [TokenInstructionTag.InitializeAccount]: deserializeInitializeAccount,
  [TokenInstructionTag.InitializeMultisig]: deserializeInitializeMultisig,
  [TokenInstructionTag.Transfer]: deserializeTransfer,
  [TokenInstructionTag.Approve]: deserializeApprove,
  [TokenInstructionTag.Revoke]: deserializeRevoke,
  [TokenInstructionTag.SetAuthority]: deserializeSetAuthority,
  [TokenInstructionTag.MintTo]: deserializeMintTo,
  [TokenInstructionTag.Burn]: deserializeBurn,
  [TokenInstructionTag.CloseAccount]: deserializeCloseAccount,
  [TokenInstructionTag.FreezeAccount]: deserializeFreezeAccount,
  [TokenInstructionTag.ThawAccount]: deserializeThawAccount,
  [TokenInstructionTag.TransferChecked]: deserializeTransferChecked,
  [TokenInstructionTag.ApproveChecked]: deserializeApproveChecked,
  [TokenInstructionTag.MintToChecked]: deserializeMintToChecked,
  [TokenInstructionTag.BurnChecked]: deserializeBurnChecked,
  [TokenInstructionTag.InitializeAccount2]: deserializeInitializeAccount2,
  [TokenInstructionTag.InitializeAccount3]: deserializeInitializeAccount3,
  [TokenInstructionTag.InitializeMint2]: deserializeInitializeMint2,
  [TokenInstructionTag.GetAccountDataSize]: deserializeGetAccountDataSize,
  [TokenInstructionTag.InitializeImmutableOwner]:
    deserializeInitializeImmutableOwner,
  [TokenInstructionTag.AmountToUiAmount]: deserializeAmountToUiAmount,
  [TokenInstructionTag.UiAmountToAmount]: deserializeUiAmountToAmount,
  // Add more as you implement them
};

export function serializeTokenInstruction<
  K extends keyof TokenInstructionValueMap,
>(instruction: { type: K; value: TokenInstructionValueMap[K] }): Uint8Array {
  const serializer = serializeMap[instruction.type];
  if (!serializer) {
    throw new UnknownInstructionTagError(Number(instruction.type));
  }
  return serializer(instruction.value);
}

export const deserializeTokenInstruction = (
  buffer: Uint8Array,
): TokenInstruction => {
  const tag = buffer[0] as keyof TokenInstructionValueMap;
  const deserializer = deserializeMap[tag];
  if (!deserializer) {
    throw new UnknownInstructionTagError(Number(tag));
  }
  return {
    type: tag,
    value: deserializer(buffer),
  } as TokenInstruction;
};
