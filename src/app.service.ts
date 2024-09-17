import { Injectable } from '@nestjs/common';
import { MailService } from './api/mail/mail.service';

@Injectable()
export class AppService {
  constructor(private mailService: MailService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async thu() {
    this.mailService.sendUserConfirmation('thaiquanh@gmail.com');
    return 123456;
  }
}
