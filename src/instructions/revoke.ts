import { Pubkey } from '../types/pubkey';
import { Instruction } from '@saturnbtcio/arch-sdk';
import { AccountMeta } from '@saturnbtcio/arch-sdk';
import { TokenInstructionTag } from './instructions';
import { InstructionDeserializationError } from '../errors/instruction-deserialization-error';

// TODO: Check the solution
export type Revoke = {};

export const serializeRevoke = (_instruction: Revoke): Uint8Array => {
  return new Uint8Array([TokenInstructionTag.Revoke]);
};

export const deserializeRevoke = (buffer: Uint8Array): Revoke => {
  const tag = buffer[0];
  if (tag !== TokenInstructionTag.Revoke) {
    throw new InstructionDeserializationError('Invalid tag for Revoke', tag);
  }
  return {};
};

export const createRevokeInstruction = (
  sourcePubkey: Pubkey,
  ownerPubkey: Pubkey,
  programId: Pubkey,
  signerPubkeys: Pubkey[] = [], // For multisig support
): Instruction => {
  const data = serializeRevoke({});

  const accounts: AccountMeta[] = [
    { pubkey: sourcePubkey, is_signer: false, is_writable: true },
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
