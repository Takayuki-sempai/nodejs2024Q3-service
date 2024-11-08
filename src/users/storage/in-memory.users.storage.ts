import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class InMemoryUsersStorage {
  private users: Map<string, UserEntity> = new Map();

  findAll(): UserEntity[] {
    return [...this.users.values()];
  }

  findById(id: string): UserEntity | undefined {
    return this.users.get(id);
  }

  save(user: UserEntity): UserEntity {
    this.users.set(user.id, user);
    return user;
  }
}
