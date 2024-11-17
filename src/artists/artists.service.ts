import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { plainToInstance } from 'class-transformer';
import { Artist } from './entities/artist.entity';
import { ArtistDto } from './dto/artist.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArtistsService {
  constructor(private readonly storage: PrismaService) {}

  async create(createArtistDto: CreateArtistDto): Promise<ArtistDto> {
    const savedEntity = await this.storage.artist.create({
      data: createArtistDto,
    });
    return this.entityToDto(savedEntity);
  }

  async findAll(): Promise<ArtistDto[]> {
    const entities = await this.storage.artist.findMany();
    return entities.map(this.entityToDto);
  }

  async findOne(id: string): Promise<ArtistDto> {
    const entity = await this.storage.artist.findUnique({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    return this.entityToDto(entity);
  }

  async update(
    id: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<ArtistDto> {
    // const entity = await this.storage.artist.findUnique({ where: { id } });
    const updatedEntity = await this.storage.artist.update({
      where: { id },
      data: updateArtistDto,
    });
    if (!updatedEntity) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    // const updatedEntity = this.storage.save(
    //   plainToInstance(Artist, { id, ...updateArtistDto }),
    // );
    return this.entityToDto(updatedEntity);
  }

  async remove(id: string) {
    const deleted = await this.storage.artist.deleteMany({ where: { id } });
    if (deleted.count != 1) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
  }

  private entityToDto(entity: Artist): ArtistDto {
    return plainToInstance(ArtistDto, entity, {
      excludeExtraneousValues: true,
    });
  }
}
