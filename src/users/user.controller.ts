import { ReviewService } from '../reviews/reviews.service';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { JWTPayloadType } from '../utils/types';
import { Roles } from './decorators/user-role.decorator';
import { userType } from '../utils/enums';
import { AuthRolesGuard } from './guards/auth-roles.guard';
import { UpdateUserDto } from './dtos/update-users.dto';
import { AuthService } from './auth.provider';
import { RessetPasswordDto } from './dtos/resetPassword.dto';
@Controller('api/users')
export class UserController {
  constructor(
    private readonly UserService: UserService,
    private readonly jwtServise: JwtService,
    private readonly AuthService: AuthService
  ) {}

  // Post : ~/api/users/auth/register
  @Post('auth/register')

  /***
   * Create new user
   * @param registerDto data for creating new user
   * @returns JWT (access token)
   */
  public register(@Body() body: RegisterDto) {
    return this.AuthService.register(body);
  }

  @Post('auth/login') //201
  @HttpCode(HttpStatus.OK) // 200
  public login(@Body() body: LoginDto) {
    return this.AuthService.login(body);
  }

  // GET: ~/api/users/curent-user
  @Get('current-user')
  @UseGuards(AuthGuard)
  public getCurrentUser(@CurrentUser() payload: JWTPayloadType) {
    return this.UserService.getCurrentUser(payload.id);
  }

  // Get ~/api/users
  @Get()
  @Roles(userType.ADMIN)
  @UseGuards(AuthRolesGuard)
  public getAll() {
    return this.UserService.getAll();
  }

  // PUT ~/api/users
  @Put()
  @Roles(userType.ADMIN, userType.NORMAL_USER)
  @UseGuards(AuthRolesGuard)
  public updateUser(
    @CurrentUser() paylod: JWTPayloadType,
    @Body() body: UpdateUserDto,
  ) {
    return this.UserService.updateUser(paylod.id, body);
  }

  // DELETE ~/api/users/:id
  @Delete(':id')
  @Roles(userType.ADMIN, userType.NORMAL_USER)
  @UseGuards(AuthRolesGuard)
  public deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() payload: JWTPayloadType,
  ) {
    return this.UserService.deleteUser(id, payload);
  }

  // GET ~/api/users/verify-email/:id/:verificationToken
  @Get("verify-email/:id/:verificationToken")
  public verifyEmail(
    @Param('id' ,ParseIntPipe) id:number,
    @Param('verificationToken') verificationToken:string

  ){

    this.AuthService.verifyEmail(id,verificationToken);

  }

  // POST ~/api/users/sendResetPasswordCode
  @Post("sendResetPasswordCode")
  public async sendResetPasswordCode(@Body('email') email:string){
    return this.AuthService.sendResetPasswordCode(email);
  }

  // POST ~/api/users/verifyResetPasswordCode
  @Post("verifyResetPasswordCode/:code")
  public async verifyResetPasswordCode(
     @Body("email") email: string,
     @Param('code',ParseIntPipe)code:number ){
      return this.AuthService.verifyResetPasswordCode(email,code);
  }
  
  // POST ~/api/users/resetPassword
  @Post("resetPassword")
   public async resetPassword(
     @Body()payload: RessetPasswordDto
    ){
      return this.AuthService.resetPassword(payload);

   }



}
