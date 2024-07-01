
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

//  @Cron('0 0 * * *') // runs daily at midnight
 @Cron('* * * * *') // runs every minute
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

/* eslint-disable prettier/prettier */
// import { Injectable } from '@nestjs/common';
// import { Cron } from '@nestjs/schedule';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Membership } from '../membership/membership.entity';
// import { MailerService } from '../mailer/mailer.service';

// @Injectable()
// export class TasksService {
//   constructor(
//     @InjectRepository(Membership)
//     private readonly membershipRepository: Repository<Membership>,
//     private readonly emailService: MailerService,
//   ) {}
//   @Cron('* * * * * *')  // for seconds
//   //  @Cron('0 0 * * *') // for every night
//   async handleCron() {
//     const memberships = await this.membershipRepository.find();
//     const now = new Date();
//     // console.log(now, memberships)

//     const emailPromises = memberships.map(async (membership) => {
//       // console.log(membership)
//       if (membership.isFirstMonth) {
//         // console.log(membership.isFirstMonth)
//         const reminderDate = new Date(membership.dueDate);
//         // console.log(reminderDate)

//         reminderDate.setDate(reminderDate.getDate() - 7);


//         if (now >= reminderDate && now < membership.dueDate) {
//           // console.log(membership)
//           return this.sendEmail(membership, true);
//         }
//       } else {
//         const dueDate = new Date(membership.dueDate);
//         if (now.getMonth() === dueDate.getMonth() && now.getFullYear() === dueDate.getFullYear()) {
//           return this.sendEmail(membership, false);
//         }
//       }
//       return null;
//     });
// // console.log(await Promise.all(emailPromises))
//     // await Promise.all(emailPromises);

// const results = await Promise.all(emailPromises);
//     console.log(results.filter(result => result !== null)); // Log non-null results
//     return results;
//   }

//   private async sendEmail(membership: Membership, isFirstMonth: boolean): Promise<string> {
//     const subject = `Fitness+ Membership Reminder - ${membership.membershipType}`;
//     const body = isFirstMonth
//       ? `Reminder: Your annual membership fee and first month's add-on service charges are due soon. Here is your invoice: https://`
//       : `Reminder: Your monthly add-on service charges are due soon. Here is your invoice: https://`;

//     await this.emailService.sendReminderEmail(membership.email, subject, body);
//     return `Email sent to ${membership.email}`;
//   }
// }
