import { Instruction, AccountMeta, Pubkey } from '@saturnbtcio/arch-sdk';
import { TokenInstructionTag } from './instructions';
import { InstructionDeserializationError } from '../errors/instruction-deserialization-error';
import { COptionPubkey, serializeCOptionPubkey } from '../types/pubkey';

export interface InitializeMint2 {
  decimals: number;
  mintAuthority: Pubkey;
  freezeAuthority: COptionPubkey;
}

export const serializeInitializeMint2 = (
  instruction: InitializeMint2,
): Uint8Array => {
  const freezeAuthorityBytes = serializeCOptionPubkey(
    instruction.freezeAuthority,
  );
  const buffer = new Uint8Array(1 + 1 + 32 + freezeAuthorityBytes.length); // tag (1) + decimals (1) + mintAuthority (32) + freezeAuthority (variable)

  buffer[0] = TokenInstructionTag.InitializeMint2;
  buffer[1] = instruction.decimals;
  buffer.set(instruction.mintAuthority, 2);
  buffer.set(freezeAuthorityBytes, 2 + 32);

  return buffer;
};

export const deserializeInitializeMint2 = (
  buffer: Uint8Array,
): InitializeMint2 => {
  if (buffer.length < 1 + 1 + 32 + 1) {
    throw new InstructionDeserializationError(
      'Buffer too short for InitializeMint2',
      buffer[0],
    );
  }

  const tag = buffer[0];
  if (tag !== TokenInstructionTag.InitializeMint2) {
    throw new InstructionDeserializationError(
      `Invalid tag for InitializeMint2: ${tag}`,
      tag,
    );
  }

  const decimals = Number(buffer[1]);
  const mintAuthority = buffer.slice(2, 2 + 32);

  const freezeAuthorityOption = buffer[2 + 32];
  let freezeAuthority: COptionPubkey;

  if (freezeAuthorityOption === 0) {
    freezeAuthority = { option: 0 };
  } else if (freezeAuthorityOption === 1) {
    if (buffer.length < 2 + 32 + 1 + 32) {
      throw new InstructionDeserializationError(
        'Buffer too short for InitializeMint2 freeze authority',
        tag,
      );
    }
    const freezeAuthorityPubkey = buffer.slice(2 + 32 + 1, 2 + 32 + 1 + 32);
    freezeAuthority = { option: 1, value: freezeAuthorityPubkey };
  } else {
    throw new InstructionDeserializationError(
      `Invalid freeze authority option: ${freezeAuthorityOption}`,
      tag,
    );
  }

  return {
    decimals,
    mintAuthority,
    freezeAuthority,
  };
};

export const createInitializeMint2Instruction = (
  mintPubkey: Pubkey,
  decimals: number,
  mintAuthority: Pubkey,
  freezeAuthority: COptionPubkey,
  programId: Pubkey,
): Instruction => {
  const data = serializeInitializeMint2({
    decimals,
    mintAuthority,
    freezeAuthority,
  });

  const accounts: AccountMeta[] = [
    {
      pubkey: mintPubkey,
      is_signer: false,
      is_writable: true,
    },
  ];

  return {
    program_id: programId,
    accounts,
    data,
  };
};
