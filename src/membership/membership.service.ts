
// src/membership/membership.service.ts

import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './membership.entity';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
  ) {}

  findAll(): Promise<Membership[]> {
    return this.membershipRepository.find().catch((error) => {
      throw new InternalServerErrorException('Error retrieving memberships');
    });
  }

  async findDueMemberships(): Promise<Membership[]> {
    const today = new Date().toISOString().slice(0, 10);
    try {
      return await this.membershipRepository
        .createQueryBuilder('membership')
        .where('membership.dueDate = :today', { today })
        .orWhere('membership.isFirstMonth = true AND membership.startDate <= :today', { today })
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving due memberships');
    }
  }

  async updateFirstMonthFlag(id: number): Promise<void> {
    try {
      const updateResult = await this.membershipRepository.update(id, { isFirstMonth: false });
      if (updateResult.affected === 0) {
        throw new NotFoundException(`Membership with ID ${id} not found`);
      }
      
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating first month flag');
    }
  }
}
