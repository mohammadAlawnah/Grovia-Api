import { Inject, Module,forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
import { AuthService } from './auth.provider';
import { MailModule } from '../mail/mail.module';
@Module({
    controllers:[UserController],
    providers : [UserService,AuthService],
    exports: [UserService],
    imports: [
        MailModule,
        TypeOrmModule.forFeature([User]) ,

        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory : (config: ConfigService) =>{
                return{
                    global: true,
                    secret : config.getOrThrow<StringValue>("JWT_SECRET"),
                    signOptions : {expiresIn: config.getOrThrow<StringValue>("JWT_EXPIRES_IN")}
                    
                }
            }// method injection
            

            
         })]
})
export class UsersModule {}





        JwtModule.registerAsync({ // register 
            inject: [ConfigService],
            useFactory : (config: ConfigService) =>{ // method injection
                return {
                    global : true,
                    secret : config.getOrThrow<StringValue>("JWT_SECRET"),
                    signOptions : {expiresIn: config.getOrThrow<StringValue>("JWT_EXPIRES_IN")}
                }
            }
        }

        )