import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { InMemoryUsersStorage } from './storage/in-memory.users.storage';
import { UserEntity } from './entities/user.entity';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(private readonly usersStorage: InMemoryUsersStorage) {}

  create(createUserDto: CreateUserDto) {
    const entity = {
      ...createUserDto,
      id: uuid4(),
      version: 0,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    } as UserEntity;
    const savedEntity = this.usersStorage.save(entity);
    return this.entityToDto(savedEntity);
  }

  findAll(): UserDto[] {
    return this.usersStorage.findAll().map(this.entityToDto);
  }

  findOne(id: string) {
    const entity = this.usersStorage.findById(id);
    if (!entity) throw new NotFoundException(`User with id ${id} not found`);
    return this.entityToDto(entity);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    const isDeleted = this.usersStorage.remove(id);
    if (!isDeleted) throw new NotFoundException(`User with id ${id} not found`);
  }

  private entityToDto(entity: UserEntity): UserDto {
    return { ...entity } as UserDto;
  }
}
