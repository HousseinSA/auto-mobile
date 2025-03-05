export interface UserCreateInput {
  username: string
  password: string
  fullName: string
  phoneNumber: string
  email: string
}

export interface UserUpdateInput {
  fullName?: string
  phoneNumber?: string
  newUsername?: string
  email?: string
}

export interface PasswordUpdateInput {
  currentPassword: string
  newPassword: string
}

export interface PasswordResetInput {
  email: string
  token?: string
  newPassword?: string
}

export interface ResetTokenData {
  token: string
  expiry: Date
}
