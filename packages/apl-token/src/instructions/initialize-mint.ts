import { TokenInstructionTag } from './instructions';
import {
  COptionPubkey,
  serializeCOptionPubkey,
  deserializeCOptionPubkey,
} from '../types/pubkey';
import { InstructionDeserializationError } from '../errors/instruction-deserialization-error';
import { Instruction, AccountMeta, Pubkey } from '@saturnbtcio/arch-sdk';

export interface InitializeMint {
  decimals: number;
  mintAuthority: Pubkey;
  freezeAuthority: COptionPubkey;
}

export const serializeInitializeMint = (
  instruction: InitializeMint,
): Uint8Array => {
  const buffer = new Uint8Array(1 + 1 + 32 + 1 + 32);
  let offset = 0;
  buffer[offset++] = TokenInstructionTag.InitializeMint;
  buffer[offset++] = instruction.decimals;
  buffer.set(instruction.mintAuthority, offset);
  offset += 32;
  const freezeBuffer = serializeCOptionPubkey(instruction.freezeAuthority);
  buffer.set(freezeBuffer, offset);
  offset += freezeBuffer.length;
  return buffer.subarray(0, offset);
};

export const deserializeInitializeMint = (
  buffer: Uint8Array,
): InitializeMint => {
  let offset = 0;
  const tag = buffer[offset++];
  if (tag !== TokenInstructionTag.InitializeMint) {
    throw new InstructionDeserializationError(
      'Invalid tag for InitializeMint',
      tag,
    );
  }
  if (buffer.length < offset + 1)
    throw new InstructionDeserializationError(
      'Buffer too short for decimals',
      tag,
    );
  const decimals = Number(buffer[offset++]);
  if (buffer.length < offset + 32)
    throw new InstructionDeserializationError(
      'Invalid mintAuthority length',
      tag,
    );
  const mintAuthority = buffer.slice(offset, offset + 32);
  offset += 32;
  const { value: freezeAuthority, read } = deserializeCOptionPubkey(
    buffer,
    offset,
  );
  offset += read;
  return {
    decimals,
    mintAuthority,
    freezeAuthority,
  };
};

export const createInitializeMintInstruction = (
  instruction: InitializeMint,
  mintPubkey: Pubkey,
  programId: Pubkey,
): Instruction => {
  const data = serializeInitializeMint(instruction);
  const accounts: AccountMeta[] = [
    {
      pubkey: mintPubkey,
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
