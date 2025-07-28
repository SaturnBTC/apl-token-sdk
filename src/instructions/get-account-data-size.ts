import { Instruction, AccountMeta, Pubkey } from '@saturnbtcio/arch-sdk';
import { TokenInstructionTag } from './instructions';
import { InstructionDeserializationError } from '../errors/instruction-deserialization-error';

// TODO: Check the solution
export type GetAccountDataSize = {};

export const serializeGetAccountDataSize = (
  _instruction: GetAccountDataSize,
): Uint8Array => {
  return new Uint8Array([TokenInstructionTag.GetAccountDataSize]);
};

export const deserializeGetAccountDataSize = (
  buffer: Uint8Array,
): GetAccountDataSize => {
  const tag = buffer[0];
  if (tag !== TokenInstructionTag.GetAccountDataSize) {
    throw new InstructionDeserializationError(
      'Invalid tag for GetAccountDataSize',
      tag,
    );
  }
  return {};
};

export const createGetAccountDataSizeInstruction = (
  mintPubkey: Pubkey,
  programId: Pubkey,
): Instruction => {
  const data = serializeGetAccountDataSize({});

  const accounts: AccountMeta[] = [
    {
      pubkey: mintPubkey,
      is_signer: false,
      is_writable: false,
    },
  ];

  return {
    program_id: programId,
    accounts,
    data,
  };
};
