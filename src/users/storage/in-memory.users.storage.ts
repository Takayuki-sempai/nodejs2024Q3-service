import { Injectable } from '@nestjs/common';
import { User } from '../entities/user';

@Injectable()
export class InMemoryUsersStorage {
  private users: Map<string, User> = new Map();

  findAll(): User[] {
    return [...this.users.values()];
  }

  findById(id: string): User | undefined {
    return this.users.get(id);
  }

  save(user: User): User {
    this.users.set(user.id, user);
    return user;
  }

  remove(id: string): boolean {
    return this.users.delete(id);
  }
}
