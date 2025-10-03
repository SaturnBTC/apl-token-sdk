import { Pubkey } from '@saturnbtcio/arch-sdk';

const textEncoder = new TextEncoder();

export const encodeU32LE = (value: number): Uint8Array => {
  const buf = new Uint8Array(4);
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  view.setUint32(0, value >>> 0, true);
  return buf;
};

export const encodeU8 = (value: number): Uint8Array => {
  return new Uint8Array([value & 0xff]);
};

export const encodeBool = (value: boolean): Uint8Array => {
  return encodeU8(value ? 1 : 0);
};

export const encodeString = (value: string): Uint8Array => {
  const bytes = textEncoder.encode(value);
  const len = encodeU32LE(bytes.length);
  const out = new Uint8Array(len.length + bytes.length);
  out.set(len, 0);
  out.set(bytes, len.length);
  return out;
};

export const encodeOptionString = (value: string | null | undefined): Uint8Array => {
  if (value === null || value === undefined) {
    return encodeU8(0);
  }
  const content = encodeString(value);
  const out = new Uint8Array(1 + content.length);
  out[0] = 1;
  out.set(content, 1);
  return out;
};

export const encodePubkey = (value: Pubkey): Uint8Array => {
  if (value.length !== 32) {
    throw new Error('Pubkey must be 32 bytes');
  }
  return new Uint8Array(value);
};

export const concatBytes = (...parts: Uint8Array[]): Uint8Array => {
  const total = parts.reduce((sum, p) => sum + p.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const p of parts) {
    out.set(p, offset);
    offset += p.length;
  }
  return out;
};

export const encodeVecPairsString = (pairs: Array<[string, string]>): Uint8Array => {
  const len = encodeU32LE(pairs.length);
  const items = pairs.map(([k, v]) => concatBytes(encodeString(k), encodeString(v)));
  return concatBytes(len, ...items);
};

