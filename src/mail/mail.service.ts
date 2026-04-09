import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, RequestTimeoutException } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async SendLogInEmail(email: string) {
    try {
      const today = new Date();
      await this.mailerService.sendMail({
        to: email,
        from: `<no-reply@Grovia.cpm>`,
        subject: 'Login',
        template: 'login',
        context: { email, today },
      });
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException();
    }
  }

  public async sendVerifyEmailTemplate(email: string, link: string) {
    try {
      const today = new Date();
      await this.mailerService.sendMail({
        to: email,
        from: `<no-reply@Grovia.cpm>`,
        subject: 'Verify your account',
        template: 'verify-email',
        context: { link },
      });
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException();
    }
  }

  public async sendResetPasswordTemplate(
    email: string,
    resetPasswordLink: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: `<no-reply@Grovia.cpm>`,
        subject: 'reset password',
        template: 'reset-password',
        context: { resetPasswordLink },
      });
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException();
    }
  }

  public async sendResetPasswordCode(email:string ,code : number){
    try{
      await this.mailerService.sendMail({
        to:email,
        from:`<no-reply@Grovia.cpm>`,
        subject : 'reset password code',
        template: 'reset-password-code',
        context:{code},
      })
    }catch(error){
      console.log(error);
      throw new RequestTimeoutException();
    }


  }
}




