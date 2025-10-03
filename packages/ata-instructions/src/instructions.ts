import { AccountMeta, Instruction, Pubkey } from '@saturnbtcio/arch-sdk';
import {
  AssociatedTokenAccountParams,
  CreateAssociatedTokenAccount,
  CreateIdempotentAssociatedTokenAccount,
} from './types';

// These tags are specific to the Associated Token Account program
// We only need them for binary compatibility if we ever serialize data (we don't here)
const enum AtaInstructionTag {
  Create = 0,
  CreateIdempotent = 1,
}

function makeCommonAccounts(params: AssociatedTokenAccountParams): AccountMeta[] {
  return [
    { pubkey: params.payer, is_signer: true, is_writable: true },
    { pubkey: params.associatedToken, is_signer: false, is_writable: true },
    { pubkey: params.owner, is_signer: false, is_writable: false },
    { pubkey: params.mint, is_signer: false, is_writable: false },
    { pubkey: params.systemProgramId, is_signer: false, is_writable: false },
    { pubkey: params.tokenProgramId, is_signer: false, is_writable: false },
  ];
}

export function createAssociatedTokenAccountInstruction(
  params: AssociatedTokenAccountParams,
): Instruction {
  const accounts = makeCommonAccounts(params);
  return {
    program_id: params.associatedTokenProgramId,
    accounts,
    data: new Uint8Array([AtaInstructionTag.Create]),
  };
}

export function createIdempotentAssociatedTokenAccountInstruction(
  params: AssociatedTokenAccountParams,
): Instruction {
  const accounts = makeCommonAccounts(params);
  return {
    program_id: params.associatedTokenProgramId,
    accounts,
    data: new Uint8Array([AtaInstructionTag.CreateIdempotent]),
  };
}

