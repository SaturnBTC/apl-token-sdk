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
import { UnknownInstructionTagError } from '../errors/unknown-instruction-tag-error';

export enum TokenInstructionTag {
  InitializeMint = 0,
  InitializeAccount = 1,
  InitializeMultisig = 2,
  Transfer = 3,
  Approve = 4,
  Revoke = 5,
  SetAuthority = 6,
  MintTo = 7,
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
