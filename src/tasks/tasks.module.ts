// src/tasks/tasks.module.ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks.service';
import { MembershipModule } from '../membership/membership.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [ScheduleModule.forRoot(), MembershipModule, MailerModule],
  providers: [TasksService],
})
export class TasksModule {}
