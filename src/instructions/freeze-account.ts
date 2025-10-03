import { Instruction, AccountMeta, Pubkey } from '@saturnbtcio/arch-sdk';
import { TokenInstructionTag } from './instructions';
import { InstructionDeserializationError } from '../errors/instruction-deserialization-error';

export type FreezeAccount = {};

export const serializeFreezeAccount = (
  _instruction: FreezeAccount,
): Uint8Array => {
  const buffer = new Uint8Array(1);
  buffer[0] = TokenInstructionTag.FreezeAccount;
  return buffer;
};

export const deserializeFreezeAccount = (buffer: Uint8Array): FreezeAccount => {
  if (buffer.length < 1) {
    throw new InstructionDeserializationError(
      'Buffer too short for FreezeAccount',
      buffer[0],
    );
  }

  const tag = buffer[0];
  if (tag !== TokenInstructionTag.FreezeAccount) {
    throw new InstructionDeserializationError(
      'Invalid tag for FreezeAccount',
      tag,
    );
  }

  return {};
};

export const createFreezeAccountInstruction = (
  accountPubkey: Pubkey,
  mintPubkey: Pubkey,
  ownerPubkey: Pubkey,
  programId: Pubkey,
  signerPubkeys: Pubkey[] = [],
): Instruction => {
  const data = serializeFreezeAccount({});

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
