import { Pubkey } from '../types/pubkey';
import { Instruction } from '@saturnbtcio/arch-sdk';
import { AccountMeta } from '@saturnbtcio/arch-sdk';
import { TokenInstructionTag } from './instructions';
import { InstructionDeserializationError } from '../errors/instruction-deserialization-error';

// TODO: Check the solution
export type CloseAccount = {};

export const serializeCloseAccount = (
  _instruction: CloseAccount,
): Uint8Array => {
  const buffer = new Uint8Array(1);
  buffer[0] = TokenInstructionTag.CloseAccount;
  return buffer;
};

export const deserializeCloseAccount = (buffer: Uint8Array): CloseAccount => {
  if (buffer.length < 1) {
    throw new InstructionDeserializationError(
      'Buffer too short for CloseAccount',
      buffer[0],
    );
  }

  const tag = buffer[0];
  if (tag !== TokenInstructionTag.CloseAccount) {
    throw new InstructionDeserializationError(
      'Invalid tag for CloseAccount',
      tag,
    );
  }

  return {};
};

export const createCloseAccountInstruction = (
  accountPubkey: Pubkey,
  destinationPubkey: Pubkey,
  ownerPubkey: Pubkey,
  programId: Pubkey,
  signerPubkeys: Pubkey[] = [], // For multisig support
): Instruction => {
  const data = serializeCloseAccount({});

  const accounts: AccountMeta[] = [
    { pubkey: accountPubkey, is_signer: false, is_writable: true },
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
