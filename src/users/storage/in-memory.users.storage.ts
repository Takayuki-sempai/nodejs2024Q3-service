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

  save(user: User): User {
    this.entities.set(user.id, user);
    return user;
  }

  remove(id: string): boolean {
    return this.entities.delete(id);
  }
}
