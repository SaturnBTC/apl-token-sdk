import { Instruction, AccountMeta, Pubkey } from '@saturnbtcio/arch-sdk';
import { TokenInstructionTag } from './instructions';
import { InstructionDeserializationError } from '../errors/instruction-deserialization-error';

export type ThawAccount = {};

export const serializeThawAccount = (_instruction: ThawAccount): Uint8Array => {
  const buffer = new Uint8Array(1);
  buffer[0] = TokenInstructionTag.ThawAccount;
  return buffer;
};

export const deserializeThawAccount = (buffer: Uint8Array): ThawAccount => {
  if (buffer.length < 1) {
    throw new InstructionDeserializationError(
      'Buffer too short for ThawAccount',
      buffer[0],
    );
  }

  const tag = buffer[0];
  if (tag !== TokenInstructionTag.ThawAccount) {
    throw new InstructionDeserializationError(
      'Invalid tag for ThawAccount',
      tag,
    );
  }

  return {};
};

export const createThawAccountInstruction = (
  accountPubkey: Pubkey,
  mintPubkey: Pubkey,
  ownerPubkey: Pubkey,
  programId: Pubkey,
  signerPubkeys: Pubkey[] = [],
): Instruction => {
  const data = serializeThawAccount({});

  const accounts: AccountMeta[] = [
    { pubkey: accountPubkey, is_signer: false, is_writable: true },
    { pubkey: mintPubkey, is_signer: false, is_writable: false },
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
