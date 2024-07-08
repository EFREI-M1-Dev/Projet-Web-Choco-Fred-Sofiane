import { ConversationService } from './Conversation.service';
import { PrismaService } from '../prisma.service';

describe('ConversationService', () => {
  let conversationService: ConversationService;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = new PrismaService();
    conversationService = new ConversationService(prismaService);
  });

  describe('addConversation', () => {
    it('should add a conversation', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
        conversations: [],
      };
      const now = new Date();
      const mockConversation = {
        id: 1,
        name: 'test',
        createdAt: now,
        updatedAt: now,
        ownerId: mockUser.id,
      };

      // Mock the creation of the conversation
      jest.spyOn(prismaService.conversation, 'create').mockResolvedValue(mockConversation);

      // Mock the update of the user to include the new conversation
      jest.spyOn(prismaService.user, 'update').mockResolvedValue({
        ...mockUser,
        conversations: jest.fn().mockReturnValue([mockConversation]) as any,
      });

      const conversation = await conversationService.addConversation('test', mockUser);
      expect(conversation.name).toBe('test');
    });
  });



  describe('updateConversation', () => {
    it('should update a conversation', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
        conversations: [],
      };
      const now = new Date();
      const initialConversation = { id: 1, name: 'initial', createdAt: now, updatedAt: now, ownerId: mockUser.id };
      const updatedConversation = { id: 1, name: 'updated', createdAt: now, updatedAt: now, ownerId: mockUser.id };

      // Mock the creation of the conversation
      jest.spyOn(prismaService.conversation, 'create').mockResolvedValue(initialConversation);
      jest.spyOn(prismaService.user, 'update').mockResolvedValue({
        ...mockUser,
        conversations: jest.fn().mockReturnValue([initialConversation]) as any,
      });

      await conversationService.addConversation('initial', mockUser);

      // Mock the update of the conversation
      jest.spyOn(prismaService.conversation, 'update').mockResolvedValue(updatedConversation);

      const conversation = await conversationService.updateConversation(1, 'updated');
      expect(conversation.name).toBe('updated');
    });
  });


  describe('deleteConversation', () => {
    it('should delete a conversation', async () => {
      jest.spyOn(prismaService.conversation, 'delete').mockResolvedValue(undefined);

      const conversation = await conversationService.deleteConversation(1);
      expect(conversation).toBeUndefined();
    });
  });

  describe('findOneById', () => {
    it('should find a conversation by id', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
        conversations: [],
      };
      const now = new Date();
      const mockConversation = { id: 1, name: 'test', createdAt: now, updatedAt: now , ownerId: mockUser.id};
      jest.spyOn(prismaService.conversation, 'findUnique').mockResolvedValue(mockConversation);

      const conversation = await conversationService.findOneById(1);
      expect(conversation.id).toBe(1);
    });
  });
});