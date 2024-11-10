import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserDto } from './dto/user.dto';
import { InMemoryUsersStorage } from './storage/in-memory.users.storage';
import { User } from './entities/user';
import { v4 as uuid4 } from 'uuid';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(private readonly storage: InMemoryUsersStorage) {}

  create(createUserDto: CreateUserDto) {
    const entity = {
      ...createUserDto,
      id: uuid4(),
      version: 1,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    } as User;
    const savedEntity = this.storage.save(entity);
    return this.entityToDto(savedEntity);
  }

  findAll(): UserDto[] {
    return this.storage.findAll().map(this.entityToDto);
  }

  findOne(id: string): UserDto {
    const entity = this.storage.findById(id);
    if (!entity) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.entityToDto(entity);
  }

  update(id: string, updateUserDto: UpdatePasswordDto): UserDto {
    const entity = this.storage.findById(id);
    if (!entity) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    if (entity.password != updateUserDto.oldPassword) {
      throw new ForbiddenException(`OldPassword is wrong`);
    }
    entity.password = updateUserDto.newPassword;
    entity.version++;
    entity.updatedAt = new Date().getTime();
    const updatedEntity = this.storage.save(entity);
    return this.entityToDto(updatedEntity);
  }

  remove(id: string) {
    const isDeleted = this.storage.remove(id);
    if (!isDeleted) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  private entityToDto(entity: User): UserDto {
    return plainToInstance(UserDto, entity, { excludeExtraneousValues: true });
  }
}
