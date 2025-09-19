import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { USER_ROLES, UserRole } from './users.const';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findAll(): Promise<User[]> {
    try {
      const users = await this.userRepository.find();
      return users;
    } catch (error) {
      // Wrote about logs in Readme.md in 2)
      Logger.error('USERS SERVICE: Failed to get users', error);
      throw new InternalServerErrorException('Failed to get users');
    }
  }

  getUserRoles(): UserRole[] {
    // Wrote a thought about this in Readme.md in 1)
    return Object.values(USER_ROLES);
  }

  async updateRoles(id: string, roles: UserRole[]): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      Logger.error('USERS SERVICE: User not found', { id, roles });
      throw new NotFoundException('User not found');
    }
    try {
      user.roles = roles;
      const updatedUser = await this.userRepository.save(user);
      return updatedUser;
    } catch (error) {
      Logger.error('USERS SERVICE: Failed to update roles', error);
      throw new InternalServerErrorException('Failed to update roles');
    }
  }

  async createUser(body: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(body);
    try {
      const createdUser = await this.userRepository.save(user);
      return createdUser;
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError.code === '23505'
      ) {
        Logger.warn('USERS SERVICE: Duplicate email on create', body.email);
        throw new ConflictException('User with this email already exists');
      }
      Logger.error('USERS SERVICE: Failed to create user', error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }
}
