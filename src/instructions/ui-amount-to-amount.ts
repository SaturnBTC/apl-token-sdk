import { Pubkey } from '../types/pubkey';
import { Instruction } from '@saturnbtcio/arch-sdk';
import { AccountMeta } from '@saturnbtcio/arch-sdk';
import { TokenInstructionTag } from './instructions';
import { InstructionDeserializationError } from '../errors/instruction-deserialization-error';

export interface UiAmountToAmount {
  uiAmount: string;
}

export const serializeUiAmountToAmount = (
  instruction: UiAmountToAmount,
): Uint8Array => {
  const uiAmountBytes = new TextEncoder().encode(instruction.uiAmount);
  const buffer = new Uint8Array(1 + uiAmountBytes.length); // tag (1) + uiAmount string (variable)

  buffer[0] = TokenInstructionTag.UiAmountToAmount;
  buffer.set(uiAmountBytes, 1);

  return buffer;
};

export const deserializeUiAmountToAmount = (
  buffer: Uint8Array,
): UiAmountToAmount => {
  if (buffer.length < 1) {
    throw new InstructionDeserializationError(
      'Buffer too short for UiAmountToAmount',
      buffer[0],
    );
  }

  const tag = buffer[0];
  if (tag !== TokenInstructionTag.UiAmountToAmount) {
    throw new InstructionDeserializationError(
      `Invalid tag for UiAmountToAmount: ${tag}`,
      tag,
    );
  }

  const uiAmountBytes = buffer.slice(1);
  const uiAmount = new TextDecoder().decode(uiAmountBytes);

  return { uiAmount };
};

export const createUiAmountToAmountInstruction = (
  mintPubkey: Pubkey,
  uiAmount: string,
  programId: Pubkey,
): Instruction => {
  const data = serializeUiAmountToAmount({ uiAmount });

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
