import { BaseRepository } from './base.repository';
import Chat, { IChat } from '../models/chats.model';

/**
 * Repository for Chat model operations
 */
export class ChatRepository extends BaseRepository<IChat> {
  constructor() {
    super(Chat);
  }

  /**
   * Find chats by contact number
   * @param contactNumber Contact number
   * @returns Promise with array of chats
   */
  async findByContactNumber(contactNumber: string): Promise<IChat[]> {
    return (await this.model
      .find({ contactNumber })
      .sort({ createdAt: 1 })
      .lean()) as unknown as IChat[];
  }

  /**
   * Find latest chat by contact number
   * @param contactNumber Contact number
   * @returns Promise with latest chat or null if not found
   */
  async findLatestByContactNumber(
    contactNumber: string
  ): Promise<IChat | null> {
    return (await this.model
      .findOne({ contactNumber })
      .sort({ createdAt: -1 })
      .lean()) as unknown as IChat | null;
  }
}
