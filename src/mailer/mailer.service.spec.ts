// src/mailer/mailer.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from './mailer.service';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('MailerService', () => {
  let service: MailerService;
  let sendMailMock: jest.Mock;

  beforeEach(async () => {
    sendMailMock = jest.fn();
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [MailerService],
    }).compile();

    service = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendReminderEmail', () => {
    it('should send an email', async () => {
      sendMailMock.mockResolvedValueOnce(true);

      await service.sendReminderEmail('test@example.com', 'Subject', 'Body');

      expect(sendMailMock).toHaveBeenCalledWith({
        from: process.env.GMAIL_USER,
        to: 'test@example.com',
        subject: 'Subject',
        html: 'Body',
      });
    });

    it('should throw an error if unable to send an email', async () => {
      sendMailMock.mockRejectedValueOnce(new Error('Error'));

      await expect(
        service.sendReminderEmail('test@example.com', 'Subject', 'Body'),
      ).rejects.toThrow('Error sending reminder email');
    });
  });
});
