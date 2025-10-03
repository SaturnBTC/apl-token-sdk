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
}

export type TokenInstruction = {
  [K in keyof TokenInstructionValueMap]: {
    type: K;
    value: TokenInstructionValueMap[K];
  };
}[keyof TokenInstructionValueMap];

const instructionHandlers: {
  [K in keyof TokenInstructionValueMap]: {
    serialize: (value: TokenInstructionValueMap[K]) => Uint8Array;
    deserialize: (buffer: Uint8Array) => TokenInstructionValueMap[K];
  };
} = {
  [TokenInstructionTag.InitializeMint]: {
    serialize: serializeInitializeMint,
    deserialize: deserializeInitializeMint,
  },
  [TokenInstructionTag.InitializeAccount]: {
    serialize: serializeInitializeAccount,
    deserialize: deserializeInitializeAccount,
  },
  [TokenInstructionTag.InitializeMultisig]: {
    serialize: serializeInitializeMultisig,
    deserialize: deserializeInitializeMultisig,
  },
  [TokenInstructionTag.Transfer]: {
    serialize: serializeTransfer,
    deserialize: deserializeTransfer,
  },
  [TokenInstructionTag.Approve]: {
    serialize: serializeApprove,
    deserialize: deserializeApprove,
  },
  [TokenInstructionTag.Revoke]: {
    serialize: serializeRevoke,
    deserialize: deserializeRevoke,
  },
  [TokenInstructionTag.SetAuthority]: {
    serialize: serializeSetAuthority,
    deserialize: deserializeSetAuthority,
  },
  [TokenInstructionTag.MintTo]: {
    serialize: serializeMintTo,
    deserialize: deserializeMintTo,
  },
  [TokenInstructionTag.Burn]: {
    serialize: serializeBurn,
    deserialize: deserializeBurn,
  },
  [TokenInstructionTag.CloseAccount]: {
    serialize: serializeCloseAccount,
    deserialize: deserializeCloseAccount,
  },
  [TokenInstructionTag.FreezeAccount]: {
    serialize: serializeFreezeAccount,
    deserialize: deserializeFreezeAccount,
  },
  [TokenInstructionTag.ThawAccount]: {
    serialize: serializeThawAccount,
    deserialize: deserializeThawAccount,
  },
  [TokenInstructionTag.TransferChecked]: {
    serialize: serializeTransferChecked,
    deserialize: deserializeTransferChecked,
  },
  [TokenInstructionTag.ApproveChecked]: {
    serialize: serializeApproveChecked,
    deserialize: deserializeApproveChecked,
  },
  [TokenInstructionTag.MintToChecked]: {
    serialize: serializeMintToChecked,
    deserialize: deserializeMintToChecked,
  },
  [TokenInstructionTag.BurnChecked]: {
    serialize: serializeBurnChecked,
    deserialize: deserializeBurnChecked,
  },
  [TokenInstructionTag.InitializeAccount2]: {
    serialize: serializeInitializeAccount2,
    deserialize: deserializeInitializeAccount2,
  },
  [TokenInstructionTag.InitializeAccount3]: {
    serialize: serializeInitializeAccount3,
    deserialize: deserializeInitializeAccount3,
  },
  [TokenInstructionTag.InitializeMint2]: {
    serialize: serializeInitializeMint2,
    deserialize: deserializeInitializeMint2,
  },
  [TokenInstructionTag.GetAccountDataSize]: {
    serialize: serializeGetAccountDataSize,
    deserialize: deserializeGetAccountDataSize,
  },
  [TokenInstructionTag.InitializeImmutableOwner]: {
    serialize: serializeInitializeImmutableOwner,
    deserialize: deserializeInitializeImmutableOwner,
  },
  [TokenInstructionTag.AmountToUiAmount]: {
    serialize: serializeAmountToUiAmount,
    deserialize: deserializeAmountToUiAmount,
  },
  [TokenInstructionTag.UiAmountToAmount]: {
    serialize: serializeUiAmountToAmount,
    deserialize: deserializeUiAmountToAmount,
  },
};

export function serializeTokenInstruction<
  K extends keyof TokenInstructionValueMap,
>(instruction: { type: K; value: TokenInstructionValueMap[K] }): Uint8Array {
  const handler = instructionHandlers[instruction.type];
  if (!handler) {
    throw new UnknownInstructionTagError(Number(instruction.type));
  }
  return handler.serialize(instruction.value);
}

export const deserializeTokenInstruction = (
  buffer: Uint8Array,
): TokenInstruction => {
  const tag = buffer[0] as keyof TokenInstructionValueMap;
  const handler = instructionHandlers[tag];
  if (!handler) {
    throw new UnknownInstructionTagError(Number(tag));
  }
  return {
    type: tag,
    value: handler.deserialize(buffer),
  } as TokenInstruction;
};
