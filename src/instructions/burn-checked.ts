import { Instruction, AccountMeta, Pubkey } from '@saturnbtcio/arch-sdk';
import { TokenInstructionTag } from './instructions';
import { InstructionDeserializationError } from '../errors/instruction-deserialization-error';

export interface BurnChecked {
  amount: bigint;
  decimals: number;
}

export const serializeBurnChecked = (instruction: BurnChecked): Uint8Array => {
  const buffer = new Uint8Array(1 + 8 + 1); // 1 byte for tag + 8 bytes for u64 + 1 byte for u8
  buffer[0] = TokenInstructionTag.BurnChecked;

  const dataView = new DataView(
    buffer.buffer,
    buffer.byteOffset,
    buffer.byteLength,
  );
  dataView.setBigUint64(1, instruction.amount, true);
  buffer[9] = instruction.decimals;

  return buffer;
};

export const deserializeBurnChecked = (buffer: Uint8Array): BurnChecked => {
  if (buffer.length < 10) {
    throw new InstructionDeserializationError(
      'Buffer too short for BurnChecked',
      buffer[0],
    );
  }

  const tag = buffer[0];
  if (tag !== TokenInstructionTag.BurnChecked) {
    throw new InstructionDeserializationError(
      'Invalid tag for BurnChecked',
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

export const createBurnCheckedInstruction = (
  accountPubkey: Pubkey,
  mintPubkey: Pubkey,
  ownerPubkey: Pubkey,
  amount: bigint,
  decimals: number,
  programId: Pubkey,
  signerPubkeys: Pubkey[] = [],
): Instruction => {
  const data = serializeBurnChecked({ amount, decimals });

  const accounts: AccountMeta[] = [
    { pubkey: accountPubkey, is_signer: false, is_writable: true },
    { pubkey: mintPubkey, is_signer: false, is_writable: true },
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
