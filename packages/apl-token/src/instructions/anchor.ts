import { Instruction, AccountMeta, Pubkey } from '@saturnbtcio/arch-sdk';
import { TokenInstructionTag } from './instructions';
import { InstructionDeserializationError } from '../errors/instruction-deserialization-error';

export interface InputToSign {
  index: number; // u32 little-endian
  signer: Pubkey; // 32 bytes
}

export interface Anchor {
  txid: Uint8Array; // 32 bytes
  inputToSign: InputToSign;
}

export const serializeAnchor = (instruction: Anchor): Uint8Array => {
  if (instruction.txid.length !== 32) {
    throw new Error('txid must be 32 bytes');
  }
  if (instruction.inputToSign.signer.length !== 32) {
    throw new Error('inputToSign.signer must be 32 bytes');
  }

  const buffer = new Uint8Array(1 + 32 + 4 + 32);
  buffer[0] = TokenInstructionTag.Anchor as number;
  buffer.set(instruction.txid, 1);

  const view = new DataView(
    buffer.buffer,
    buffer.byteOffset,
    buffer.byteLength,
  );
  view.setUint32(1 + 32, instruction.inputToSign.index >>> 0, true);

  buffer.set(instruction.inputToSign.signer, 1 + 32 + 4);

  return buffer;
};

export const deserializeAnchor = (buffer: Uint8Array): Anchor => {
  if (buffer.length < 1 + 32 + 4 + 32) {
    throw new InstructionDeserializationError(
      'Buffer too short for Anchor',
      buffer[0],
    );
  }

  const tag = buffer[0];
  if (tag !== (TokenInstructionTag.Anchor as number)) {
    throw new InstructionDeserializationError('Invalid tag for Anchor', tag);
  }

  const txid = buffer.slice(1, 1 + 32);
  const view = new DataView(
    buffer.buffer,
    buffer.byteOffset,
    buffer.byteLength,
  );
  const index = view.getUint32(1 + 32, true);
  const signer = buffer.slice(1 + 32 + 4, 1 + 32 + 4 + 32);

  return {
    txid,
    inputToSign: { index, signer },
  };
};

export const createAnchorInstruction = (
  accountPubkey: Pubkey,
  ownerPubkey: Pubkey,
  txid: Uint8Array,
  inputToSign: InputToSign,
  programId: Pubkey,
): Instruction => {
  const data = serializeAnchor({ txid, inputToSign });

  const accounts: AccountMeta[] = [
    { pubkey: accountPubkey, is_signer: false, is_writable: true },
    { pubkey: ownerPubkey, is_signer: true, is_writable: false },
  ];

  return {
    program_id: programId,
    accounts,
    data,
  };
};


