import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JWTPayloadType } from '../utils/types';
import { UpdateUserDto } from './dtos/update-users.dto';
import { userType } from '../utils/enums';
import { AuthService } from './auth.provider';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly AuthService: AuthService,
  ) {}

  /**
   * Get current user (logged in user)
   * @param id id of the user logged in user
   * @returns  the user from the database
   */
  public async getCurrentUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  /**
   * Get all users from the database
   * @returns collection of users
   */
  public getAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Update user
   * @param id id of the logged in user
   * @param updateUserDto date for updating the user
   * @returns update user from the database
   */
  public async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    const { username, password } = updateUserDto;

    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (username) {
      user.username = username;
    }

    if (password) {
      user.password = await this.AuthService.hashPassword(password);
    }

    console.log('xxx = ', user);

    this.userRepository.save(user);
    return this.userRepository.save(user);
  }

  /**
   * Delete user
   * @param id id of the user
   * @param paylod JWTPayload
   * @returns a success message
   */
  public async deleteUser(id: number, paylod: JWTPayloadType) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('user Not Found');
    }
    if (user.id === paylod?.id || paylod.userType === userType.ADMIN) {
      await this.userRepository.remove(user);
      return { message: 'User has Been deleted' };
    }
    throw new ForbiddenException('access denied | you are not allowed');
  }
}
