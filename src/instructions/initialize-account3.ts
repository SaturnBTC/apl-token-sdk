import { Pubkey } from '../types/pubkey';
import { Instruction, AccountMeta } from '@saturnbtcio/arch-sdk';
import { TokenInstructionTag } from './instructions';
import { InstructionDeserializationError } from '../errors/instruction-deserialization-error';

export interface InitializeAccount3 {
  owner: Pubkey;
}

export const serializeInitializeAccount3 = (
  instruction: InitializeAccount3,
): Uint8Array => {
  const buffer = new Uint8Array(1 + 32); // tag (1) + owner pubkey (32)
  buffer[0] = TokenInstructionTag.InitializeAccount3;
  buffer.set(instruction.owner, 1);
  return buffer;
};

export const deserializeInitializeAccount3 = (
  buffer: Uint8Array,
): InitializeAccount3 => {
  if (buffer.length < 1 + 32) {
    throw new InstructionDeserializationError(
      'Buffer too short for InitializeAccount3',
      buffer[0],
    );
  }

  const tag = buffer[0];
  if (tag !== TokenInstructionTag.InitializeAccount3) {
    throw new InstructionDeserializationError(
      `Invalid tag for InitializeAccount3: ${tag}`,
      tag,
    );
  }

  const owner = buffer.slice(1, 1 + 32);

  return { owner };
};

export const createInitializeAccount3Instruction = (
  accountPubkey: Pubkey,
  mintPubkey: Pubkey,
  owner: Pubkey,
  programId: Pubkey,
): Instruction => {
  const data = serializeInitializeAccount3({ owner });

  const accounts: AccountMeta[] = [
    {
      pubkey: accountPubkey,
      is_signer: false,
      is_writable: true,
    },
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
