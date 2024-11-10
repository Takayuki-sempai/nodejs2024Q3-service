import { Injectable } from '@nestjs/common';
import { User } from '../entities/user';

@Injectable()
export class InMemoryUsersStorage {
  private entities: Map<string, User> = new Map();

  findAll(): User[] {
    return [...this.entities.values()];
  }

  findById(id: string): User | undefined {
    return this.entities.get(id);
  }

  save(entity: User): User {
    this.entities.set(entity.id, entity);
    return entity;
  }

  remove(id: string): boolean {
    return this.entities.delete(id);
  }
}
