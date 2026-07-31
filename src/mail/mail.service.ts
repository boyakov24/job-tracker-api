import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as Handlebars from 'handlebars';

import { SendReminderEmailOptions } from './interfaces/reminder-email-options.interface';

@Injectable()
export class MailService implements OnModuleInit {
  private transporter: Transporter;
  private reminderTemplate!: Handlebars.TemplateDelegate;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('SMTP_HOST'),
      port: this.configService.getOrThrow<number>('SMTP_PORT'),
      auth: {
        user: this.configService.getOrThrow<string>('SMTP_USER'),
        pass: this.configService.getOrThrow<string>('SMTP_PASSWORD'),
      },
    });
  }

  async onModuleInit() {
    try {
      await this.transporter.verify();

      const isProd = __dirname.includes('dist');
      const templatePath = path.join(
        process.cwd(),
        isProd ? 'dist' : 'src',
        'mail',
        'templates',
        'reminder.hbs',
      );

      const source = fs.readFileSync(templatePath, 'utf8');
      this.reminderTemplate = Handlebars.compile(source);

      console.log('SMTP connection established');
    } catch (error) {
      console.log('SMTP connection failed:', error);
    }
  }

  async sendTestEmail(to: string) {
    await this.transporter.sendMail({
      from: this.configService.getOrThrow<string>('MAIL_FROM'),
      to,
      subject: 'Job Tracker Test',
      text: 'Congratulations! Your Mailservice is working.',
    });
  }

  async sendReminder(options: SendReminderEmailOptions) {
    const html = this.reminderTemplate({
      company: options.company,
      position: options.position,
      note: options.note,
    });

    await this.transporter.sendMail({
      from: this.configService.getOrThrow<string>('MAIL_FROM'),
      to: options.to,
      subject: `Reminder: ${options.company}`,
      html: html,
    });
  }
}
