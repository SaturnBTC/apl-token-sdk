import { Pubkey } from '../types/pubkey';
import { Instruction } from '@saturnbtcio/arch-sdk';
import { AccountMeta } from '@saturnbtcio/arch-sdk';
import { TokenInstructionTag } from './instructions';
import { InstructionDeserializationError } from '../errors/instruction-deserialization-error';

// TODO: Check the solution
export type InitializeAccount = {};

export const serializeInitializeAccount = (
  _instruction: InitializeAccount,
): Uint8Array => {
  return new Uint8Array([TokenInstructionTag.InitializeAccount]);
};

export const deserializeInitializeAccount = (
  buffer: Uint8Array,
): InitializeAccount => {
  const tag = buffer[0];
  if (tag !== TokenInstructionTag.InitializeAccount) {
    throw new InstructionDeserializationError(
      'Invalid tag for InitializeAccount',
      tag,
    );
  }
  return {};
};

export const createInitializeAccountInstruction = (
  accountPubkey: Pubkey,
  mintPubkey: Pubkey,
  ownerPubkey: Pubkey,
  programId: Pubkey,
): Instruction => {
  const data = serializeInitializeAccount({});
  const accounts: AccountMeta[] = [
    { pubkey: accountPubkey, is_signer: false, is_writable: true },
    { pubkey: mintPubkey, is_signer: false, is_writable: false },
    { pubkey: ownerPubkey, is_signer: false, is_writable: false },
  ];
  return {
    program_id: programId,
    accounts,
    data,
  };
};
