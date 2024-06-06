import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { CreateUserInput, User } from './User.model';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
              update: jest.fn(),
            },
            conversation: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('findOneById', () => {
    it('should find a user by id', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
      };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      const result = await userService.findOneById(1);
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await userService.findOneById(1);
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const input: CreateUserInput = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
      };
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
      };
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser);

      const result = await userService.createUser(input);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if email already exists', async () => {
      const input: CreateUserInput = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
      };
      const prismaError = new Prisma.PrismaClientKnownRequestError('Email already exists', 'P2002', '1');
      jest.spyOn(prismaService.user, 'create').mockRejectedValue(prismaError);

      await expect(userService.createUser(input)).rejects.toThrow('Email already exists');
    });

    it('should throw an error if user not created', async () => {
      const input: CreateUserInput = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
      };
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(null);

      await expect(userService.createUser(input)).rejects.toThrow('User not created');
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
      };
      jest.spyOn(prismaService.user, 'delete').mockResolvedValue(mockUser);

      const result = await userService.deleteUser(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user not deleted', async () => {
      jest.spyOn(prismaService.user, 'delete').mockResolvedValue(null);

      await expect(userService.deleteUser(1)).rejects.toThrow('User not deleted');
    });
  });

  describe('getConversationByUserId', () => {
    it('should return conversations by user id', async () => {
      const mockConversations = [
        {
          id: 1,
          name: 'test conversation',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
        conversations: mockConversations,
      };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      const result = await userService.getConversationByUserId(1);
      expect(result).toEqual(mockConversations);
    });

    it('should return an empty array if user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await userService.getConversationByUserId(1);
      expect(result).toEqual([]);
    });
  });

  describe('joinConversation', () => {
    it('should join a conversation', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
        conversations: [],
      };
      const mockConversation = {
        id: 1,
        name: 'test conversation',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updatedUser = {
        ...mockUser,
        conversations: [mockConversation],
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(prismaService.conversation, 'findUnique').mockResolvedValue(mockConversation);
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(updatedUser);

      const result = await userService.joinConversation(1, 1);
      expect(result.conversations).toContainEqual(mockConversation);
    });

    it('should throw an error if user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(userService.joinConversation(1, 1)).rejects.toThrow('User not found');
    });

    it('should throw an error if conversation not found', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
        conversations: [],
      };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(prismaService.conversation, 'findUnique').mockResolvedValue(null);

      await expect(userService.joinConversation(1, 1)).rejects.toThrow('Conversation not found');
    });
  });
});
