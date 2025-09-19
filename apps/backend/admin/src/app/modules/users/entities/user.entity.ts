import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { USER_ROLES, UserRole } from "../users.const";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column()
    @Index({ unique: true })
    email: string;

    @Column({
        type: 'enum',
        enum: USER_ROLES,
        array: true,
        default: [USER_ROLES.VIEWER],
    })
    roles: UserRole[];
}