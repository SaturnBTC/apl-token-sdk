import { Pubkey } from '../types/pubkey';
import { Instruction } from '@saturnbtcio/arch-sdk';
import { AccountMeta } from '@saturnbtcio/arch-sdk';
import { TokenInstructionTag } from './instructions';
import { InstructionDeserializationError } from '../errors/instruction-deserialization-error';

export type InitializeImmutableOwner = {};

export const serializeInitializeImmutableOwner = (
  _instruction: InitializeImmutableOwner,
): Uint8Array => {
  return new Uint8Array([TokenInstructionTag.InitializeImmutableOwner]);
};

export const deserializeInitializeImmutableOwner = (
  buffer: Uint8Array,
): InitializeImmutableOwner => {
  const tag = buffer[0];
  if (tag !== TokenInstructionTag.InitializeImmutableOwner) {
    throw new InstructionDeserializationError(
      'Invalid tag for InitializeImmutableOwner',
      tag,
    );
  }
  return {};
};

export const createInitializeImmutableOwnerInstruction = (
  accountPubkey: Pubkey,
  programId: Pubkey,
): Instruction => {
  const data = serializeInitializeImmutableOwner({});

  const accounts: AccountMeta[] = [
    {
      pubkey: accountPubkey,
      is_signer: false,
      is_writable: true,
    },
  ];

  return {
    program_id: programId,
    accounts,
    data,
  };
};
