import { Pubkey } from '../types/pubkey';
import { Instruction } from '@saturnbtcio/arch-sdk';
import { AccountMeta } from '@saturnbtcio/arch-sdk';
import { TokenInstructionTag } from './instructions';
import { InstructionDeserializationError } from '../errors/instruction-deserialization-error';

export interface TransferChecked {
  amount: bigint;
  decimals: number;
}

export const serializeTransferChecked = (
  instruction: TransferChecked,
): Uint8Array => {
  const buffer = new Uint8Array(1 + 8 + 1); // 1 byte for tag + 8 bytes for u64 + 1 byte for u8
  buffer[0] = TokenInstructionTag.TransferChecked;

  const dataView = new DataView(
    buffer.buffer,
    buffer.byteOffset,
    buffer.byteLength,
  );
  dataView.setBigUint64(1, instruction.amount, true);
  buffer[9] = instruction.decimals;

  return buffer;
};

export const deserializeTransferChecked = (
  buffer: Uint8Array,
): TransferChecked => {
  if (buffer.length < 10) {
    throw new InstructionDeserializationError(
      'Buffer too short for TransferChecked',
      buffer[0],
    );
  }

  const tag = buffer[0];
  if (tag !== TokenInstructionTag.TransferChecked) {
    throw new InstructionDeserializationError(
      'Invalid tag for TransferChecked',
      tag,
    );
  }

  const dataView = new DataView(
    buffer.buffer,
    buffer.byteOffset,
    buffer.byteLength,
  );
  const amount = dataView.getBigUint64(1, true);
  const decimals = Number(buffer[9]);

  return {
    amount,
    decimals,
  };
};

export const createTransferCheckedInstruction = (
  sourcePubkey: Pubkey,
  mintPubkey: Pubkey,
  destinationPubkey: Pubkey,
  authorityPubkey: Pubkey,
  amount: bigint,
  decimals: number,
  programId: Pubkey,
  signerPubkeys: Pubkey[] = [], // For multisig support
): Instruction => {
  const data = serializeTransferChecked({ amount, decimals });

  const accounts: AccountMeta[] = [
    { pubkey: sourcePubkey, is_signer: false, is_writable: true },
    { pubkey: mintPubkey, is_signer: false, is_writable: false },
    { pubkey: destinationPubkey, is_signer: false, is_writable: true },
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
