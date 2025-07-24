import { TokenInstructionTag } from './instructions';
import { Pubkey, COptionPubkey } from '../types/pubkey';
import { InstructionDeserializationError } from '../errors/instruction-deserialization-error';
import { InvalidCOptionError } from '../errors/invalid-coption-error';
import { Instruction } from '@saturnbtcio/arch-sdk';
import { AccountMeta } from '@saturnbtcio/arch-sdk';

export interface InitializeMint {
  decimals: number;
  mintAuthority: Pubkey;
  freezeAuthority: COptionPubkey;
}

const serializeCOptionPubkey = (option: COptionPubkey): Uint8Array => {
  if (option.option === 0) {
    return new Uint8Array([0]);
  } else {
    const buffer = new Uint8Array(1 + 32);
    buffer[0] = 1;
    buffer.set(option.value, 1);
    return buffer;
  }
};

const deserializeCOptionPubkey = (
  buffer: Uint8Array,
  offset: number,
): { value: COptionPubkey; read: number } => {
  const tag = buffer[offset];
  if (tag === 0) {
    return { value: { option: 0 }, read: 1 };
  } else if (tag === 1) {
    if (buffer.length < offset + 33)
      throw new InvalidCOptionError('Invalid pubkey length in COption');
    const pubkey = buffer.slice(offset + 1, offset + 33);
    return { value: { option: 1, value: pubkey }, read: 1 + 32 };
  } else {
    throw new InvalidCOptionError('Invalid COption tag');
  }
};

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
