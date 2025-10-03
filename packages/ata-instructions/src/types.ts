import { Pubkey } from '@saturnbtcio/arch-sdk';

export type CreateAssociatedTokenAccount = {};

export type CreateIdempotentAssociatedTokenAccount = {};

export interface AssociatedTokenAccountParams {
  payer: Pubkey;
  owner: Pubkey;
  mint: Pubkey;
  associatedToken: Pubkey;
  tokenProgramId: Pubkey;
  associatedTokenProgramId: Pubkey;
  systemProgramId: Pubkey;
}

