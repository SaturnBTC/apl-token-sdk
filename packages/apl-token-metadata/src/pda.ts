import { Pubkey, PubkeyUtil } from '@saturnbtcio/arch-sdk';
import { ATTRIBUTES_SEED, METADATA_SEED } from './program';

export const findMetadataPda = (
  programId: Pubkey,
  mint: Pubkey,
): [Pubkey, number] => {
  return PubkeyUtil.findProgramAddress([METADATA_SEED, mint], programId);
};

export const findAttributesPda = (
  programId: Pubkey,
  mint: Pubkey,
): [Pubkey, number] => {
  return PubkeyUtil.findProgramAddress([ATTRIBUTES_SEED, mint], programId);
};

