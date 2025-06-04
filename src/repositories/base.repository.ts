import { Document, Model } from 'mongoose';

/**
 * Base repository interface that defines common CRUD operations
 */
export interface IBaseRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(item: T): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

/**
 * Base repository class that implements common CRUD operations
 * @template T - Entity type
 */
export abstract class BaseRepository<T> implements IBaseRepository<T> {
  /**
   * Constructor
   * @param model - Mongoose model
   */
  constructor(protected readonly model: Model<any>) {}

  /**
   * Find all entities
   * @returns Promise with array of entities
   */
  async findAll(): Promise<T[]> {
    return await this.model.find().lean() as unknown as T[];
  }

  /**
   * Find entity by ID
   * @param id Entity ID
   * @returns Promise with entity or null if not found
   */
  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).lean() as unknown as T | null;
  }

  /**
   * Create a new entity
   * @param item Entity data
   * @returns Promise with created entity
   */
  async create(item: Partial<T>): Promise<T> {
    const newItem = new this.model(item);
    return await newItem.save() as unknown as T;
  }

  /**
   * Update an entity by ID
   * @param id Entity ID
   * @param item Entity data to update
   * @returns Promise with updated entity or null if not found
   */
  async update(id: string, item: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(
      id,
      { $set: item as any },
      { new: true }
    ).lean() as unknown as T | null;
  }

  /**
   * Delete an entity by ID
   * @param id Entity ID
   * @returns Promise with boolean indicating success
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return result !== null;
  }
}
