import { Pubkey } from '../types/pubkey';
import { Instruction } from '@saturnbtcio/arch-sdk';
import { AccountMeta } from '@saturnbtcio/arch-sdk';
import { TokenInstructionTag } from './instructions';
import { InstructionDeserializationError } from '../errors/instruction-deserialization-error';

export interface Transfer {
  amount: bigint;
}

export const serializeTransfer = (instruction: Transfer): Uint8Array => {
  const buffer = new Uint8Array(1 + 8); // tag + amount (u64)
  buffer[0] = TokenInstructionTag.Transfer;

  // Convert bigint to 8 bytes (little-endian)
  const amountBytes = new Uint8Array(8);
  const view = new DataView(amountBytes.buffer);
  view.setBigUint64(0, instruction.amount, true);
  buffer.set(amountBytes, 1);

  return buffer;
};

export const deserializeTransfer = (buffer: Uint8Array): Transfer => {
  if (buffer.length < 9) {
    throw new InstructionDeserializationError(
      'Buffer too short for Transfer',
      buffer[0],
    );
  }

  const tag = buffer[0];
  if (tag !== TokenInstructionTag.Transfer) {
    throw new InstructionDeserializationError('Invalid tag for Transfer', tag);
  }

  // Read u64 amount (8 bytes, little-endian)
  const amountBytes = buffer.slice(1, 9);
  const view = new DataView(
    amountBytes.buffer,
    amountBytes.byteOffset,
    amountBytes.byteLength,
  );
  const amount = view.getBigUint64(0, true);

  return { amount };
};

export const createTransferInstruction = (
  sourcePubkey: Pubkey,
  destinationPubkey: Pubkey,
  ownerPubkey: Pubkey,
  amount: bigint,
  programId: Pubkey,
  signerPubkeys: Pubkey[] = [], // For multisig support
): Instruction => {
  const data = serializeTransfer({ amount });

  const accounts: AccountMeta[] = [
    { pubkey: sourcePubkey, is_signer: false, is_writable: true },
    { pubkey: destinationPubkey, is_signer: false, is_writable: true },
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
