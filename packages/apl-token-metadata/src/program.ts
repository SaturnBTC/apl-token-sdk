import { Pubkey } from '@saturnbtcio/arch-sdk';

export const ARCH_TOKEN_METADATA_PROGRAM_ID: Pubkey = new Uint8Array(
  Buffer.from('ArchTokenMetadata111111111111111'),
) as unknown as Pubkey;

export const METADATA_SEED = new TextEncoder().encode('metadata');
export const ATTRIBUTES_SEED = new TextEncoder().encode('attributes');

