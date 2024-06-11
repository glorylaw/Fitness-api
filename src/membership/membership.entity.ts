// src/membership/membership.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Membership {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  membershipType: string;

  @Column()
  startDate: string;  // Format: YYYY-MM-DD

  @Column({ nullable: true })
  dueDate: string;  // Format: YYYY-MM-DD

  @Column('decimal')
  totalAmount: number;

  @Column('decimal')
  monthlyAmount: number;

  @Column()
  email: string;

  @Column()
  isFirstMonth: boolean;

  @Column({ nullable: true })
  invoiceLink: string;
}
