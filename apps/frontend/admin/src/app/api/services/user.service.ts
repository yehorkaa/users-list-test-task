import { usersPlatformApiClient } from '../clients/users-platform-api.client';
import { API_ENDPOINTS } from '../const/api-endpoints.const';
import { CreateUserDto, UserDto, UserRole } from '../types/user.types';

export const getUsers = async (): Promise<UserDto[]> => {
  const { data } = await usersPlatformApiClient.get<UserDto[]>(
    API_ENDPOINTS.USERS
  );
  return data;
};

export const getRoles = async (): Promise<UserRole[]> => {
  const { data } = await usersPlatformApiClient.get<UserRole[]>(
    `${API_ENDPOINTS.USERS}${API_ENDPOINTS.ROLES}`
  );
  return data;
};

export const updateUserRoles = async (
  userId: string,
  roles: UserRole[]
): Promise<UserDto> => {
  const { data } = await usersPlatformApiClient.patch<UserDto>(
    API_ENDPOINTS.UPDATE_ROLES(userId),
    { roles }
  );
  return data;
};

export const createUser = async (payload: CreateUserDto): Promise<UserDto> => {
  const { data } = await usersPlatformApiClient.post<UserDto>(
    API_ENDPOINTS.CREATE_USER,
    payload
  );
  return data;
};
