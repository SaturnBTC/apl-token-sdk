import { Instruction, AccountMeta, Pubkey } from '@saturnbtcio/arch-sdk';
import { concatBytes, encodeBool, encodeOptionString, encodePubkey, encodeString, encodeU8, encodeVecPairsString } from './borsh';

export enum MetadataInstructionTag {
  CreateMetadata = 0,
  UpdateMetadata = 1,
  CreateAttributes = 2,
  ReplaceAttributes = 3,
  TransferAuthority = 4,
  MakeImmutable = 5,
}

export interface CreateMetadataIxData {
  name: string;
  symbol: string;
  image: string;
  description: string;
  immutable: boolean;
}

export interface UpdateMetadataIxData {
  name?: string | null;
  symbol?: string | null;
  image?: string | null;
  description?: string | null;
}

export interface CreateAttributesIxData {
  data: Array<[string, string]>;
}

export interface ReplaceAttributesIxData {
  data: Array<[string, string]>;
}

export interface TransferAuthorityIxData {
  new_authority: Pubkey;
}

export type MetadataInstructionValueMap = {
  [MetadataInstructionTag.CreateMetadata]: CreateMetadataIxData;
  [MetadataInstructionTag.UpdateMetadata]: UpdateMetadataIxData;
  [MetadataInstructionTag.CreateAttributes]: CreateAttributesIxData;
  [MetadataInstructionTag.ReplaceAttributes]: ReplaceAttributesIxData;
  [MetadataInstructionTag.TransferAuthority]: TransferAuthorityIxData;
  [MetadataInstructionTag.MakeImmutable]: {};
};

export type MetadataInstruction = {
  [K in keyof MetadataInstructionValueMap]: {
    type: K;
    value: MetadataInstructionValueMap[K];
  };
}[keyof MetadataInstructionValueMap];

export const serializeCreateMetadata = (value: CreateMetadataIxData): Uint8Array => {
  return concatBytes(
    encodeU8(MetadataInstructionTag.CreateMetadata),
    encodeString(value.name),
    encodeString(value.symbol),
    encodeString(value.image),
    encodeString(value.description),
    encodeBool(value.immutable),
  );
};

export const serializeUpdateMetadata = (value: UpdateMetadataIxData): Uint8Array => {
  return concatBytes(
    encodeU8(MetadataInstructionTag.UpdateMetadata),
    encodeOptionString(value.name ?? null),
    encodeOptionString(value.symbol ?? null),
    encodeOptionString(value.image ?? null),
    encodeOptionString(value.description ?? null),
  );
};

export const serializeCreateAttributes = (value: CreateAttributesIxData): Uint8Array => {
  return concatBytes(
    encodeU8(MetadataInstructionTag.CreateAttributes),
    encodeVecPairsString(value.data),
  );
};

export const serializeReplaceAttributes = (value: ReplaceAttributesIxData): Uint8Array => {
  return concatBytes(
    encodeU8(MetadataInstructionTag.ReplaceAttributes),
    encodeVecPairsString(value.data),
  );
};

export const serializeTransferAuthority = (value: TransferAuthorityIxData): Uint8Array => {
  return concatBytes(
    encodeU8(MetadataInstructionTag.TransferAuthority),
    encodePubkey(value.new_authority),
  );
};

export const serializeMakeImmutable = (): Uint8Array => {
  return encodeU8(MetadataInstructionTag.MakeImmutable);
};

// Builders for Instructions with account metas

// CreateMetadata
export const createCreateMetadataInstruction = (
  params: {
    payer: Pubkey;
    systemProgram: Pubkey;
    mint: Pubkey;
    metadata: Pubkey;
    mintAuthority: Pubkey;
  },
  data: CreateMetadataIxData,
  programId: Pubkey,
): Instruction => {
  const accounts: AccountMeta[] = [
    { pubkey: params.payer, is_signer: true, is_writable: true },
    { pubkey: params.systemProgram, is_signer: false, is_writable: false },
    { pubkey: params.mint, is_signer: false, is_writable: false },
    { pubkey: params.metadata, is_signer: false, is_writable: true },
    { pubkey: params.mintAuthority, is_signer: true, is_writable: false },
  ];
  return {
    program_id: programId,
    accounts,
    data: serializeCreateMetadata(data),
  };
};

// UpdateMetadata
export const createUpdateMetadataInstruction = (
  params: {
    metadata: Pubkey;
    updateAuthority: Pubkey;
  },
  data: UpdateMetadataIxData,
  programId: Pubkey,
): Instruction => {
  const accounts: AccountMeta[] = [
    { pubkey: params.metadata, is_signer: false, is_writable: true },
    { pubkey: params.updateAuthority, is_signer: true, is_writable: false },
  ];
  return { program_id: programId, accounts, data: serializeUpdateMetadata(data) };
};

// CreateAttributes
export const createCreateAttributesInstruction = (
  params: {
    payer: Pubkey;
    systemProgram: Pubkey;
    mint: Pubkey;
    attributes: Pubkey;
    updateAuthority: Pubkey;
    metadata: Pubkey;
  },
  data: CreateAttributesIxData,
  programId: Pubkey,
): Instruction => {
  const accounts: AccountMeta[] = [
    { pubkey: params.payer, is_signer: true, is_writable: true },
    { pubkey: params.systemProgram, is_signer: false, is_writable: false },
    { pubkey: params.mint, is_signer: false, is_writable: false },
    { pubkey: params.attributes, is_signer: false, is_writable: true },
    { pubkey: params.updateAuthority, is_signer: true, is_writable: false },
    { pubkey: params.metadata, is_signer: false, is_writable: false },
  ];
  return {
    program_id: programId,
    accounts,
    data: serializeCreateAttributes(data),
  };
};

// ReplaceAttributes
export const createReplaceAttributesInstruction = (
  params: {
    attributes: Pubkey;
    updateAuthority: Pubkey;
    metadata: Pubkey;
  },
  data: ReplaceAttributesIxData,
  programId: Pubkey,
): Instruction => {
  const accounts: AccountMeta[] = [
    { pubkey: params.attributes, is_signer: false, is_writable: true },
    { pubkey: params.updateAuthority, is_signer: true, is_writable: false },
    { pubkey: params.metadata, is_signer: false, is_writable: false },
  ];
  return {
    program_id: programId,
    accounts,
    data: serializeReplaceAttributes(data),
  };
};

// TransferAuthority
export const createTransferAuthorityInstruction = (
  params: { metadata: Pubkey; currentAuthority: Pubkey },
  data: TransferAuthorityIxData,
  programId: Pubkey,
): Instruction => {
  const accounts: AccountMeta[] = [
    { pubkey: params.metadata, is_signer: false, is_writable: true },
    { pubkey: params.currentAuthority, is_signer: true, is_writable: false },
  ];
  return {
    program_id: programId,
    accounts,
    data: serializeTransferAuthority(data),
  };
};

// MakeImmutable
export const createMakeImmutableInstruction = (
  params: { metadata: Pubkey; currentAuthority: Pubkey },
  programId: Pubkey,
): Instruction => {
  const accounts: AccountMeta[] = [
    { pubkey: params.metadata, is_signer: false, is_writable: true },
    { pubkey: params.currentAuthority, is_signer: true, is_writable: false },
  ];
  return { program_id: programId, accounts, data: serializeMakeImmutable() };
};


