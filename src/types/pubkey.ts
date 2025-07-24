export type Pubkey = Uint8Array;

export type COptionPubkey =
  | { option: 0 } // None
  | { option: 1; value: Pubkey }; // Some(pubkey)
