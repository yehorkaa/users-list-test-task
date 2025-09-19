import { USER_ROLES, UserRole } from "../users.const";
import { IsArray, IsEnum, ArrayNotEmpty } from "class-validator";

export class UpdateRolesDto {
    @IsArray()
    @ArrayNotEmpty({ message: 'roles must contain at least 1 item' })
    @IsEnum(USER_ROLES, { each: true })
    roles: UserRole[];
}