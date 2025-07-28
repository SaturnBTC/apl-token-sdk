import { Pubkey } from '../types/pubkey';
import { Instruction } from '@saturnbtcio/arch-sdk';
import { AccountMeta } from '@saturnbtcio/arch-sdk';
import { TokenInstructionTag } from './instructions';
import { InstructionDeserializationError } from '../errors/instruction-deserialization-error';

export interface MintTo {
  amount: bigint;
}

export const serializeMintTo = (instruction: MintTo): Uint8Array => {
  const buffer = new Uint8Array(1 + 8);
  buffer[0] = TokenInstructionTag.MintTo;

  const dataView = new DataView(
    buffer.buffer,
    buffer.byteOffset,
    buffer.byteLength,
  );
  dataView.setBigUint64(1, instruction.amount, true);

  return buffer;
};

export const deserializeMintTo = (buffer: Uint8Array): MintTo => {
  if (buffer.length < 9) {
    throw new InstructionDeserializationError(
      'Buffer too short for MintTo',
      buffer[0],
    );
  }

  const tag = buffer[0];
  if (tag !== TokenInstructionTag.MintTo) {
    throw new InstructionDeserializationError('Invalid tag for MintTo', tag);
  }

  const dataView = new DataView(
    buffer.buffer,
    buffer.byteOffset,
    buffer.byteLength,
  );
  const amount = dataView.getBigUint64(1, true);

  return {
    amount,
  };
};

export const createMintToInstruction = (
  mintPubkey: Pubkey,
  accountPubkey: Pubkey,
  ownerPubkey: Pubkey,
  amount: bigint,
  programId: Pubkey,
  signerPubkeys: Pubkey[] = [],
): Instruction => {
  const data = serializeMintTo({ amount });

  const accounts: AccountMeta[] = [
    { pubkey: mintPubkey, is_signer: false, is_writable: true },
    { pubkey: accountPubkey, is_signer: false, is_writable: true },
    {
      pubkey: ownerPubkey,
      is_signer: signerPubkeys.length === 0,
      is_writable: false,
    },
    ...signerPubkeys.map((pubkey) => ({
      pubkey,
      is_signer: true,
      is_writable: false,
    })),
  ];

  return {
    program_id: programId,
    accounts,
    data,
  };
};
