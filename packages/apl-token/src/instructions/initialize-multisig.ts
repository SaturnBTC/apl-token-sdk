import { Instruction, AccountMeta, Pubkey } from '@saturnbtcio/arch-sdk';
import { TokenInstructionTag } from './instructions';
import { InstructionDeserializationError } from '../errors/instruction-deserialization-error';

export interface InitializeMultisig {
  requiredSigners: number; // u8, number of required signers
}

export const serializeInitializeMultisig = (
  instruction: InitializeMultisig,
): Uint8Array => {
  if (
    !Number.isInteger(instruction.requiredSigners) ||
    instruction.requiredSigners < 0 ||
    instruction.requiredSigners > 255
  ) {
    throw new Error('requiredSigners must be an integer between 0 and 255');
  }
  const buffer = new Uint8Array(2); // tag + requiredSigners
  buffer[0] = TokenInstructionTag.InitializeMultisig;
  buffer[1] = instruction.requiredSigners;
  return buffer;
};

export const deserializeInitializeMultisig = (
  buffer: Uint8Array,
): InitializeMultisig => {
  if (buffer.length < 2) {
    throw new InstructionDeserializationError(
      'Buffer too short for InitializeMultisig',
      buffer[0],
    );
  }
  const tag = buffer[0];
  if (tag !== TokenInstructionTag.InitializeMultisig) {
    throw new InstructionDeserializationError(
      'Invalid tag for InitializeMultisig',
      tag,
    );
  }
  const requiredSigners = Number(buffer[1]);
  return { requiredSigners };
};

export const createInitializeMultisigInstruction = (
  multisigPubkey: Pubkey,
  signerPubkeys: Pubkey[],
  requiredSigners: number,
  programId: Pubkey,
): Instruction => {
  const data = serializeInitializeMultisig({ requiredSigners });
  const accounts: AccountMeta[] = [
    { pubkey: multisigPubkey, is_signer: false, is_writable: true },
    ...signerPubkeys.map((pubkey) => ({
      pubkey,
      is_signer: false,
      is_writable: false,
    })),
  ];
  return {
    program_id: programId,
    accounts,
    data,
  };
};
