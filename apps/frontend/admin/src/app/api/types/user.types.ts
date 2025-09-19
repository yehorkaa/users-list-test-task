export type UserRole = 'admin' | 'editor' | 'viewer';

export interface UserDto {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
}

export interface CreateUserDto {
  name: string;
  email: string;
  roles: UserRole[];
}


