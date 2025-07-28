import { Pubkey } from '../types/pubkey';
import { Instruction } from '@saturnbtcio/arch-sdk';
import { AccountMeta } from '@saturnbtcio/arch-sdk';
import { TokenInstructionTag } from './instructions';
import { InstructionDeserializationError } from '../errors/instruction-deserialization-error';

export interface Approve {
  amount: bigint;
}

export const serializeApprove = (instruction: Approve): Uint8Array => {
  const buffer = new Uint8Array(1 + 8); // tag + amount (u64)
  buffer[0] = TokenInstructionTag.Approve;

  const amountBytes = new Uint8Array(8);
  const view = new DataView(amountBytes.buffer);
  view.setBigUint64(0, instruction.amount, true);
  buffer.set(amountBytes, 1);

  return buffer;
};

export const deserializeApprove = (buffer: Uint8Array): Approve => {
  if (buffer.length < 9) {
    throw new InstructionDeserializationError(
      'Buffer too short for Approve',
      buffer[0],
    );
  }

  const tag = buffer[0];
  if (tag !== TokenInstructionTag.Approve) {
    throw new InstructionDeserializationError('Invalid tag for Approve', tag);
  }

  const amountBytes = buffer.slice(1, 9);
  const view = new DataView(
    amountBytes.buffer,
    amountBytes.byteOffset,
    amountBytes.byteLength,
  );
  const amount = view.getBigUint64(0, true);

  return { amount };
};

export const createApproveInstruction = (
  sourcePubkey: Pubkey,
  delegatePubkey: Pubkey,
  ownerPubkey: Pubkey,
  amount: bigint,
  programId: Pubkey,
  signerPubkeys: Pubkey[] = [],
): Instruction => {
  const data = serializeApprove({ amount });

  const accounts: AccountMeta[] = [
    { pubkey: sourcePubkey, is_signer: false, is_writable: true },
    { pubkey: delegatePubkey, is_signer: false, is_writable: false },
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
