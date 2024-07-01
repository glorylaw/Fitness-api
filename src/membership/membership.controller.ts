
// src/membership/membership.controller.ts
import { Controller, Get, InternalServerErrorException,Post, Body} from '@nestjs/common';
import { MembershipService } from './membership.service';
import { Membership } from './membership.entity';

@Controller('memberships')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Get()
  async findAll() {
    try {
      return await this.membershipService.findDueMemberships();
     // return await this.membershipService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving memberships');
    }
  }

  @Post()
  async createMembership(@Body() membership: Membership): Promise<Membership> {
    return this.membershipService.createMembership(membership);
  }
}
