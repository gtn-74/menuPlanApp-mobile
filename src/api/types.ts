import type { components } from './generated/schema';

type Schemas = components['schemas'];

export type RegisterRequest = Schemas['RegisterRequest'];
export type RegisterResponse = Schemas['RegisterResponse'];
export type ConfirmSignUpRequest = Schemas['ConfirmSignUpRequest'];
export type LoginRequest = Schemas['LoginRequest'];
export type LoginResponse = Schemas['LoginResponse'];
export type LogoutRequest = Schemas['LogoutRequest'];
export type RefreshTokenRequest = Schemas['RefreshTokenRequest'];
export type CreateFamilyGroupRequest = Schemas['CreateFamilyGroupRequest'];
export type FamilyGroupResponse = Schemas['FamilyGroupResponse'];
export type CreateInvitationRequest = Schemas['CreateInvitationRequest'];
export type InvitationResponse = Schemas['InvitationResponse'];
export type JoinFamilyGroupRequest = Schemas['JoinFamilyGroupRequest'];
export type UserResponse = Schemas['UserResponse'];
export type UpdateProfileRequest = Schemas['UpdateProfileRequest'];
