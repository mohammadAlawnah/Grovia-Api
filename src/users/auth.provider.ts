import { Message } from './../../node_modules/postcss/lib/result.d';
import { MailService } from './../mail/mail.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dtos/register.dto';
import { AccessTokenType, JWTPayloadType } from 'src/utils/types';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dtos/login.dto';
import { Repository, Like } from 'typeorm';
import { error } from 'console';
import { randomBytes, randomInt } from 'node:crypto';
import { RessetPasswordDto } from './dtos/resetPassword.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtServise: JwtService,
    private readonly mailServise: MailService,
  ) {}

  /**
   * Register New User
   * @param registerDto data for User To Create New User
   * @returns JWT (assess token)
   */
  public async register(registerDto: RegisterDto) {
    const { email, password, username } = registerDto;

    const userFromDb = await this.userRepository.findOne({ where: { email } });
    if (userFromDb) throw new BadRequestException('user already exist');

    const hashedPassword = await this.hashPassword(password);

    let newUser = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
      verificationToken: randomBytes(32).toString('hex'), // create random text like : dkmvubvjnvfffk848fbskjb5
    });

    newUser = await this.userRepository.save(newUser);
    const link = this.generateLink(newUser.id, newUser.verificationToken);

    await this.mailServise.sendVerifyEmailTemplate(email, link);

    return {
      message:
        'Verification token has been sent to ypur email, please verify your email addres',
    };
  }

  /**
   * Login User
   * @param loginDto data for login to user account
   * @returns JWT (assess token)
   */

  public async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new BadRequestException('invalid email or password');

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid Password');
    }

    if (!user.isAccountVerified) {
      let verificationToken = user.verificationToken;

      if (!verificationToken) {
        user.verificationToken = randomBytes(32).toString('hex');
        const result = await this.userRepository.save(user);
        verificationToken = result.verificationToken;
      }

      const link = this.generateLink(user.id, verificationToken);
      await this.mailServise.sendVerifyEmailTemplate(email, link);

      return {
        message:
          'Verification token has been sent to ypur email, please verify your email addres',
      };
    }

    // @TODO ---> Generate JWT Token
    const accessToken = await this.generateJWT({
      id: user.id,
      userType: user.usertype,
    });

    return { accessToken };
  }

  public async verifyEmail(userId: number, verificationToken: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) throw new NotFoundException('user not found');

    if (user.verificationToken === null) {
      throw new NotFoundException('There is no verification token');
    }
    if (user.verificationToken !== verificationToken) {
      throw new NotFoundException('invalid link');
    }

    user.isAccountVerified = true;
    user.verificationToken = null;

    await this.userRepository.save(user);
    return {
      message: 'your email has been verified, please login to your account',
    };
  }

  public async sendResetPasswordCode(email: string) {
    console.log(email)
    const user = await this.userRepository.findOne({ where: { email:email } });

    if (!user)
      throw new BadRequestException('user with given email does not exist');

    // user.resetPasswordToken = randomBytes(32).toString("hex");
    const resetCode = randomInt(1000, 10000);
    user.resetPasswordCode = resetCode;

    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
    await this.userRepository.save(user);

    await this.mailServise.sendResetPasswordCode(
      user.email,
      user.resetPasswordCode,
    );

    return {
      message:
        'Reset Password Code has been sent to your email, please verify your email addres',
    };
  }

  public async verifyResetPasswordCode(email: string, code: number) {
    const user = await this.userRepository.findOne({ where: { email } });

    // user not found
    if (!user) throw new BadRequestException('User not found');

    if (user.resetPasswordCode === null || user.resetPasswordExpires === null) {
      throw new BadRequestException('No reset password request found');
    }

    // Verify Exper Date
    if (user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Code expired');
    }

    // Verify Code
    if (user.resetPasswordCode !== code) {
      throw new BadRequestException('Invalid code');
    }

    user.resetPasswordCode = null;
    user.resetPasswordExpires = null;
    user.isResetCodeVerified = true;

    await this.userRepository.save(user);

    return { message: 'Code verified successfully' };
  }

  public async resetPassword( payload: RessetPasswordDto) {
    const user = await this.userRepository.findOne({ where: { email:payload.email } });

    if (!user) {
      throw new BadRequestException('not user found');
    }

    if (!user.isResetCodeVerified) {
      throw new BadRequestException('You must verify code first');
    }

    if (payload.password !== payload.verifyPassword) {
      throw new BadRequestException('password not match');
    }
    const hashPassword = await this.hashPassword(payload.password);

    user.password = hashPassword;
    user.isResetCodeVerified = false;

    await this.userRepository.save(user);

    return { message: 'Password reset successfully' };
  }

  /**
   * Hashing password
   * @param password plain text password
   * @returns hashed password
   */

  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Generate Json Web Token
   * @param payload JWT payload
   * @returns token
   */
  private generateJWT(payload: JWTPayloadType): Promise<string> {
    return this.jwtServise.signAsync(payload);
  }

  private generateLink(userId: number, verificationToken: string | null) {
    const link = `http://localhost:3000/api/users/verify-email/${userId}/${verificationToken}`;
    return link;
  }
}
