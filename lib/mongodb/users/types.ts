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