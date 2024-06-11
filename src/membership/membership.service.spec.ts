// src/membership/membership.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembershipService } from './membership.service';
import { Membership } from './membership.entity';

describe('MembershipService', () => {
  let service: MembershipService;
  let repository: Repository<Membership>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembershipService,
        {
          provide: getRepositoryToken(Membership),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<MembershipService>(MembershipService);
    repository = module.get<Repository<Membership>>(getRepositoryToken(Membership));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of memberships', async () => {
      const memberships = [{ id: 1, firstName: 'John', lastName: 'Doe', email: 'test@example.com' }] as Membership[];
      jest.spyOn(repository, 'find').mockResolvedValueOnce(memberships);

      expect(await service.findAll()).toBe(memberships);
    });

    it('should throw an error if unable to retrieve memberships', async () => {
      jest.spyOn(repository, 'find').mockRejectedValueOnce(new Error('Error'));

      await expect(service.findAll()).rejects.toThrow('Error retrieving memberships');
    });
  });

  describe('findDueMemberships', () => {
    it('should return an array of due memberships', async () => {
      const memberships = [{ id: 1, firstName: 'John', lastName: 'Doe', email: 'test@example.com' }] as Membership[];
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce(memberships),
      } as any);

      expect(await service.findDueMemberships()).toBe(memberships);
    });

    it('should throw an error if unable to retrieve due memberships', async () => {
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockRejectedValueOnce(new Error('Error')),
      } as any);

      await expect(service.findDueMemberships()).rejects.toThrow('Error retrieving due memberships');
    });
  });

  describe('updateFirstMonthFlag', () => {
    it('should update the isFirstMonth flag', async () => {
      jest.spyOn(repository, 'update').mockResolvedValueOnce({ affected: 1 } as any);

      await service.updateFirstMonthFlag(1);

      expect(repository.update).toHaveBeenCalledWith(1, { isFirstMonth: false });
    });

    it('should throw an error if the membership is not found', async () => {
      jest.spyOn(repository, 'update').mockResolvedValueOnce({ affected: 0 } as any);

      await expect(service.updateFirstMonthFlag(1)).rejects.toThrow('Membership with ID 1 not found');
    });

    it('should throw an error if unable to update the flag', async () => {
      jest.spyOn(repository, 'update').mockRejectedValueOnce(new Error('Error'));

      await expect(service.updateFirstMonthFlag(1)).rejects.toThrow('Error updating first month flag');
    });
  });
});



