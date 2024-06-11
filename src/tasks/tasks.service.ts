
// src/tasks/tasks.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MembershipService } from '../membership/membership.service';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class TasksService {
  constructor(
    private membershipService: MembershipService,
    private mailerService: MailerService,
  ) {}

  @Cron('0 0 * * *') // runs daily at midnight
  async handleCron() {
    try {
      const memberships = await this.membershipService.findDueMemberships();
      for (const membership of memberships) {
        try {
          if (membership.isFirstMonth) {
            const subject = `Fitness+ Membership Reminder - ${membership.membershipType}`;
            const body = `
              <p>Dear ${membership.firstName},</p>
              <p>This is a reminder for your upcoming payment for your Fitness+ membership.</p>
              <p>Membership Type: ${membership.membershipType}</p>
              <p>Total Amount: ${membership.totalAmount}</p>
              <p>Due Date: ${membership.dueDate}</p>
              <p><a href="${membership.invoiceLink}">View Invoice</a></p>
              <p>Thank you for being a valued member!</p>
            `;
            await this.mailerService.sendReminderEmail(membership.email, subject, body);
            await this.membershipService.updateFirstMonthFlag(membership.id);
          } else {
            const subject = `Fitness+ Add-on Service Reminder`;
            const body = `
              <p>Dear ${membership.firstName},</p>
              <p>This is a reminder for your upcoming payment for your add-on services.</p>
              <p>Service: ${membership.membershipType}</p>
              <p>Monthly Amount: ${membership.monthlyAmount}</p>
              <p><a href="${membership.invoiceLink}">View Invoice</a></p>
              <p>Thank you for being a valued member!</p>
            `;
            await this.mailerService.sendReminderEmail(membership.email, subject, body);
          }
        } catch (error) {
          console.error(`Error processing membership ${membership.id}:`, error);
        }
      }
    } catch (error) {
      throw new InternalServerErrorException('Error running cron job');
    }
  }
}
