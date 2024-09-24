import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

require('dotenv').config()
@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({

      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    try{
        await this.transporter.sendMail({
            from: `"RENET MARKETING" ${process.env.EMAIL_USER}`,
            to: email,
            subject: 'Password Reset Verification Code',
            text: `Your password reset verification code is: ${code}`,
          });
    }catch(err) {
        throw err
    }
    
  }
}
