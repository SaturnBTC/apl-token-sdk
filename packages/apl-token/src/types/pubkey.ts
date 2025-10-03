import { Pubkey } from '@saturnbtcio/arch-sdk';

export type COptionPubkey =
  | { option: 0 } // None
  | { option: 1; value: Pubkey }; // Some(pubkey)

export const serializeCOptionPubkey = (option: COptionPubkey): Uint8Array => {
  if (option.option === 0) {
    return new Uint8Array([0]);
  } else {
    const buffer = new Uint8Array(1 + 32);
    buffer[0] = 1;
    buffer.set(option.value, 1);
    return buffer;
  }
};

export const deserializeCOptionPubkey = (
  buffer: Uint8Array,
  offset: number,
): { value: COptionPubkey; read: number } => {
  if (offset >= buffer.length) {
    throw new Error('Buffer too short for COption<Pubkey>');
  }

  const option = buffer[offset];
  if (option === 0) {
    return { value: { option: 0 }, read: 1 };
  } else if (option === 1) {
    if (offset + 1 + 32 > buffer.length) {
      throw new Error('Buffer too short for COption<Pubkey> value');
    }
    const pubkey = buffer.slice(offset + 1, offset + 1 + 32);
    return { value: { option: 1, value: pubkey }, read: 1 + 32 };
  } else {
    throw new Error('Invalid COption<Pubkey> option value');
  }
};
