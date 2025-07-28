import { Pubkey } from '../types/pubkey';
import { Instruction } from '@saturnbtcio/arch-sdk';
import { AccountMeta } from '@saturnbtcio/arch-sdk';
import { TokenInstructionTag } from './instructions';
import { InstructionDeserializationError } from '../errors/instruction-deserialization-error';

export interface AmountToUiAmount {
  amount: bigint;
}

export const serializeAmountToUiAmount = (
  instruction: AmountToUiAmount,
): Uint8Array => {
  const buffer = new Uint8Array(1 + 8); // tag (1) + amount (u64)
  buffer[0] = TokenInstructionTag.AmountToUiAmount;

  const amountBytes = new Uint8Array(8);
  const view = new DataView(amountBytes.buffer);
  view.setBigUint64(0, instruction.amount, true);
  buffer.set(amountBytes, 1);

  return buffer;
};

export const deserializeAmountToUiAmount = (
  buffer: Uint8Array,
): AmountToUiAmount => {
  if (buffer.length < 9) {
    throw new InstructionDeserializationError(
      'Buffer too short for AmountToUiAmount',
      buffer[0],
    );
  }

  const tag = buffer[0];
  if (tag !== TokenInstructionTag.AmountToUiAmount) {
    throw new InstructionDeserializationError(
      `Invalid tag for AmountToUiAmount: ${tag}`,
      tag,
    );
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

export const createAmountToUiAmountInstruction = (
  mintPubkey: Pubkey,
  amount: bigint,
  programId: Pubkey,
): Instruction => {
  const data = serializeAmountToUiAmount({ amount });

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
