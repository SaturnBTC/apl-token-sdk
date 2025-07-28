import { Instruction, AccountMeta, Pubkey } from '@saturnbtcio/arch-sdk';
import {
  COptionPubkey,
  serializeCOptionPubkey,
  deserializeCOptionPubkey,
} from '../types/pubkey';
import { TokenInstructionTag } from './instructions';
import { InstructionDeserializationError } from '../errors/instruction-deserialization-error';

export enum AuthorityType {
  MintTokens = 0,
  FreezeAccount = 1,
  AccountOwner = 2,
  CloseAccount = 3,
}

export interface SetAuthority {
  authorityType: AuthorityType;
  newAuthority: COptionPubkey;
}

export const serializeSetAuthority = (
  instruction: SetAuthority,
): Uint8Array => {
  const authorityTypeBuffer = new Uint8Array([instruction.authorityType]);
  const newAuthorityBuffer = serializeCOptionPubkey(instruction.newAuthority);

  const buffer = new Uint8Array(
    1 + authorityTypeBuffer.length + newAuthorityBuffer.length,
  );
  buffer[0] = TokenInstructionTag.SetAuthority;
  buffer.set(authorityTypeBuffer, 1);
  buffer.set(newAuthorityBuffer, 1 + authorityTypeBuffer.length);

  return buffer;
};

export const deserializeSetAuthority = (buffer: Uint8Array): SetAuthority => {
  if (buffer.length < 2) {
    throw new InstructionDeserializationError(
      'Buffer too short for SetAuthority',
      buffer[0],
    );
  }

  const tag = buffer[0];
  if (tag !== TokenInstructionTag.SetAuthority) {
    throw new InstructionDeserializationError(
      'Invalid tag for SetAuthority',
      tag,
    );
  }

  const authorityType = Number(buffer[1]);
  if (authorityType > 3) {
    throw new InstructionDeserializationError(
      'Invalid AuthorityType value',
      tag,
    );
  }

  const { value: newAuthority } = deserializeCOptionPubkey(buffer, 2);

  return {
    authorityType: authorityType as AuthorityType,
    newAuthority,
  };
};

export const createSetAuthorityInstruction = (
  ownedPubkey: Pubkey,
  ownerPubkey: Pubkey,
  authorityType: AuthorityType,
  newAuthority: COptionPubkey,
  programId: Pubkey,
  signerPubkeys: Pubkey[] = [],
): Instruction => {
  const data = serializeSetAuthority({ authorityType, newAuthority });

  const accounts: AccountMeta[] = [
    { pubkey: ownedPubkey, is_signer: false, is_writable: true },
    {
      pubkey: ownerPubkey,
      is_signer: signerPubkeys.length === 0,
      is_writable: false,
    },
    ...signerPubkeys.map((pubkey) => ({
      pubkey,
      is_signer: true,
      is_writable: false,
    })),
  ];

  return {
    program_id: programId,
    accounts,
    data,
  };
};
