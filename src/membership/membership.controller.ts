
// src/membership/membership.controller.ts
import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { MembershipService } from './membership.service';

@Controller('memberships')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Get()
  async findAll() {
    try {
      return await this.membershipService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving memberships');
    }
  }
}
