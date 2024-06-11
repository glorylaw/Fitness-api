// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipModule } from './membership/membership.module';
import { TasksModule } from './tasks/tasks.module';
import { MailerModule } from './mailer/mailer.module';
import { Membership } from './membership/membership.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'fitness',
      entities: [Membership],
      synchronize: true,
    }),
    MembershipModule,
    TasksModule,
    MailerModule,
  ],
})
export class AppModule {}

