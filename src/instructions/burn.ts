import { Instruction, AccountMeta, Pubkey } from '@saturnbtcio/arch-sdk';
import { TokenInstructionTag } from './instructions';
import { InstructionDeserializationError } from '../errors/instruction-deserialization-error';

export interface Burn {
  amount: bigint;
}

export const serializeBurn = (instruction: Burn): Uint8Array => {
  const buffer = new Uint8Array(1 + 8);
  buffer[0] = TokenInstructionTag.Burn;

  const dataView = new DataView(
    buffer.buffer,
    buffer.byteOffset,
    buffer.byteLength,
  );
  dataView.setBigUint64(1, instruction.amount, true);

  return buffer;
};

export const deserializeBurn = (buffer: Uint8Array): Burn => {
  if (buffer.length < 9) {
    throw new InstructionDeserializationError(
      'Buffer too short for Burn',
      buffer[0],
    );
  }

  const tag = buffer[0];
  if (tag !== TokenInstructionTag.Burn) {
    throw new InstructionDeserializationError('Invalid tag for Burn', tag);
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

export const createBurnInstruction = (
  accountPubkey: Pubkey,
  mintPubkey: Pubkey,
  authorityPubkey: Pubkey,
  amount: bigint,
  programId: Pubkey,
  signerPubkeys: Pubkey[] = [],
): Instruction => {
  const data = serializeBurn({ amount });

  const accounts: AccountMeta[] = [
    { pubkey: accountPubkey, is_signer: false, is_writable: true },
    { pubkey: mintPubkey, is_signer: false, is_writable: true },
    {
      pubkey: authorityPubkey,
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
