import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly storage: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const savedEntity = await this.storage.user.create({ data: createUserDto });
    return this.entityToDto(savedEntity);
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.storage.user.findMany();
    return users.map(this.entityToDto);
  }

  async findOne(id: string): Promise<UserDto> {
    const entity = await this.storage.user.findUnique({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.entityToDto(entity);
  }

  async update(id: string, updateUserDto: UpdatePasswordDto): Promise<UserDto> {
    const entity = await this.storage.user.findUnique({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    if (entity.password != updateUserDto.oldPassword) {
      throw new ForbiddenException(`OldPassword is wrong`);
    }
    const updatedEntity = await this.storage.user.update({
      where: { id },
      data: {
        password: updateUserDto.newPassword,
        version: entity.version + 1,
      },
    });
    return this.entityToDto(updatedEntity);
  }

  async remove(id: string) {
    const deleted = await this.storage.user.deleteMany({ where: { id } });
    if (deleted.count != 1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  private entityToDto(entity: User): UserDto {
    return plainToInstance(
      UserDto,
      {
        ...entity,
        createdAt: entity.createdAt.getTime(),
        updatedAt: entity.updatedAt.getTime(),
      },
      { excludeExtraneousValues: true },
    );
  }
}
